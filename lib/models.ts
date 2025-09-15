import { perplexity } from "@ai-sdk/perplexity";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import {
  ZapIcon,
  GlobeIcon,
  BrainIcon,
  BotIcon,
  SparklesIcon,
  RouteIcon,
} from "lucide-react";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const models = [
  {
    name: "Sonom Sky Alpha",
    value: "openrouter/sonoma-sky-alpha",
    icon: RouteIcon,
  },
  {
    name: "Grok Code Fast 1",
    value: "x-ai/grok-code-fast-1",
    icon: RouteIcon,
  },
  {
    name: "Deepseek R1",
    value: "deepseek/deepseek-r1-0528:free",
    icon: BrainIcon,
  },
  {
    name: "DeepSeek V3.1",
    value: "deepseek/deepseek-chat-v3.1:free",
    icon: BrainIcon,
  },
  {
    name: "Perplexity Sonar",
    value: "sonar",
    icon: GlobeIcon,
  },
  {
    name: "GPT OSS 120b (groq)",
    value: "openai/gpt-oss-120b",
    icon: ZapIcon,
  },
  {
    name: "Qwen3 32b (groq)",
    value: "qwen/qwen3-32b",
    icon: BotIcon,
  },
  {
    name: "Gemini 2.5 Flash Lite",
    value: "gemini-2.5-flash-lite",
    icon: SparklesIcon,
  },
];

export function getModel(model: string) {
  switch (model) {
    case "openrouter/sonoma-sky-alpha":
      return openrouter.chat("openrouter/sonoma-sky-alpha");
    case "x-ai/grok-code-fast-1":
      return openrouter.chat("x-ai/grok-code-fast-1");
    case "deepseek/deepseek-r1-0528:free":
      return openrouter.chat("deepseek/deepseek-r1-0528:free");
    case "deepseek/deepseek-chat-v3.1:free":
      return openrouter.chat("deepseek/deepseek-chat-v3.1:free");
    case "gemini-2.5-flash-lite":
      return google("gemini-2.5-flash-lite");
    case "sonar":
      return perplexity("sonar");
    case "openai/gpt-oss-120b":
      return groq("openai/gpt-oss-120b");
    case "qwen/qwen3-32b":
      return groq("qwen/qwen3-32b");
  }
}
