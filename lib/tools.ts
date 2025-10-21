import { z } from "zod";
import { tool } from "ai";

export const localTools = {
  time: tool({
    description: "Get the current date and time",
    inputSchema: z.object({}),
    execute: async () => {
      return {
        currentTime: new Date().toISOString(),
        formatted: new Date().toLocaleString(),
      };
    },
  }),
  calculate: tool({
    description: "Perform mathematical calculations",
    inputSchema: z.object({
      expression: z.string().describe("Mathematical expression to evaluate"),
    }),
    execute: async ({ expression }) => {
      try {
        // Basic security: only allow safe math operations
        const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, "");
        const result = eval(sanitized);
        return {
          expression: sanitized,
          result: result,
          success: true,
        };
      } catch {
        return {
          expression,
          error: "Invalid mathematical expression",
          success: false,
        };
      }
    },
  }),
  search: tool({
    description: "Search the web.",
    inputSchema: z.object({
      query: z.string().describe("The search query to look up"),
      maxResults: z
        .number()
        .optional()
        .default(5)
        .describe("Maximum number of results to return"),
    }),
    execute: async ({ query, maxResults = 3 }) => {
      const response = await fetch(
        `https://serpapi.com/search.json?engine=google_light&q=${encodeURIComponent(
          query
        )}&api_key=${process.env.SERP_API_KEY}&num=${maxResults}`
      );
      const data = await response.json();
      return data.organic_results.map(
        (r: { title: string; link: string; snippet: string }) => ({
          title: r.title,
          link: r.link,
          snippet: r.snippet,
        })
      );
    },
  }),
};
