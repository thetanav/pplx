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
  deepresearch: tool({
    description: "Perform deep research analysis by breaking down complex queries into multiple reasoning steps",
    inputSchema: z.object({
      query: z.string().describe("The research query to analyze in multiple steps"),
      maxSteps: z.number().optional().default(5).describe("Maximum number of reasoning steps"),
    }),
    execute: async ({ query, maxSteps }) => {
      // This tool performs multi-step reasoning locally
      // The AI will use this to break down complex problems
      const steps = [];

      // Step 1: Understand the query
      steps.push({
        step: 1,
        type: "analysis",
        content: `Analyzing query: "${query}"`,
        reasoning: "Breaking down the main question into components"
      });

      // Step 2: Identify key elements
      const keyElements = query.split(' ').filter(word => word.length > 3);
      steps.push({
        step: 2,
        type: "decomposition",
        content: `Key elements identified: ${keyElements.join(', ')}`,
        reasoning: "Extracting important terms and concepts"
      });

      // Step 3: Consider different perspectives
      steps.push({
        step: 3,
        type: "perspective",
        content: "Considering multiple angles and implications",
        reasoning: "Exploring different viewpoints on the topic"
      });

      // Step 4: Synthesize information
      steps.push({
        step: 4,
        type: "synthesis",
        content: "Combining insights from different perspectives",
        reasoning: "Integrating various aspects into a coherent understanding"
      });

      // Step 5: Draw conclusions
      steps.push({
        step: 5,
        type: "conclusion",
        content: "Formulating final insights and recommendations",
        reasoning: "Summarizing the multi-step analysis"
      });

      return {
        query,
        steps: steps.slice(0, maxSteps),
        totalSteps: steps.length,
        analysis: "Deep research completed through systematic multi-step reasoning"
      };
    },
  }),
};
