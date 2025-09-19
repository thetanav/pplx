import { z } from "zod";
import {
  streamText,
  convertToModelMessages,
  tool,
  ToolSet,
  InferUITools,
  UIMessage,
  UIDataTypes,
  stepCountIs,
  experimental_createMCPClient,
  createIdGenerator,
  LanguageModel,
} from "ai";
import { getModel } from "@/lib/models";

export const maxDuration = 30;

const localTools = {
  // make tools here
} satisfies ToolSet;

export type ChatTools = InferUITools<typeof localTools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

const RequestBodySchema = z.object({
  messages: z.array(z.unknown()),
  model: z.string().optional(),
  useTool: z.boolean().optional().default(true),
  // remove it from here
  mcpGatewayUrl: z.string().url().optional(),
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

  const { messages, model = "default", useTool, mcpGatewayUrl } = parsed.data;
  const MCP_GATEWAY_URL = mcpGatewayUrl || process.env.MCP_GATEWAY_URL;

  let mcpClient:
    | Awaited<ReturnType<typeof experimental_createMCPClient>>
    | undefined;
  let mergedTools: ToolSet = localTools;

  if (useTool && MCP_GATEWAY_URL) {
    try {
      mcpClient = await experimental_createMCPClient({
        name: "ultraproai-mcp-client",
        transport: { type: "sse", url: MCP_GATEWAY_URL },
      });

      // fetch tools from the MCP server and merge them with local tools
      const mcpTools = await mcpClient!.tools();
      mergedTools = { ...localTools, ...mcpTools };

      console.log("MCP tools loaded:", Object.keys(mcpTools));
    } catch (err) {
      console.error(
        "Failed to connect to MCP Gateway at",
        MCP_GATEWAY_URL,
        err
      );
      mcpClient = undefined;
    }
  }

  const result = streamText({
    model: getModel(model) as LanguageModel,
    messages: convertToModelMessages(messages as any),
    system: `You are an agentic AI assistant.

            - Your goal is to complete the user’s request using the best available tools and MCP servers.
            - Always perform the task directly.
            - When you use tools, write a short, human-like explanation of what you are doing or found, in clear and concise text.
            - Do not show long reasoning, technical logs, or hidden details.
            - Keep answers natural, to the point, and without emojis.`,
    tools: useTool ? mergedTools : undefined,
    stopWhen: stepCountIs(20),
    abortSignal: (req as any).signal,
    maxOutputTokens: 1200,
    onError: (err) => {
      console.error("streamText error:", err);
    },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages as ChatMessage[],
    generateMessageId: createIdGenerator({ prefix: "msg", size: 12 }),
    sendSources: true,
    sendReasoning: true,

    onFinish: async () => {
      if (mcpClient) {
        try {
          await mcpClient.close();
        } catch (e) {
          console.warn("Failed to close MCP client:", e);
        }
      }
    },
  });
}
