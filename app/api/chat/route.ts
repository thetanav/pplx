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

export const maxDuration = 30; // seconds (kept from your original file)

// -----------------------------
// Local tools (server-side) — simple examples
// -----------------------------
const localTools = {
  getTime: tool({
    description: "Returns the current time in ISO format",
    inputSchema: z.object({}).optional(),
    execute: async () => ({ time: new Date().toISOString() }),
  }),

  getWeather: tool({
    description: "Fetch weather information for a specific location (demo)",
    inputSchema: z.object({ location: z.string().describe("Location name") }),
    execute: async ({ location }, { toolCallId }) => {
      const code = Array.from(location || "").reduce(
        (s, c) => s + c.charCodeAt(0),
        0
      );
      const temp = 10 + (code % 25);

      return {
        toolCallId,
        location,
        temperature: `${temp}°C`,
        conditions: "Partly Cloudy",
        humidity: `${30 + (code % 50)}%`,
        windSpeed: `${5 + (code % 40)} km/h`,
        lastUpdated: new Date().toISOString(),
      };
    },
  }),
} satisfies ToolSet;

export type ChatTools = InferUITools<typeof localTools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

const RequestBodySchema = z.object({
  messages: z.array(z.unknown()),
  model: z.string().optional(),
  useTool: z.boolean().optional().default(true),
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
      // fallback: continue with local tools only
      mcpClient = undefined;
    }
  }

  // Build the streamText call
  const result = streamText({
    model: getModel(model) as LanguageModel,
    // Convert UI messages to model messages (the helper handles shapes from useChat)
    messages: convertToModelMessages(messages as any),
    system:
      "You are a helpful assistant. When you use tools, always produce a human-friendly summary explaining what you found and how it answers the user's question.",
    tools: useTool ? mergedTools : undefined,
    stopWhen: stepCountIs(20),
    // allow the request to be aborted by the incoming request signal
    abortSignal: (req as any).signal,
    maxOutputTokens: 1200,
    onError: (err) => {
      // Log server-side errors (keeps stream alive where possible)
      console.error("streamText error:", err);
    },
  });

  // Return a UIMessage stream response. We provide originalMessages so the client
  // can reconcile server-side IDs, and we generate server-side stable message IDs.
  return result.toUIMessageStreamResponse({
    originalMessages: messages as ChatMessage[],
    generateMessageId: createIdGenerator({ prefix: "msg", size: 12 }),
    sendSources: true,
    sendReasoning: true,

    // Cleanup: ensure MCP client is closed once the stream finishes
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
