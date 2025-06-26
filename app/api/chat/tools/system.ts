// ============================================================================
// BLOKAR AI AGENT SYSTEM - SYSTEM TOOLS
// ============================================================================
// This file contains client-side tools for UI manipulation.
// These tools have no execute function, so they're forwarded to the client.
// ============================================================================

import { tool } from "ai";
import { z } from "zod";

/**
 * Show project card tool (client-side)
 */
export const showProjectCard = tool({
  description: "Display a project card on the user's screen",
  parameters: z.object({
    projectId: z.string().describe("The ID of the project to display"),
  }),
  // No execute function = client-side tool
});

/**
 * Clear all cards tool (client-side)
 */
export const clearAllCards = tool({
  description: "Clear all cards from the display area",
  parameters: z.object({}),
  // No execute function = client-side tool
});

/**
 * Highlight project tool (client-side)
 */
export const highlightProject = tool({
  description: "Highlight a specific project in the UI",
  parameters: z.object({
    projectId: z.string().describe("The ID of the project to highlight"),
  }),
  // No execute function = client-side tool
});

/**
 * Refresh project list tool (client-side)
 */
export const refreshProjectList = tool({
  description: "Refresh the project list display",
  parameters: z.object({}),
  // No execute function = client-side tool
});

/**
 * Search projects by location tool (placeholder)
 */
export const searchProjectsByLocation = tool({
  description: "Search for projects by geographic location",
  parameters: z.object({
    location: z.string().describe("Location to search for projects"),
  }),
  execute: async ({ location }) => {
    return `Searching for projects in ${location} - this feature is coming soon!`;
  },
});
