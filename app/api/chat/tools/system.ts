// ============================================================================
// BLOKAR AI AGENT SYSTEM - SYSTEM TOOLS (OPTIMIZED)
// ============================================================================
// Client-side tools for UI manipulation and workspace management.
// These tools have no execute function, so they're handled by the frontend.
// ============================================================================

import { tool } from "ai";
import { z } from "zod";

/**
 * Display project card in the UI workspace
 */
export const showProjectCard = tool({
  description:
    "Display a project card on the user's screen with project details",
  parameters: z.object({
    projectId: z.string().describe("The ID of the project to display"),
  }),
  // No execute function = client-side tool handled by React
});

/**
 * Clear workspace of all displayed cards
 */
export const clearAllCards = tool({
  description: "Clear all cards from the display area to start fresh",
  parameters: z.object({}),
  // No execute function = client-side tool handled by React
});

/**
 * Highlight specific project in the UI
 */
export const highlightProject = tool({
  description: "Highlight or emphasize a specific project in the interface",
  parameters: z.object({
    projectId: z.string().describe("The ID of the project to highlight"),
  }),
  // No execute function = client-side tool handled by React
});

/**
 * Refresh the project list display
 */
export const refreshProjectList = tool({
  description: "Refresh and update the project list display with latest data",
  parameters: z.object({}),
  // No execute function = client-side tool handled by React
});

/**
 * Show multiple project cards efficiently
 */
export const showMultipleProjectCards = tool({
  description:
    "Display multiple project cards simultaneously in an organized layout",
  parameters: z.object({
    projectIds: z.array(z.string()).describe("Array of project IDs to display"),
    clearFirst: z
      .boolean()
      .default(true)
      .describe("Whether to clear existing cards first"),
  }),
  // No execute function = client-side tool handled by React
});

/**
 * Navigate to specific project view
 */
export const navigateToProject = tool({
  description: "Navigate to a detailed project view or specific project page",
  parameters: z.object({
    projectId: z.string().describe("The ID of the project to navigate to"),
    view: z
      .enum(["details", "tasks", "timeline", "documents"])
      .optional()
      .describe("Specific view to open"),
  }),
  // No execute function = client-side tool handled by React
});

/**
 * Update workspace layout
 */
export const updateWorkspaceLayout = tool({
  description:
    "Organize and optimize the workspace layout for better information display",
  parameters: z.object({
    layout: z
      .enum(["grid", "list", "timeline", "kanban"])
      .describe("Layout style to apply"),
    density: z
      .enum(["compact", "comfortable", "spacious"])
      .default("comfortable")
      .describe("Information density"),
  }),
  // No execute function = client-side tool handled by React
});

// ✅ MOVED: searchProjectsByLocation functionality moved to project tools
// This was incorrectly placed in system tools since it's data retrieval, not UI management

// Export all system tools for easy import
export const systemTools = {
  showProjectCard,
  clearAllCards,
  highlightProject,
  refreshProjectList,
  showMultipleProjectCards,
  navigateToProject,
  updateWorkspaceLayout,
};
