import { z } from "zod";
import { tool } from "ai";
import { search, SafeSearchType } from "duck-duck-scrape";

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
    description: "Search the web using DuckDuckGo for more context",
    inputSchema: z.object({
      query: z.string().describe("Search query"),
      limit: z
        .number()
        .optional()
        .default(5)
        .describe("Number of results to return"),
    }),
    execute: async ({ query, limit }) => {
      try {
        const searchResults = await search(query, {
          safeSearch: SafeSearchType.STRICT,
          locale: "en-US",
        });
        
        // Ensure we have results and limit them
        const results = searchResults?.results || [];
        const limitedResults = results.slice(0, limit);
        
        return {
          query,
          results: limitedResults,
          totalResults: results.length,
          source: "DuckDuckGo",
          success: true,
        };
      } catch (error) {
        console.error("Search error:", error);
        return {
          query,
          results: [],
          totalResults: 0,
          source: "DuckDuckGo",
          success: false,
          error: `Search failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    },
  }),
  planTask: tool({
    description: "Create a detailed plan for complex multi-step tasks",
    inputSchema: z.object({
      task: z.string().describe("The task to plan"),
      context: z
        .string()
        .optional()
        .describe("Additional context about the task"),
    }),
    execute: async ({ task, context }) => {
      // Generate a structured plan
      const plan = {
        task,
        context: context || "No additional context provided",
        steps: [
          "Analyze the task requirements",
          "Identify necessary tools and resources",
          "Break down into actionable steps",
          "Execute steps in logical order",
          "Verify results and iterate if needed",
        ],
        estimatedComplexity: "medium",
        recommendedApproach: "Use available tools systematically",
      };
      return plan;
    },
  }),
  orchestrateWorkflow: tool({
    description:
      "Orchestrate complex workflows by executing multiple tools in sequence",
    inputSchema: z.object({
      workflow: z
        .array(
          z.object({
            tool: z.string().describe("Tool name to execute"),
            parameters: z
              .object({})
              .catchall(z.unknown())
              .describe("Parameters for the tool"),
            description: z.string().describe("What this step does"),
          })
        )
        .describe("Array of workflow steps"),
      goal: z.string().describe("Overall goal of the workflow"),
    }),
    execute: async ({ workflow, goal }) => {
      const results = [];
      let success = true;

      for (const step of workflow) {
        try {
          // In a real implementation, this would execute the actual tools
          // For now, return a mock execution
          results.push({
            step: step.description,
            tool: step.tool,
            status: "completed",
            mockResult: `Executed ${step.tool} with params: ${JSON.stringify(
              step.parameters
            )}`,
          });
        } catch (error) {
          results.push({
            step: step.description,
            tool: step.tool,
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
          });
          success = false;
        }
      }
      return {
        goal,
        totalSteps: workflow.length,
        completedSteps: results.filter((r) => r.status === "completed").length,
        success,
        results,
        summary: success
          ? "Workflow completed successfully"
          : "Workflow had errors",
      };
    },
  }),
};
