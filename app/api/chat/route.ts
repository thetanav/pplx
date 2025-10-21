import { z } from "zod";
import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  LanguageModel,
  experimental_createMCPClient,
} from "ai";
import { models } from "@/lib/models";
import { localTools } from "@/lib/tools";
import { systemPrompt } from "@/lib/prompt";

export const maxDuration = 30;

export type ChatTools = typeof localTools;

const RequestBodySchema = z.object({
  messages: z.array(z.unknown()),
  model: z.string(),
  mcpGatewayUrl: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RequestBodySchema.safeParse(body);

  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid request body",
        details: parsed.error.format(),
      }),
      {
        status: 400,
        headers: { "content-type": "application/json" },
      }
    );
  }

  const { messages, model, mcpGatewayUrl } = parsed.data;

  let mcpClient:
    | Awaited<ReturnType<typeof experimental_createMCPClient>>
    | undefined;
  let mergedTools = localTools;

  // Connect to MCP server if URL is provided
  if (mcpGatewayUrl) {
    try {
      mcpClient = await experimental_createMCPClient({
        name: "simp-ai-mcp-client",
        transport: { type: "sse", url: mcpGatewayUrl },
      });

      // Fetch tools from the MCP server and merge them with local tools
      const mcpTools = await mcpClient.tools();
      mergedTools = { ...localTools, ...mcpTools };

      // console.log("MCP tools loaded:", Object.keys(mcpTools));
    } catch (err) {
      console.error("Failed to connect to MCP Gateway at", mcpGatewayUrl, err);
      mcpClient = undefined;
    }
  }

  const result = streamText({
    model: models.find((mo) => mo.value == model)?.end as LanguageModel,
    messages: convertToModelMessages(
      messages as unknown as Parameters<typeof convertToModelMessages>[0]
    ),
    system: systemPrompt,
    tools: models.find((m) => m.value === model)?.tools
      ? mergedTools
      : undefined,
    stopWhen: stepCountIs(20),
    maxOutputTokens: 4000,
    onError: (err) => {
      console.error("streamText error:", err);
    },
  });

  return result.toUIMessageStreamResponse({
    onFinish: async () => {
      if (mcpClient) {
        try {
          await mcpClient.close();
        } catch (e) {
          console.warn("Failed to close MCP client:", e);
        }
      }
    },
    messageMetadata: ({ part }) => {
      if (part.type === "finish") {
        return { stats: part.totalUsage };
      }
    },
  });
}
