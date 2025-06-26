// ============================================================================
// BLOKAR AI CHAT API - THIN ORCHESTRATION LAYER
// ============================================================================
// This file serves as the entry point for all chat requests.
// It's been refactored to use Claude Anthropic and hand off processing to the Master Agent.
//
// LEARNING NOTES:
// - This route is now a "thin orchestration layer" - minimal logic
// - All intelligence and tool orchestration moved to Master Agent
// - Uses Claude Sonnet 4 instead of OpenAI GPT-4
// - Proper error handling and logging throughout
// - maxSteps enables complex multi-step agent workflows
// ============================================================================

import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { createClient } from "@/utils/supabase/server";
import { masterAgentHandler } from "./agents/master-agent";
import type { MasterAgentConfig } from "./types/agents";

// ============================================================================
// CONFIGURATION
// ============================================================================

export const maxDuration = 30;

/**
 * LEARNING: Master Agent configuration
 * These settings control how the Master Agent operates
 */
const MASTER_AGENT_CONFIG: MasterAgentConfig = {
  confidenceThreshold: 0.7, // Route directly if intent confidence > 70%
  maxRetries: 2, // Retry failed operations up to 2 times
  enableLogging: true, // Log all agent interactions for debugging
  fallbackToGeneral: true, // Handle unknown intents gracefully
};

// ============================================================================
// CHAT API ENDPOINT
// ============================================================================

/**
 * LEARNING: Main chat endpoint
 * This endpoint now focuses solely on:
 * 1. Request validation and authentication
 * 2. Extracting user message from conversation
 * 3. Handing off to Master Agent
 * 4. Streaming the response back to client
 */
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

    // Get user context (optional - for future permission checking)
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(
      `🎯 Processing chat request${user ? ` for user ${user.id}` : ""}`
    );

    // Step 3: Extract the latest user message
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || latestMessage.role !== "user") {
      console.error("❌ Invalid request: Last message must be from user");
      return new Response("Bad Request: Invalid message format", {
        status: 400,
      });
    }

    const userMessage = latestMessage.content;
    const conversationHistory = messages.slice(0, -1); // All messages except the latest

    console.log(`💬 User message: "${userMessage}"`);
    console.log(
      `📝 Conversation history: ${conversationHistory.length} messages`
    );

    // Step 4: Hand off to Master Agent for processing
    console.log("🎯 Handing off to Master Agent...");

    const agentResponse = await masterAgentHandler(
      userMessage,
      conversationHistory,
      MASTER_AGENT_CONFIG
    );

    // Step 5: Stream the response using Claude
    console.log("🤖 Generating Claude response...");

    const result = streamText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      messages: [
        {
          role: "system",
          content: `You are Blokar AI, an intelligent assistant for construction project management.

The Master Agent has processed the user's request and provided the following result:

${JSON.stringify(agentResponse, null, 2)}

Your task is to present this information to the user in a conversational, helpful manner. 

Guidelines:
- Use the response message as your primary content
- Include any data or suggestions from the agent response naturally
- Be conversational and engaging
- Use appropriate construction/project management terminology
- If the operation was successful, be positive and helpful
- If there were errors, be sympathetic and offer alternatives
- Include relevant emojis for visual organization

Remember: You're the user-facing layer that makes the multi-agent system feel like a single, intelligent assistant.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      maxSteps: 1, // Single step for presentation layer
    });

    const processingTime = Date.now() - startTime;
    console.log(`✅ Chat request completed in ${processingTime}ms`);

    // Step 6: Return the streaming response
    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error("🚨 Data stream error:", error);

        // Log the error details for debugging
        const errorDetails = {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
          processingTime: Date.now() - startTime,
          userMessage: userMessage.substring(0, 100) + "...", // First 100 chars
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

// ============================================================================
// HEALTH CHECK ENDPOINT (Optional)
// ============================================================================

/**
 * LEARNING: Health check for monitoring
 * Useful for verifying the API is working without processing a full chat request
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Quick health check - verify database connection
    const { error } = await supabase.from("projects").select("id").limit(1);

    if (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }

    return Response.json({
      status: "healthy",
      message: "Blokar AI Chat API is operational",
      timestamp: new Date().toISOString(),
      version: "2.0.0-multi-agent",
    });
  } catch (error) {
    console.error("🚨 Health check failed:", error);

    return Response.json(
      {
        status: "unhealthy",
        message: "Service experiencing issues",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
