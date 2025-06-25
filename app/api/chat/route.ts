import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { Project } from "@/services/supabase";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const supabase = await createClient();

    const result = streamText({
      model: openai("gpt-4o"),
      messages,
      system: `You are Blokar AI, an intelligent assistant for construction project management. 
      
You can help users by showing project cards on their screen. When users ask to see projects, use the available tools to display them dynamically.

Available actions:
- Show specific project cards by name or ID
- List all available projects  
- Clear the display area

Be conversational and helpful. When showing projects, explain what you're displaying.`,

      tools: {
        // Server-side tool: Get list of available projects
        listAvailableProjects: {
          description: "Get a list of all available projects the user can view",
          parameters: z.object({}),
          execute: async () => {
            try {
              console.log("📋 Fetching all projects...");

              const { data: projects, error } = await supabase
                .from("projects")
                .select("id, name, description, status, address, suburb, state")
                .order("created_at", { ascending: false });

              if (error) {
                console.error("❌ Supabase error:", error);
                throw new Error(`Database error: ${error.message}`);
              }

              console.log(`✅ Found ${projects?.length || 0} projects`);

              // Return a string instead of object for React compatibility
              const projectsList =
                projects
                  ?.map(
                    (p: Project) => `• ${p.name} (${p.status || "No status"})`
                  )
                  .join("\n") || "No projects found";

              return `Found ${
                projects?.length || 0
              } projects available:\n\n${projectsList}`;
            } catch (err) {
              console.error("🚨 Error in listAvailableProjects:", err);
              const errorMessage =
                err instanceof Error ? err.message : "Unknown error occurred";
              return `Failed to fetch projects: ${errorMessage}`;
            }
          },
        },

        // Server-side tool: Get specific project details
        getProjectDetails: {
          description:
            "Get detailed information about a specific project by ID or name",
          parameters: z.object({
            identifier: z
              .string()
              .describe("Project ID or project name to search for"),
          }),
          execute: async ({ identifier }) => {
            try {
              console.log(`🔍 Searching for project: "${identifier}"`);

              // Try to search by ID first (if it's a UUID), then by name
              let query = supabase.from("projects").select("*");

              // Check if identifier looks like a UUID
              const isUUID =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
                  identifier
                );

              if (isUUID) {
                console.log("🆔 Searching by ID");
                query = query.eq("id", identifier);
              } else {
                console.log("🏷️ Searching by name");
                query = query.ilike("name", `%${identifier}%`);
              }

              const { data: projects, error } = await query.limit(5);

              if (error) {
                console.error("❌ Supabase error:", error);
                throw new Error(`Database error: ${error.message}`);
              }

              console.log(
                `✅ Found ${projects?.length || 0} matching projects`
              );

              if (!projects || projects.length === 0) {
                return `No projects found matching "${identifier}". Try a different search term or check your spelling.`;
              }

              const projectsList = projects
                .map(
                  (p: Project) =>
                    `• ${p.name} (ID: ${p.id}, Status: ${
                      p.status || "Unknown"
                    }, Address: ${p.address || "Not specified"})`
                )
                .join("\n");

              return `Found ${projects.length} matching project${
                projects.length === 1 ? "" : "s"
              }:\n\n${projectsList}`;
            } catch (err) {
              console.error("🚨 Error in getProjectDetails:", err);
              const errorMessage =
                err instanceof Error ? err.message : "Unknown error occurred";
              return `Failed to search projects: ${errorMessage}`;
            }
          },
        },

        // Client-side tool: Show project card (handled in frontend)
        showProjectCard: {
          description: "Display a project card on the user's screen",
          parameters: z.object({
            projectId: z.string().describe("The ID of the project to display"),
          }),
          // No execute function = client-side tool
        },

        // Client-side tool: Clear all cards (handled in frontend)
        clearAllCards: {
          description: "Clear all cards from the display area",
          parameters: z.object({}),
          // No execute function = client-side tool
        },
      },

      // Add error handling for the streaming
      onError: ({ error }) => {
        console.error("🚨 Streaming error:", error);
      },
    });

    return result.toDataStreamResponse({
      // Add custom error message handling
      getErrorMessage: (error) => {
        console.error("🚨 Data stream error:", error);
        if (error instanceof Error) {
          return `Error: ${error.message}`;
        }
        return "An unexpected error occurred. Please try again.";
      },
    });
  } catch (error) {
    console.error("🚨 Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
