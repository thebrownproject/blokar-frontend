// ============================================================================
// BLOKAR AI AGENT SYSTEM - PROJECT AGENT
// ============================================================================
// This file contains the Project Agent - a domain specialist for all project-related operations.
//
// LEARNING NOTES:
// - Project Agent is a domain specialist focused on construction projects
// - It handles all CRUD operations for projects using specialized tools
// - Provides intelligent responses with construction industry context
// - Validates user permissions and data integrity
// - Coordinates between database operations and UI interactions
// ============================================================================

import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import {
  listAvailableProjects,
  getProjectDetails,
  createNewProject,
  updateExistingProject,
  deleteExistingProject,
  getProjectStatistics,
  showProjectCard,
  clearAllCards,
} from "../tools/projects";
import {
  highlightProject,
  refreshProjectList,
  searchProjectsByLocation,
} from "../tools/system";
import type { AgentResponse, AgentContext } from "../types/agents";

// ============================================================================
// PROJECT AGENT CONFIGURATION
// ============================================================================

/**
 * LEARNING: Project Agent system prompt
 * This prompt gives the agent specialized knowledge about construction projects
 */
const PROJECT_AGENT_SYSTEM_PROMPT = `
You are the Project Agent for Blokar AI, specializing in construction project management.

## YOUR DOMAIN EXPERTISE:

### Construction Project Knowledge:
- Understanding of AEC (Architecture, Engineering, Construction) workflows
- Project lifecycle management (planning, design, construction, completion)
- Industry terminology and best practices
- Compliance and regulatory considerations
- Resource management and scheduling

### Data Management:
- Project CRUD operations (Create, Read, Update, Delete)
- Project search and filtering capabilities
- Progress tracking and status management
- Geographic and organizational project grouping

### User Interface Coordination:
- Display project information in user-friendly formats
- Manage project cards and visual presentations
- Coordinate between data operations and UI updates

## AVAILABLE TOOLS:

### Database Operations:
- listAvailableProjects: Get all projects with filtering
- getProjectDetails: Search specific projects by name/ID
- createNewProject: Create new construction projects
- updateExistingProject: Modify existing project data
- deleteExistingProject: Remove projects (with safety checks)
- getProjectStatistics: Project analytics and metrics
- searchProjectsByLocation: Find projects by geographic area

### UI Operations:
- showProjectCard: Display specific project in UI
- clearAllCards: Clear the display area
- highlightProject: Emphasize specific project
- refreshProjectList: Update project listings

## RESPONSE GUIDELINES:

### For Project Queries:
- Use appropriate construction terminology
- Provide context about project status and progress
- Suggest relevant next actions (view details, update status, etc.)
- Include project metadata when helpful

### For Project Creation:
- Guide users through required information collection
- Validate project data for completeness and accuracy
- Explain project setup process and next steps
- Suggest best practices for new projects

### For Project Updates:
- Confirm changes before applying them
- Explain the impact of updates
- Validate data integrity
- Track change history when relevant

### For Data Presentation:
- Organize information logically (status, location, progress)
- Use visual indicators when appropriate (✅ ❌ 🔄 📊)
- Provide summaries for large datasets
- Suggest filtering or search refinements

## SAFETY AND VALIDATION:

### Before Deletions:
- Always confirm user intent
- Check for dependent data (tasks, documents)
- Explain consequences of deletion
- Offer alternatives when appropriate

### For Data Integrity:
- Validate required fields before operations
- Check user permissions for requested actions
- Ensure organizational boundaries are respected
- Log important changes for audit trails

Remember: You are the specialist who makes project management feel intuitive and powerful while maintaining data integrity and industry best practices.
`;

// ============================================================================
// PROJECT AGENT HANDLER
// ============================================================================

/**
 * LEARNING: Main Project Agent function
 * Handles all project-related requests routed from the Master Agent
 */
export async function projectAgentHandler(
  context: AgentContext
): Promise<AgentResponse> {
  const startTime = Date.now();
  const { userMessage, intent, conversationHistory } = context;

  try {
    console.log("🏗️ Project Agent processing:", intent.intent);

    // Determine which tools to include based on intent
    const tools = getToolsForIntent(intent.intent);

    // Collect tool results as they happen
    const collectedToolResults: Array<{
      toolCallId: string;
      toolName: string;
      args: unknown;
      result: unknown;
    }> = [];

    // Generate response using Claude with appropriate tools
    const result = await streamText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system: PROJECT_AGENT_SYSTEM_PROMPT,
      messages: [
        // Include relevant conversation history
        ...(conversationHistory || [])
          .slice(-5)
          .map((msg: { role: string; content: string }) => ({
            role: msg.role as "system" | "user" | "assistant",
            content: msg.content,
          })),
        {
          role: "user" as const,
          content: `${userMessage}

Context: This request has been classified as "${intent.intent}" with ${(
            intent.confidence * 100
          ).toFixed(1)}% confidence.

${
  intent.entities?.length
    ? `Extracted entities: ${intent.entities.join(", ")}`
    : ""
}

Please handle this request using the appropriate tools and provide a helpful response.`,
        },
      ],
      tools,
      maxSteps: 3, // Allow multi-step workflows
      onStepFinish: (step) => {
        // Collect tool results as they happen
        if (step.toolResults) {
          collectedToolResults.push(...step.toolResults);
        }
      },
    });

    // Stream the response and collect tool results
    let responseText = "";

    for await (const delta of result.textStream) {
      responseText += delta;
    }

    // Wait for all tool results to be available (in case some weren't captured in onStepFinish)
    const finalToolResults = await result.toolResults;

    // Use the final tool results or collected results
    const allToolResults =
      finalToolResults.length > 0 ? finalToolResults : collectedToolResults;

    const processingTime = Date.now() - startTime;

    return {
      success: true,
      message: responseText || "I've processed your project request.",
      data: extractDataFromToolResults(allToolResults),
      metadata: {
        agent: "project",
        intent: intent.intent,
        confidence: intent.confidence,
        processingTime,
        toolsUsed: allToolResults.map((tr) => tr.toolName),
      },
      suggestions: generateSuggestions(intent.intent),
    };
  } catch (error) {
    console.error("🚨 Project Agent error:", error);

    return {
      success: false,
      message:
        "I encountered an error while processing your project request. Please try again.",
      metadata: {
        agent: "project",
        error: error instanceof Error ? error.message : "Unknown error",
        processingTime: Date.now() - startTime,
      },
      suggestions: [
        "Try rephrasing your project request",
        "Check if the project name or ID is correct",
        "List all projects first to see what's available",
      ],
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * LEARNING: Dynamic tool selection
 * Different intents require different sets of tools
 */
function getToolsForIntent(intent: string) {
  const baseTools = {
    listAvailableProjects,
    getProjectDetails,
    getProjectStatistics,
    showProjectCard,
    clearAllCards,
  };

  switch (intent) {
    case "project-listing":
      return {
        ...baseTools,
        searchProjectsByLocation,
        refreshProjectList,
      };

    case "project-retrieval":
      return {
        ...baseTools,
        highlightProject,
      };

    case "project-creation":
      return {
        ...baseTools,
        createNewProject,
      };

    case "project-update":
      return {
        ...baseTools,
        updateExistingProject,
      };

    case "project-deletion":
      return {
        ...baseTools,
        deleteExistingProject,
      };

    case "ui-interaction":
      return {
        showProjectCard,
        clearAllCards,
        highlightProject,
        refreshProjectList,
        listAvailableProjects,
        getProjectDetails,
      };

    default:
      return baseTools;
  }
}

/**
 * LEARNING: Extract structured data from tool results
 * Useful for further processing or UI updates
 */
function extractDataFromToolResults(
  toolResults:
    | Array<{
        toolCallId: string;
        toolName: string;
        args: unknown;
        result: unknown;
      }>
    | Array<{
        toolCallId: string;
        toolName: string;
        args: unknown;
        result: unknown;
      }>
): {
  projects: unknown[];
  statistics: unknown;
  operations: Array<{
    operation: string;
    success: boolean;
    details: unknown;
  }>;
} {
  const data = {
    projects: [] as unknown[],
    statistics: null as unknown,
    operations: [] as Array<{
      operation: string;
      success: boolean;
      details: unknown;
    }>,
  };

  console.log(
    "🔧 toolResults type:",
    typeof toolResults,
    "length:",
    toolResults.length
  );

  for (const result of toolResults) {
    try {
      switch (result.toolName) {
        case "listAvailableProjects":
        case "getProjectDetails":
        case "searchProjectsByLocation":
          // Extract project data if available
          if (result.result && typeof result.result === "object") {
            const resultObj = result.result as { projects?: unknown[] };
            data.projects.push(...(resultObj.projects || []));
          }
          break;

        case "getProjectStatistics":
          if (result.result && typeof result.result === "object") {
            data.statistics = result.result;
          }
          break;

        case "createNewProject":
        case "updateExistingProject":
        case "deleteExistingProject":
          data.operations.push({
            operation: result.toolName,
            success:
              typeof result.result === "string"
                ? !result.result.includes("❌")
                : true,
            details: result.result,
          });
          break;
      }
    } catch (error) {
      console.warn("Error extracting data from tool result:", error);
    }
  }

  return data;
}

/**
 * LEARNING: Generate contextual suggestions
 * Help users understand what they can do next
 */
function generateSuggestions(intent: string): string[] {
  const suggestions: string[] = [];

  switch (intent) {
    case "project-listing":
      suggestions.push(
        "View details of a specific project",
        "Create a new project",
        "Filter projects by status or location",
        "Get project statistics"
      );
      break;

    case "project-retrieval":
      suggestions.push(
        "Update project status or details",
        "View related tasks or documents",
        "Check project progress",
        "See similar projects"
      );
      break;

    case "project-creation":
      suggestions.push(
        "Add project tasks and milestones",
        "Upload project documents",
        "Set up project team members",
        "Configure project notifications"
      );
      break;

    case "project-update":
      suggestions.push(
        "Review the updated project details",
        "Notify team members of changes",
        "Update related tasks if needed",
        "Check project timeline"
      );
      break;

    case "project-deletion":
      suggestions.push(
        "Create a new project to replace it",
        "Review remaining projects",
        "Check for any cleanup needed",
        "Update project statistics"
      );
      break;

    default:
      suggestions.push(
        "List all your projects",
        "Search for a specific project",
        "Create a new project",
        "Get project analytics"
      );
  }

  return suggestions;
}

/**
 * LEARNING: Validate project permissions
 * Ensure users can only access projects they're authorized to see
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function validateProjectAccess(
  _projectId: string,
  _userId: string,
  _organizationId?: string
): Promise<boolean> {
  try {
    // This would typically check database permissions
    // For now, we'll implement basic validation
    return true; // Implement actual permission checking based on your auth system
  } catch (error) {
    console.error("Error validating project access:", error);
    return false;
  }
}

/**
 * LEARNING: Helper for project data formatting
 * Consistent formatting across different operations
 */
export function formatProjectForDisplay(project: {
  name?: string;
  address?: string;
  suburb?: string;
  status?: string;
  progress?: number;
  created_at?: string;
}): string {
  return `🏗️ **${project.name || "Untitled Project"}**
📍 ${project.address || "No address"}${
    project.suburb ? `, ${project.suburb}` : ""
  }
📊 Status: ${project.status || "Unknown"}
📈 Progress: ${project.progress || 0}%
📅 Created: ${
    project.created_at
      ? new Date(project.created_at).toLocaleDateString()
      : "Unknown"
  }`;
}
