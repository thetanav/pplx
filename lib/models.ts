import { perplexity } from "@ai-sdk/perplexity";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { ollama } from "ollama-ai-provider-v2";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const models = [
  {
    name: "Qwen 3 8b (ollama)",
    value: "qwen3:8b",
    logo: "/qwen.svg",
    tools: true,
    end: ollama("qwen3:8b"),
  },
  {
    name: "Grok Code Fast 1",
    value: "x-ai/grok-code-fast-1",
    logo: "/xai.svg",
    tools: true,
    end: openrouter.chat("x-ai/grok-code-fast-1"),
  },
  {
    name: "Grok 4 Fast",
    value: "x-ai/grok-4-fast:free",
    logo: "/xai.svg",
    tools: true,
    end: openrouter.chat("x-ai/grok-4-fast:free"),
  },
  {
    name: "Deepseek R1",
    value: "deepseek/deepseek-r1-0528:free",
    logo: "/deepseek.svg",
    tools: false,
    end: openrouter.chat("deepseek/deepseek-r1-0528:free"),
  },
  {
    name: "DeepSeek V3.1",
    value: "deepseek/deepseek-chat-v3.1:free",
    logo: "/deepseek.svg",
    tools: true,
    end: openrouter.chat("deepseek/deepseek-chat-v3.1:free"),
  },
  {
    name: "Perplexity Sonar",
    value: "sonar",
    logo: "/pplx.svg",
    tools: false,
    end: perplexity("sonar"),
  },
  {
    name: "Qwen3 32b (groq)",
    value: "qwen/qwen3-32b",
    logo: "/qwen.svg",
    tools: true,
    end: groq("qwen/qwen3-32b"),
  },
  {
    name: "Gemini 2.5 Flash Lite",
    value: "gemini-2.5-flash-lite",
    logo: "/gemini.svg",
    tools: false,
    end: google("gemini-2.5-flash-lite"),
  },
  {
    name: "Nano Banana",
    value: "google/gemini-2.5-flash-image",
    logo: "/gemini.svg",
    tools: false,
    end: openrouter.chat("google/gemini-2.5-flash-image"),
  },
  {
    name: "Claude Haiku 4.5",
    value: "anthropic/claude-haiku-4.5",
    logo: "/anthropic.svg",
    tools: true,
    end: openrouter.chat("anthropic/claude-haiku-4.5"),
  },
  {
    name: "Claude Sonnet 4.5",
    value: "anthropic/claude-sonnet-4.5",
    logo: "/anthropic.svg",
    tools: true,
    end: openrouter.chat("anthropic/claude-sonnet-4.5"),
  },
];
