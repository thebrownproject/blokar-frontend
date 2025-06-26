// ============================================================================
// BLOKAR AI AGENT SYSTEM - MASTER AGENT
// ============================================================================
// This file contains the Master Agent - the central coordinator of our multi-agent system.
//
// LEARNING NOTES:
// - Master Agent is the "traffic controller" of the system
// - It classifies user intent and routes requests to appropriate domain agents
// - Uses Claude's reasoning capabilities for intelligent routing decisions
// - Handles coordination between multiple agents when needed
// - Falls back gracefully when intent is unclear
// ============================================================================

import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import {
  classifyIntent,
  isHighConfidenceIntent,
  getSuggestedClarifications,
} from "../utils/intent-classifier";
import { projectAgentHandler } from "./project-agent";
import type {
  AgentResponse,
  AgentContext,
  MasterAgentConfig,
  IntentClassification,
} from "../types/agents";
import { DEFAULT_MASTER_CONFIG } from "../types/agents";

// ============================================================================
// MASTER AGENT CONFIGURATION
// ============================================================================

/**
 * LEARNING: Master Agent system prompt
 * This prompt defines the Master Agent's role and capabilities
 */
const MASTER_AGENT_SYSTEM_PROMPT = `
You are the Master Agent for Blokar AI, an intelligent construction project management platform.

Your role is to coordinate and route user requests to the appropriate specialist agents.

## YOUR RESPONSIBILITIES:

### 1. Intent Analysis & Routing
- Analyze user messages to understand their intent
- Route requests to the appropriate domain agents:
  * Project Agent: For all project-related operations (CRUD, search, management)
  * Future agents: Task Agent, Document Agent, Contact Agent (when implemented)

### 2. Multi-Agent Coordination
- When requests require multiple agents, coordinate the workflow
- Ensure consistent data flow between agents
- Provide unified responses to users

### 3. Fallback Handling
- When intent is unclear, ask clarifying questions
- Provide helpful suggestions for what users can do
- Guide users toward productive interactions

### 4. Context Management
- Maintain conversation context across agent interactions
- Remember previous requests and responses
- Provide relevant follow-up suggestions

## CURRENT SYSTEM CAPABILITIES:

### Project Management (handled by Project Agent):
- List all projects
- Search for specific projects
- Create new projects
- Update existing projects
- Delete projects
- View project statistics
- Display project cards in UI

### UI Interactions:
- Show/hide project cards
- Clear the display area
- Organize project presentations

## ROUTING RULES:

1. **High Confidence Intents (>0.7)**: Route directly to appropriate agent
2. **Medium Confidence (0.4-0.7)**: Ask clarifying questions before routing
3. **Low Confidence (<0.4)**: Provide helpful suggestions and examples
4. **General Inquiries**: Handle directly with information about Blokar capabilities

## RESPONSE STYLE:
- Be conversational and helpful
- Explain what you're doing (e.g., "Let me check your projects...")
- Provide clear, actionable feedback
- Suggest next steps when appropriate
- Use emojis sparingly but effectively for visual organization

Remember: You're the intelligent coordinator that makes the multi-agent system feel like a single, cohesive assistant.
`;

// ============================================================================
// MASTER AGENT HANDLER
// ============================================================================

/**
 * LEARNING: Main Master Agent function
 * This is the entry point for all user requests in our multi-agent system
 */
export async function masterAgentHandler(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }> = [],
  config: MasterAgentConfig = DEFAULT_MASTER_CONFIG
): Promise<AgentResponse> {
  const startTime = Date.now();

  try {
    console.log("🎯 Master Agent processing message:", userMessage);

    // Step 1: Classify the user's intent
    const intentClassification = await classifyIntent(
      userMessage,
      conversationHistory.map((msg) => msg.content).slice(-3) // Last 3 messages for context
    );

    console.log(
      `🎯 Intent classified as: ${intentClassification.intent} (confidence: ${intentClassification.confidence})`
    );

    // Step 2: Determine routing strategy based on confidence
    if (
      !isHighConfidenceIntent(intentClassification, config.confidenceThreshold)
    ) {
      return await handleLowConfidenceIntent(intentClassification, userMessage);
    }

    // Step 3: Route to appropriate agent based on intent
    const agentContext: AgentContext = {
      userMessage,
      intent: intentClassification,
      conversationHistory,
    };

    let agentResponse: AgentResponse;

    switch (intentClassification.intent) {
      case "project-listing":
      case "project-retrieval":
      case "project-creation":
      case "project-update":
      case "project-deletion":
      case "ui-interaction":
        // Route to Project Agent
        console.log("🎯 Routing to Project Agent");
        agentResponse = await projectAgentHandler(agentContext);
        break;

      case "general-inquiry":
        // Handle general questions directly using the system prompt
        agentResponse = await handleGeneralInquiry(
          userMessage,
          intentClassification
        );
        break;

      case "unknown":
      default:
        // Fallback handling
        agentResponse = await handleUnknownIntent(
          userMessage,
          intentClassification
        );
        break;
    }

    // Step 4: Add Master Agent metadata
    const processingTime = Date.now() - startTime;
    agentResponse.metadata = {
      ...agentResponse.metadata,
      agent: agentResponse.metadata?.agent || "master",
      masterAgent: {
        intent: intentClassification.intent,
        confidence: intentClassification.confidence,
        processingTime,
        routing: getRoutingInfo(intentClassification.intent),
      },
    };

    console.log(`✅ Master Agent completed in ${processingTime}ms`);
    return agentResponse;
  } catch (error) {
    console.error("🚨 Master Agent error:", error);

    return {
      success: false,
      message:
        "I encountered an error while processing your request. Please try again or rephrase your question.",
      metadata: {
        agent: "master",
        error: error instanceof Error ? error.message : "Unknown error",
        processingTime: Date.now() - startTime,
      },
      suggestions: [
        "Try rephrasing your request",
        "Ask about specific projects or project management features",
        "Check if you have the necessary permissions",
      ],
    };
  }
}

// ============================================================================
// INTENT HANDLING FUNCTIONS
// ============================================================================

/**
 * LEARNING: Handle low confidence intents
 * When we're not sure what the user wants, ask for clarification
 */
async function handleLowConfidenceIntent(
  classification: IntentClassification,
  userMessage: string
): Promise<AgentResponse> {
  console.log(
    `🤔 Low confidence intent (${classification.confidence}), asking for clarification`
  );

  try {
    // Use Claude to generate a helpful clarification request
    const result = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system: MASTER_AGENT_SYSTEM_PROMPT,
      prompt: `The user said: "${userMessage}"

I classified this with low confidence as "${classification.intent}" (${(
        classification.confidence * 100
      ).toFixed(1)}% confidence).

Please ask a clarifying question to better understand what the user wants to do. Suggest specific actions they can take with Blokar's project management features.`,
    });

    return {
      success: true,
      message:
        result.text ||
        "I'm not quite sure what you'd like to do. Could you please clarify your request?",
      metadata: {
        agent: "master",
        intent: classification.intent,
        confidence: classification.confidence,
        clarificationRequested: true,
      },
      suggestions: getSuggestedClarifications(classification),
    };
  } catch (error) {
    console.error("🚨 Error in handleLowConfidenceIntent:", error);
    return {
      success: false,
      message:
        "I'm having trouble understanding your request. Could you please try rephrasing it?",
      metadata: {
        agent: "master",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      suggestions: [
        "Try asking about projects (e.g., 'show me all projects')",
        "Ask for help with specific features",
        "Use simpler language to describe what you want",
      ],
    };
  }
}

/**
 * LEARNING: Handle general inquiries about Blokar
 * Provide information about the platform's capabilities
 */
async function handleGeneralInquiry(
  userMessage: string,
  classification: IntentClassification
): Promise<AgentResponse> {
  console.log("ℹ️ Handling general inquiry directly");

  try {
    const result = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system: MASTER_AGENT_SYSTEM_PROMPT,
      prompt: `The user asked: "${userMessage}"

This is a general inquiry about Blokar. Please provide a helpful response about our construction project management capabilities. Be specific about what users can do with the system.`,
    });

    return {
      success: true,
      message:
        result.text ||
        "Blokar is an intelligent construction project management platform. You can manage projects, track progress, organize tasks, and much more!",
      metadata: {
        agent: "master",
        intent: classification.intent,
        confidence: classification.confidence,
        handledDirectly: true,
      },
      suggestions: [
        "Show me all my projects",
        "Create a new project",
        "Get project statistics",
        "Search for a specific project",
      ],
    };
  } catch (error) {
    console.error("🚨 Error in handleGeneralInquiry:", error);
    return {
      success: false,
      message:
        "I can help you with construction project management. Try asking about your projects or how to get started!",
      metadata: {
        agent: "master",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      suggestions: [
        "List all projects",
        "Create a new project",
        "Search for projects",
        "Learn about Blokar features",
      ],
    };
  }
}

/**
 * LEARNING: Handle unknown intents
 * Fallback when we can't understand what the user wants
 */
async function handleUnknownIntent(
  userMessage: string,
  classification: IntentClassification
): Promise<AgentResponse> {
  console.log("❓ Handling unknown intent");

  return {
    success: true,
    message: `I'm not sure how to help with that request. Here are some things you can try with Blokar:

🏗️ **Project Management:**
- "Show me all my projects"
- "Create a new residential project"
- "Update the status of [project name]"

📊 **Analytics:**
- "Get project statistics"
- "Show project progress"

🔍 **Search:**
- "Find the Harbor project"
- "Show projects in Melbourne"

Would you like to try one of these instead?`,
    metadata: {
      agent: "master",
      intent: classification.intent,
      confidence: classification.confidence,
      fallbackResponse: true,
    },
    suggestions: [
      "List all my projects",
      "Create a new project",
      "Search for a project",
      "Get help with Blokar features",
    ],
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * LEARNING: Get routing information for metadata
 * Helps with debugging and analytics
 */
function getRoutingInfo(intent: string): { agent: string; reason: string } {
  switch (intent) {
    case "project-listing":
    case "project-retrieval":
    case "project-creation":
    case "project-update":
    case "project-deletion":
    case "ui-interaction":
      return {
        agent: "project",
        reason: "Project-related intent requires Project Agent expertise",
      };

    case "general-inquiry":
      return {
        agent: "master",
        reason: "General questions handled directly by Master Agent",
      };

    default:
      return {
        agent: "master",
        reason: "Unknown intent requires Master Agent fallback handling",
      };
  }
}

/**
 * LEARNING: Multi-agent workflow coordinator
 * For future use when we need to coordinate multiple agents
 */
export async function coordinateMultipleAgents(
  context: AgentContext,
  workflow: string[]
): Promise<AgentResponse> {
  console.log("🔄 Coordinating multi-agent workflow:", workflow);

  // This is a placeholder for future multi-agent coordination
  // When we add Task Agent, Document Agent, etc., this function
  // will orchestrate complex workflows across multiple agents

  return {
    success: false,
    message: "Multi-agent coordination is not yet implemented.",
    metadata: {
      agent: "master",
      workflow,
      status: "not_implemented",
    },
  };
}

/**
 * LEARNING: Check if agent is available
 * For future use with multiple agents
 */
export function isAgentAvailable(agentName: string): boolean {
  const availableAgents = ["master", "project"];
  return availableAgents.includes(agentName);
}

// Export the main handler and utilities
export { masterAgentHandler as default };
