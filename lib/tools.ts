import { z } from "zod";
import { tool } from "ai";
import { load } from "cheerio";

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
    inputSchema: z.object({
      query: z.string().describe("The search query to look up"),
      maxResults: z
        .number()
        .optional()
        .default(5)
        .describe("Maximum number of results to return"),
    }),
    execute: async ({ query, maxResults }) => {
      const response = await fetch(
        `https://serpapi.com/search.json?engine=google_light&q=${encodeURIComponent(
          query
        )}&api_key=${process.env.SERP_API_KEY}&num=${maxResults}`
      );
      const data = await response.json();
      console.log("Search tool fetched data:", data);
      return data.organic_results.map(
        (r: { title: string; link: string; snippet: string }) => ({
          title: r.title,
          link: r.link,
          snippet: r.snippet,
        })
      );
    },
  }),
  scrape: tool({
    description: "Scrape all visible text content from a web page",
    inputSchema: z.object({
      url: z.string().describe("The URL of the web page to scrape"),
    }),
    execute: async ({ url }) => {
      try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = load(html);

        // Remove unwanted elements like scripts, styles
        $("script, style, noscript").remove();

        // Extract all visible text
        const text = $("body").text();

        // Clean and trim the text
        const cleanText = text.replace(/\s+/g, " ").trim();

        return cleanText;
      } catch {
        throw new Error(`Failed to scrape page`);
      }
    },
  }),
};
