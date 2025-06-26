import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { createClient } from "@/utils/supabase/server";

// Import all tools directly - eliminates agent routing overhead
import { projectTools } from "./tools/projects";
import { systemTools } from "./tools/system";

// ✅ REMOVED: searchProjectsByLocation (was eliminated as redundant)

// Combine all tools into single object for efficient single call
const allTools = {
  // Project management tools (CRUD operations)
  ...projectTools,
  // UI management tools (display and interaction)
  ...systemTools,
};

// Single comprehensive system prompt that replaces Master Agent + Project Agent logic
const BLOKAR_SYSTEM_PROMPT = `You are Blokar AI, an intelligent assistant for construction project management and AEC (Architecture, Engineering, Construction) workflows.

## CORE CAPABILITIES & TOOL ROUTING

You have access to two categories of tools:

### PROJECT MANAGEMENT TOOLS:
- listAvailableProjects: Get all projects with filtering options
- getProjectDetails: Search and retrieve detailed project information
- createNewProject: Create new construction projects
- updateExistingProject: Modify project details and status
- deleteExistingProject: Remove projects safely
- getProjectStatistics: Get project analytics and metrics

### UI MANAGEMENT TOOLS:
- showProjectCard: Display project details in the interface
- clearAllCards: Clear the workspace for new content
- highlightProject: Emphasize specific project information
- refreshProjectList: Update the project list display
- searchProjectsByLocation: Find projects by geographic location

## INTELLIGENT ROUTING LOGIC

**For project requests (listing, searching, creation, updates):**
1. Use appropriate project management tools first
2. Then use UI tools to display results to the user
3. Always call showProjectCard when project details are retrieved
4. Use clearAllCards before showing multiple projects

**For UI requests (show, display, clear, highlight):**
1. Use UI management tools directly
2. Provide conversational feedback about what was displayed

**Multi-step workflows:**
- You can call multiple tools in sequence to complete complex requests
- Always prioritize user experience by showing relevant information
- Use clearAllCards strategically to avoid cluttered displays

## AEC INDUSTRY CONTEXT

You understand construction project terminology:
- Project phases (design, permits, construction, completion)
- Building types (residential, commercial, mixed-use, infrastructure)
- Project roles (architect, engineer, contractor, project manager)
- Construction processes and workflows
- Building codes and compliance requirements

## RESPONSE GUIDELINES

- Be conversational and professional
- Use construction industry terminology appropriately
- Provide clear feedback about what tools were used and why
- When displaying project information, highlight key details like status, progress, and important dates
- Always extract and use project IDs when tools return them
- If multiple projects are found, show them all unless user specifies otherwise
- For errors, provide helpful suggestions for alternative searches or actions

## WORKFLOW PATTERNS

**Project Search Flow:**
1. Use getProjectDetails or listAvailableProjects
2. Call showProjectCard for each relevant project
3. Provide summary of what was displayed

**Project Creation Flow:**
1. Use createNewProject with provided details
2. If successful, call showProjectCard to display the new project
3. Provide confirmation and next steps

**Workspace Management:**
- Clear workspace when switching between different project contexts
- Keep related information visible when it adds value
- Use highlighting to draw attention to important updates

You are efficient, helpful, and focused on getting construction professionals the information they need quickly and clearly.`;

export const maxDuration = 60; // Allow up to 60 seconds for complex workflows

export async function GET() {
  return new Response(
    "Blokar AI Chat API - Optimized Single Call Architecture",
    {
      status: 200,
    }
  );
}

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    // Step 1: Parse and validate the request
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("❌ Invalid request: No messages provided");
      return new Response("Bad Request: Messages required", { status: 400 });
    }

    // Step 2: Initialize Supabase client for authentication context
    const supabase = await createClient();

    // Get user context (for future permission checking and tool context)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log(
      `🎯 Processing optimized chat request${
        user ? ` for user ${user.id}` : ""
      }`
    );

    // Step 3: Single optimized AI call with all tools and intelligent routing
    console.log("🚀 Starting single streamText call with all tools...");

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: BLOKAR_SYSTEM_PROMPT,
      messages,
      tools: allTools,
      maxSteps: 5, // Enable multi-step workflows within single call

      // Optional: Enable tool call streaming for real-time UI updates
      toolCallStreaming: true,

      // Optional: Add step completion logging for debugging
      onStepFinish: (step) => {
        console.log(
          `✅ Step completed: ${step.toolCalls?.length || 0} tool calls, ${
            step.text?.length || 0
          } chars`
        );
      },
    });

    const processingTime = Date.now() - startTime;
    console.log(
      `⚡ Single-call architecture completed setup in ${processingTime}ms`
    );

    // Step 4: Return the streaming response directly
    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error("🚨 Single-call stream error:", error);

        // Log error details for debugging
        const errorDetails = {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
          processingTime: Date.now() - startTime,
        };

        console.error("🚨 Error details:", errorDetails);

        return "I apologize, but I encountered an error while processing your request. Please try again or rephrase your question.";
      },
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;

    console.error("🚨 Chat API critical error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      processingTime,
    });

    // Return a user-friendly error response
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message:
          "I'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
