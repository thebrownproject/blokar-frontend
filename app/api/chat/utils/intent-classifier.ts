// ============================================================================
// BLOKAR AI AGENT SYSTEM - INTENT CLASSIFIER
// ============================================================================
// This file contains the LLM-based intent classification logic.
//
// LEARNING NOTES:
// - Intent classification is the first step in routing user requests
// - We use Claude's reasoning capabilities for accurate classification
// - The classifier extracts entities (project names, IDs, etc.) from user input
// - High confidence classifications route directly; low confidence gets human review
// ============================================================================

import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";
import type { IntentClassification, UserIntent } from "../types/agents";

// ============================================================================
// INTENT CLASSIFICATION SCHEMA
// ============================================================================

/**
 * LEARNING: Zod schema for intent classification
 * This ensures our LLM returns properly structured intent data
 */
const IntentClassificationSchema = z.object({
  intent: z.enum([
    "project-listing", // User wants to see multiple projects
    "project-retrieval", // User wants details about specific project(s)
    "project-creation", // User wants to create a new project
    "project-update", // User wants to modify existing project
    "project-deletion", // User wants to delete a project
    "ui-interaction", // User wants to manipulate the UI (clear, show cards)
    "general-inquiry", // General questions about Blokar or construction
    "unknown", // Intent cannot be determined
  ]),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
  extractedEntities: z
    .object({
      projectName: z.string().optional(),
      projectId: z.string().optional(),
      status: z.string().optional(),
      address: z.string().optional(),
      projectType: z.string().optional(),
      action: z.string().optional(), // clear, show, delete, etc.
      quantity: z.string().optional(), // all, some, specific number
    })
    .optional(),
});

// ============================================================================
// INTENT CLASSIFICATION PROMPT
// ============================================================================

/**
 * LEARNING: Detailed system prompt for intent classification
 * This prompt teaches Claude how to analyze user messages and classify intents
 */
const INTENT_CLASSIFICATION_PROMPT = `
You are an expert intent classifier for Blokar AI, a construction project management platform.

Your job is to analyze user messages and classify their intent with high accuracy.

## INTENT CATEGORIES:

### project-listing
- User wants to see multiple projects
- Examples: "show me all projects", "list my projects", "what projects do I have?"
- Extract: quantity (all/active/recent), status filter

### project-retrieval  
- User wants details about specific project(s)
- Examples: "show me the Harbor project", "tell me about project ABC-123"
- Extract: projectName, projectId

### project-creation
- User wants to create a new project
- Examples: "create a new building project", "start a residential project in Sydney"
- Extract: projectType, address, status

### project-update
- User wants to modify existing project data
- Examples: "update the Harbor project status to in-progress", "change project address"
- Extract: projectName/projectId, what fields to update

### project-deletion
- User wants to delete/remove a project
- Examples: "delete the abandoned project", "remove project XYZ"
- Extract: projectName, projectId

### ui-interaction
- User wants to manipulate the interface
- Examples: "clear the screen", "show project cards", "hide all cards"
- Extract: action (clear/show/hide)

### general-inquiry
- General questions about Blokar or construction
- Examples: "how does Blokar work?", "what is project management?"

### unknown
- Intent cannot be determined or is unclear
- Examples: ambiguous or incomplete requests

## CLASSIFICATION RULES:

1. **Be precise**: Choose the most specific intent that matches
2. **Extract entities**: Pull out key information like project names, IDs, addresses
3. **High confidence**: Only use confidence > 0.8 for clear, unambiguous requests
4. **Reasoning**: Explain WHY you chose this intent (helps with debugging)
5. **Context matters**: Consider the conversation flow and domain knowledge

## EXAMPLES:

Input: "Show me the Harbor Bridge project details"
→ Intent: project-retrieval, Confidence: 0.95, Entities: {projectName: "Harbor Bridge"}

Input: "Create a new residential building at 123 Main St"  
→ Intent: project-creation, Confidence: 0.9, Entities: {projectType: "residential building", address: "123 Main St"}

Input: "List all my projects"
→ Intent: project-listing, Confidence: 0.95, Entities: {quantity: "all"}

Analyze the user message and classify their intent accurately.
`;

// ============================================================================
// MAIN CLASSIFICATION FUNCTION
// ============================================================================

/**
 * LEARNING: Main intent classification function
 * This uses Claude's reasoning capabilities to classify user intents
 */
export async function classifyIntent(
  userMessage: string,
  conversationHistory?: string[]
): Promise<IntentClassification> {
  try {
    console.log(`🎯 Classifying intent for message: "${userMessage}"`);

    // Build context from conversation history if available
    let contextualPrompt = INTENT_CLASSIFICATION_PROMPT;

    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-3).join("\n");
      contextualPrompt += `\n\n## CONVERSATION CONTEXT:\n${recentHistory}`;
    }

    // Use Claude to classify the intent
    const result = await generateObject({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system: contextualPrompt,
      prompt: `
        Analyze this user message and classify the intent:
        
        User Message: "${userMessage}"
        
        Provide your classification with confidence score and reasoning.
      `,
      schema: IntentClassificationSchema,
    });

    const classification = result.object;

    console.log(
      `✅ Intent classified as: ${classification.intent} (confidence: ${classification.confidence})`
    );
    console.log(`🤔 Reasoning: ${classification.reasoning}`);

    if (classification.extractedEntities) {
      console.log(`📝 Extracted entities:`, classification.extractedEntities);
    }

    return classification;
  } catch (error) {
    console.error("🚨 Error in intent classification:", error);

    // Fallback classification for errors
    return {
      intent: "unknown" as UserIntent,
      confidence: 0.0,
      reasoning: `Classification failed due to error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      extractedEntities: {},
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * LEARNING: Check if intent confidence is acceptable
 * Low confidence intents might need human review or clarification
 */
export function isHighConfidenceIntent(
  classification: IntentClassification,
  threshold: number = 0.7
): boolean {
  return classification.confidence >= threshold;
}

/**
 * LEARNING: Get suggested follow-up questions for low confidence intents
 * Helps users clarify their requests when intent is unclear
 */
export function getSuggestedClarifications(
  classification: IntentClassification
): string[] {
  if (isHighConfidenceIntent(classification)) {
    return [];
  }

  const suggestions: string[] = [];

  switch (classification.intent) {
    case "unknown":
      suggestions.push(
        "Could you please rephrase your request?",
        "Are you looking to view, create, or update a project?",
        "Do you need help with project management features?"
      );
      break;

    case "project-retrieval":
      if (
        !classification.extractedEntities?.projectName &&
        !classification.extractedEntities?.projectId
      ) {
        suggestions.push(
          "Which specific project would you like to see?",
          "Could you provide the project name or ID?",
          "Are you looking for a particular project or all projects?"
        );
      }
      break;

    case "project-update":
      suggestions.push(
        "Which project would you like to update?",
        "What specific information would you like to change?",
        "Are you updating the status, details, or something else?"
      );
      break;

    case "project-creation":
      if (!classification.extractedEntities?.address) {
        suggestions.push(
          "What's the address for this new project?",
          "What type of construction project is this?",
          "Where will this project be located?"
        );
      }
      break;

    default:
      suggestions.push(
        "Could you provide more details about what you'd like to do?"
      );
  }

  return suggestions;
}

/**
 * LEARNING: Extract project identifier from classified intent
 * Helps other agents get the specific project the user is referring to
 */
export function extractProjectIdentifier(
  classification: IntentClassification
): string | null {
  const entities = classification.extractedEntities;

  if (!entities) {
    return null;
  }

  // Prefer ID over name for accuracy
  return entities.projectId || entities.projectName || null;
}

/**
 * LEARNING: Quick intent check functions
 * Convenience functions for common intent checks
 */
export function isProjectIntent(intent: UserIntent): boolean {
  return [
    "project-listing",
    "project-retrieval",
    "project-creation",
    "project-update",
    "project-deletion",
  ].includes(intent);
}

export function isUIIntent(intent: UserIntent): boolean {
  return intent === "ui-interaction";
}

export function requiresProjectAccess(intent: UserIntent): boolean {
  return ["project-retrieval", "project-update", "project-deletion"].includes(
    intent
  );
}
