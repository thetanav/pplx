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
  weather: tool({
    description: "Get the current weather for a given location",
    inputSchema: z.object({
      location: z.string().describe("The location to get the weather for"),
    }),
    execute: async ({ location }) => {
      const apiKey = process.env.WEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          location
        )}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) {
        return { error: `Could not fetch weather for ${location}` };
      }
      const data = await response.json();
      return {
        location: data.name,
        temperature: data.main.temp,
        description: data.weather[0].description,
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
      } catch (err) {
        throw new Error(`Failed to scrape page`);
      }
    },
  }),
};
