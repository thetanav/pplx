import { perplexity } from "@ai-sdk/perplexity";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const models = [
  {
    name: "GPT OSS 20b",
    value: "openai/gpt-oss-20b:free",
  },
  {
    name: "Venice Uncensored",
    value: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
  },
  {
    name: "Deepseek R1",
    value: "deepseek/deepseek-r1-0528:free",
  },
  {
    name: "Perplexity Sonar",
    value: "sonar",
  },
  {
    name: "DeepSeek V3.1",
    value: "deepseek/deepseek-chat-v3.1:free",
  },
  {
    name: "Sonomo Dusk Alpha",
    value: "openrouter/sonoma-dusk-alpha",
  },
];

export function getModel(model: string) {
  switch (model) {
    case "openai/gpt-oss-20b:free":
      return openrouter.chat("openai/gpt-oss-20b:free");
    case "cognitivecomputations/dolphin-mistral-24b-venice-edition:free":
      return openrouter.chat(
        "cognitivecomputations/dolphin-mistral-24b-venice-edition:free"
      );
    case "deepseek/deepseek-r1-0528:free":
      return openrouter.chat("deepseek/deepseek-r1-0528:free");
    case "deepseek/deepseek-chat-v3.1:free":
      return openrouter.chat("deepseek/deepseek-chat-v3.1:free");
    case "openrouter/sonoma-dusk-alpha":
      return openrouter.chat("openrouter/sonoma-sky-alpha");
    case "sonar":
      return perplexity("sonar");
  }
}
