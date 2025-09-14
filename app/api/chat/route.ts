import {
  streamText,
  UIMessage,
  convertToModelMessages,
  LanguageModel,
  UIDataTypes,
  ToolSet,
  tool,
  InferUITools,
} from "ai";
import { getModel } from "@/lib/models";
import { z } from "zod";

export const maxDuration = 30;

const tools = {
  getTime: tool({
    description: "Returns the current time",
    inputSchema: z.object({}),
    execute: async () => {
      return { time: new Date().toISOString() };
    },
  }),
  getWeather: tool({
    description: "Fetch weather information for a specific location",
    inputSchema: z.object({
      location: z.string(),
    }),
    execute: async ({ location }) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const temp = Math.floor(Math.random() * 35) + 5;

      return {
        location,
        temperature: `${temp}°C`,
        conditions: "Sunny",
        humidity: `12%`,
        windSpeed: `35 km/h`,
        lastUpdated: new Date().toLocaleString(),
      };
    },
  }),
} satisfies ToolSet;

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  const {
    messages,
    model,
    useTool,
  }: { messages: ChatMessage[]; model: string; useTool: boolean } =
    await req.json();

  const result = streamText({
    model: getModel(model) as LanguageModel,
    messages: convertToModelMessages(messages),
    system:
      "You are a helpful assistant that can answer questions and help with tasks",
    tools: useTool ? tools : undefined,
  });

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
