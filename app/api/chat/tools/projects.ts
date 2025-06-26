// ============================================================================
// BLOKAR AI AGENT SYSTEM - PROJECT TOOLS
// ============================================================================
// This file contains all database tools for project operations using AI SDK.
//
// LEARNING NOTES:
// - Each tool is defined using the AI SDK tool() function
// - Tools with execute() functions run on the server
// - Tools handle database operations through Supabase utilities
// - Proper validation ensures data integrity before database operations
// - Error handling provides meaningful feedback to agents and users
// ============================================================================

import { tool } from "ai";
import { z } from "zod";
import {
  getAllProjects,
  searchProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
  hasProjectAccess,
} from "../utils/supabase";
import {
  CreateProjectValidationSchema,
  UpdateProjectValidationSchema,
  SearchProjectValidationSchema,
  DeleteProjectValidationSchema,
  ListProjectsParamsSchema,
  safeParseData,
} from "../utils/validation";

// ============================================================================
// PROJECT LISTING TOOLS
// ============================================================================

/**
 * LEARNING: List all projects tool
 * This tool fetches all projects with optional filtering and pagination
 * Used for intents like "show me all projects" or "list my projects"
 */
export const listAvailableProjects = tool({
  description: `
    Get a list of all available projects the user can view.
    Supports filtering by status and pagination.
    Returns project summaries including name, status, address, and progress.
  `,
  parameters: ListProjectsParamsSchema,
  execute: async ({ limit, offset, status, organizationId }) => {
    try {
      console.log("📋 Executing listAvailableProjects tool...");

      // Use the Supabase utility function
      const result = await getAllProjects({
        limit,
        offset,
        status,
        organizationId,
      });

      // Format response for LLM consumption
      if (result.projects.length === 0) {
        return "No projects found. You can create a new project to get started!";
      }

      const projectsList = result.projects
        .map(
          (project) =>
            `• ${project.name} (${project.status || "No status"}) - ${
              project.address
            } [${project.progress || 0}% complete]`
        )
        .join("\n");

      let response = `Found ${result.projects.length} project${
        result.projects.length === 1 ? "" : "s"
      }:\n\n${projectsList}`;

      if (result.hasMore) {
        response += `\n\n📄 Showing ${offset + 1}-${
          offset + result.projects.length
        } of ${result.total}+ projects. Ask to see more if needed.`;
      }

      return response;
    } catch (error) {
      console.error("🚨 Error in listAvailableProjects tool:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return `❌ Failed to fetch projects: ${errorMessage}`;
    }
  },
});

/**
 * LEARNING: Get project statistics tool
 * Provides overview analytics useful for dashboards
 */
export const getProjectStatistics = tool({
  description: `
    Get project statistics including total count, status breakdown, and average progress.
    Useful for dashboard views and project analytics.
  `,
  parameters: z.object({
    organizationId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
  }),
  execute: async ({
    organizationId,
    userId,
  }: {
    organizationId?: string;
    userId?: string;
  }) => {
    try {
      console.log("📊 Executing getProjectStatistics tool...");

      const stats = await getProjectStats({ organizationId, userId });

      const statusBreakdown = Object.entries(stats.byStatus)
        .map(([status, count]) => `  - ${status}: ${count}`)
        .join("\n");

      return `📊 Project Statistics:
        
Total Projects: ${stats.total}
Average Progress: ${stats.averageProgress}%

Status Breakdown:
${statusBreakdown}`;
    } catch (error) {
      console.error("🚨 Error in getProjectStatistics tool:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return `❌ Failed to get project statistics: ${errorMessage}`;
    }
  },
});

// ============================================================================
// PROJECT SEARCH AND RETRIEVAL TOOLS
// ============================================================================

/**
 * LEARNING: Get project details tool
 * Searches for specific projects by ID or name
 * Used for intents like "show me the Harbor project"
 */
export const getProjectDetails = tool({
  description: `
    Get detailed information about specific project(s) by ID or name.
    Supports fuzzy name matching and returns comprehensive project data.
    Can include related tasks and contacts if requested.
  `,
  parameters: SearchProjectValidationSchema.extend({
    includeRelated: z
      .boolean()
      .default(false)
      .describe("Include related tasks and contacts"),
    organizationId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
  }),
  execute: async ({
    identifier,
    limit,
    includeRelated,
    organizationId,
    userId,
  }) => {
    try {
      console.log(`🔍 Executing getProjectDetails tool for: "${identifier}"`);

      const projects = await searchProjects(identifier, {
        limit,
        includeRelated,
        organizationId,
        userId,
      });

      if (projects.length === 0) {
        return `❌ No projects found matching "${identifier}". Please check the spelling or try a different search term.`;
      }

      // Format detailed project information
      const projectDetails = projects
        .map((project) => {
          let details = `🏗️ **${project.name}**
📍 Address: ${project.address}${project.suburb ? `, ${project.suburb}` : ""}${
            project.state ? `, ${project.state}` : ""
          } ${project.postcode || ""}
📊 Status: ${project.status || "Unknown"}
📈 Progress: ${project.progress || 0}%
🏢 Type: ${project.project_type || "Not specified"}
📅 Created: ${new Date(project.created_at).toLocaleDateString()}`;

          if (project.project_scale) {
            details += `\n🏗️ Scale: ${project.project_scale}`;
          }

          if (project.building_class) {
            details += `\n🏢 Building Class: ${project.building_class}`;
          }

          // Add related data if included
          if (includeRelated) {
            if (project.project_tasks && project.project_tasks.length > 0) {
              details += `\n\n📋 **Recent Tasks:**`;
              project.project_tasks.forEach((task: any) => {
                details += `\n  • ${task.title} (${task.status}) - ${
                  task.assignee || "Unassigned"
                }`;
              });
            }

            if (
              project.project_contacts &&
              project.project_contacts.length > 0
            ) {
              details += `\n\n👥 **Key Contacts:**`;
              project.project_contacts.forEach((contact: any) => {
                details += `\n  • ${contact.name} (${contact.contact_type}) - ${
                  contact.company || "No company"
                }`;
              });
            }
          }

          details += `\n🆔 Project ID: ${project.id}`;
          return details;
        })
        .join("\n\n" + "─".repeat(50) + "\n\n");

      const header = `Found ${projects.length} matching project${
        projects.length === 1 ? "" : "s"
      }:\n\n`;

      return header + projectDetails;
    } catch (error) {
      console.error("🚨 Error in getProjectDetails tool:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return `❌ Failed to search projects: ${errorMessage}`;
    }
  },
});

// ============================================================================
// PROJECT CREATION TOOLS
// ============================================================================

/**
 * LEARNING: Create new project tool
 * Handles project creation with comprehensive validation
 * Used for intents like "create a new building project"
 */
export const createNewProject = tool({
  description: `
    Create a new construction project with the provided details.
    Requires at minimum: name, address, and project type.
    Optional fields include location details, building class, and project scale.
  `,
  parameters: CreateProjectValidationSchema.extend({
    user_id: z.string().uuid().describe("ID of the user creating the project"),
    organization_id: z
      .string()
      .uuid()
      .optional()
      .describe("Organization ID for multi-tenant projects"),
  }),
  execute: async (projectData) => {
    try {
      console.log(
        `📝 Executing createNewProject tool for: "${projectData.name}"`
      );

      // Validate the project data
      const validatedData = safeParseData(
        CreateProjectValidationSchema.extend({
          user_id: z.string().uuid(),
          organization_id: z.string().uuid().optional(),
        }),
        projectData,
        "project creation data"
      );

      // Create the project using Supabase utility
      const newProject = await createProject(validatedData);

      return `✅ Successfully created project: **${newProject.name}**

📋 Project Details:
📍 Address: ${newProject.address}
🏢 Type: ${newProject.project_type}
📊 Status: ${newProject.status}
📈 Progress: ${newProject.progress}%
🆔 Project ID: ${newProject.id}

The project has been created and is ready for use. You can now add tasks, contacts, and documents to this project.`;
    } catch (error) {
      console.error("🚨 Error in createNewProject tool:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return `❌ Failed to create project: ${errorMessage}`;
    }
  },
});

// ============================================================================
// PROJECT UPDATE TOOLS
// ============================================================================

/**
 * LEARNING: Update project tool
 * Handles partial updates to existing projects
 * Used for intents like "update the Harbor project status to in-progress"
 */
export const updateExistingProject = tool({
  description: `
    Update an existing project's information.
    Can update any field including status, progress, address, or other details.
    Requires project ID and the fields to update.
  `,
  parameters: UpdateProjectValidationSchema.extend({
    organizationId: z
      .string()
      .uuid()
      .optional()
      .describe("Organization ID for authorization"),
    userId: z.string().uuid().optional().describe("User ID for authorization"),
  }),
  execute: async ({ id, organizationId, userId, ...updates }) => {
    try {
      console.log(`📝 Executing updateExistingProject tool for project: ${id}`);

      // Check if user has access to the project
      if (userId && !(await hasProjectAccess(id, userId, organizationId))) {
        return `❌ Access denied. You don't have permission to update this project.`;
      }

      // Filter out undefined values from updates
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([, value]) => value !== undefined)
      );

      if (Object.keys(cleanUpdates).length === 0) {
        return `❌ No updates provided. Please specify what you want to change.`;
      }

      // Update the project using Supabase utility
      const updatedProject = await updateProject(id, cleanUpdates, {
        organizationId,
        userId,
      });

      const updatedFields = Object.keys(cleanUpdates).join(", ");

      return `✅ Successfully updated project: **${updatedProject.name}**

🔄 Updated fields: ${updatedFields}

📋 Current Project Details:
📍 Address: ${updatedProject.address}
🏢 Type: ${updatedProject.project_type}
📊 Status: ${updatedProject.status}
📈 Progress: ${updatedProject.progress}%
📅 Last Updated: ${new Date(updatedProject.updated_at).toLocaleString()}

The project has been updated successfully.`;
    } catch (error) {
      console.error("🚨 Error in updateExistingProject tool:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return `❌ Failed to update project: ${errorMessage}`;
    }
  },
});

// ============================================================================
// PROJECT DELETION TOOLS
// ============================================================================

/**
 * LEARNING: Delete project tool
 * Handles project deletion with proper authorization checks
 * Used for intents like "delete the abandoned project"
 */
export const deleteExistingProject = tool({
  description: `
    Delete an existing project permanently.
    This action cannot be undone. Requires proper authorization.
    Will also remove associated tasks, contacts, and documents.
  `,
  parameters: DeleteProjectValidationSchema.extend({
    organizationId: z
      .string()
      .uuid()
      .optional()
      .describe("Organization ID for authorization"),
    userId: z.string().uuid().optional().describe("User ID for authorization"),
    confirmDeletion: z
      .boolean()
      .default(false)
      .describe("Confirmation that the user wants to delete the project"),
  }),
  execute: async ({ id, organizationId, userId, confirmDeletion }) => {
    try {
      console.log(`🗑️ Executing deleteExistingProject tool for project: ${id}`);

      // Check if user has access to the project
      if (userId && !(await hasProjectAccess(id, userId, organizationId))) {
        return `❌ Access denied. You don't have permission to delete this project.`;
      }

      // Require explicit confirmation for deletion
      if (!confirmDeletion) {
        return `⚠️ Project deletion requires confirmation. This action cannot be undone and will remove all associated data including tasks, contacts, and documents. Please confirm if you want to proceed.`;
      }

      // Get project details before deletion for confirmation message
      const projects = await searchProjects(id, { limit: 1 });
      const projectName = projects[0]?.name || "Unknown Project";

      // Delete the project using Supabase utility
      await deleteProject(id, { organizationId, userId });

      return `✅ Successfully deleted project: **${projectName}**

🗑️ The following has been permanently removed:
- Project details and settings
- All associated tasks
- All project contacts  
- All uploaded documents
- All chat history

This action cannot be undone. The project ID ${id} is no longer valid.`;
    } catch (error) {
      console.error("🚨 Error in deleteExistingProject tool:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return `❌ Failed to delete project: ${errorMessage}`;
    }
  },
});

// ============================================================================
// CLIENT-SIDE UI TOOLS
// ============================================================================

/**
 * LEARNING: Client-side tools for UI manipulation
 * These tools have NO execute function, so they're forwarded to the client
 * Used for intents like "show project card" or "clear the screen"
 */

export const showProjectCard = tool({
  description: `
    Display a project card on the user's screen for a specific project.
    Use this when the user wants to see a visual project card in the UI.
  `,
  parameters: z.object({
    projectId: z.string().uuid().describe("The ID of the project to display"),
    projectName: z
      .string()
      .optional()
      .describe("The name of the project (for display)"),
  }),
  // No execute function = client-side tool
});

export const clearAllCards = tool({
  description: `
    Clear all project cards and content from the display area.
    Use this when the user wants to clean up the interface.
  `,
  parameters: z.object({
    confirmClear: z
      .boolean()
      .default(true)
      .describe("Whether to confirm the clear action"),
  }),
  // No execute function = client-side tool
});

export const showMultipleProjectCards = tool({
  description: `
    Display multiple project cards on the user's screen.
    Use this when showing a list of projects visually.
  `,
  parameters: z.object({
    projectIds: z
      .array(z.string().uuid())
      .describe("Array of project IDs to display"),
    layout: z
      .enum(["grid", "list", "carousel"])
      .default("grid")
      .describe("How to layout the project cards"),
  }),
  // No execute function = client-side tool
});

// ============================================================================
// TOOL EXPORTS
// ============================================================================

/**
 * LEARNING: Export all tools for use in agents
 * This makes all tools available to the Project Agent and Master Agent
 */
export const projectTools = {
  // Server-side tools (database operations)
  listAvailableProjects,
  getProjectDetails,
  createNewProject,
  updateExistingProject,
  deleteExistingProject,
  getProjectStatistics,

  // Client-side tools (UI manipulation)
  showProjectCard,
  clearAllCards,
  showMultipleProjectCards,
};

// Tools are already exported above with 'export const' declarations
// No need for duplicate exports
