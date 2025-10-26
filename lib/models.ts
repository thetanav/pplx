import { perplexity } from "@ai-sdk/perplexity";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { ollama } from "ollama-ai-provider-v2";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// add local, pro parameter
export const models = [
  {
    name: "Qwen3 32b",
    value: "qwen/qwen3-32b",
    logo: "/qwen.svg",
    tools: true,
    reasoning: true,
    fast: true,
    end: groq("qwen/qwen3-32b"),
  },
  {
    name: "Grok 4 Fast",
    value: "x-ai/grok-4-fast",
    logo: "/xai.svg",
    tools: true,
    pro: true,
    fast: true,
    reasoning: true,
    end: openrouter.chat("x-ai/grok-4-fast"),
  },
  {
    name: "GPT 5",
    value: "openai/gpt-5",
    logo: "/openai.svg",
    tools: true,
    pro: true,
    reasoning: true,
    end: openrouter.chat("openai/gpt-5"),
  },
  {
    name: "Z.AI: GLM 4.5 Air",
    value: "z-ai/glm-4.5-air:free",
    logo: "/zai.svg",
    tools: true,
    reasoning: true,
    end: openrouter.chat("z-ai/glm-4.5-air:free"),
  },
  {
    name: "Deepseek R1",
    value: "deepseek/deepseek-r1-0528:free",
    logo: "/deepseek.svg",
    tools: false,
    reasoning: true,
    end: openrouter.chat("deepseek/deepseek-r1-0528:free"),
  },
  {
    name: "DeepSeek V3.1",
    value: "deepseek/deepseek-chat-v3.1:free",
    logo: "/deepseek.svg",
    tools: true,
    reasoning: false,
    end: openrouter.chat("deepseek/deepseek-chat-v3.1:free"),
  },
  {
    name: "Perplexity Sonar",
    value: "sonar",
    logo: "/pplx.svg",
    tools: false,
    reasoning: false,
    end: perplexity("sonar"),
  },
  {
    name: "Gemini 2.5 Flash Lite",
    value: "gemini-2.5-flash-lite",
    logo: "/gemini.svg",
    tools: false,
    reasoning: false,
    fast: true,
    end: google("gemini-2.5-flash-lite"),
  },
  {
    name: "Nano Banana",
    value: "google/gemini-2.5-flash-image",
    logo: "/gemini.svg",
    tools: false,
    pro: true,
    image: true,
    end: openrouter.chat("google/gemini-2.5-flash-image"),
  },
  {
    name: "Claude Haiku 4.5",
    value: "anthropic/claude-haiku-4.5",
    logo: "/anthropic.svg",
    tools: true,
    pro: true,
    end: openrouter.chat("anthropic/claude-haiku-4.5"),
  },
  {
    name: "Claude Sonnet 4.5",
    value: "anthropic/claude-sonnet-4.5",
    logo: "/anthropic.svg",
    tools: true,
    pro: true,
    end: openrouter.chat("anthropic/claude-sonnet-4.5"),
  },
  {
    name: "Qwen 3 8b",
    value: "qwen3:8b",
    logo: "/qwen.svg",
    tools: true,
    reasoning: true,
    local: true,
    end: ollama("qwen3:8b"),
  },
];
