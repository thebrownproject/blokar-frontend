import { tool } from "ai";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import {
  getAllProjects,
  searchProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
} from "../utils/supabase";
import {
  CreateProjectValidationSchema,
  UpdateProjectValidationSchema,
  SearchProjectValidationSchema,
  ListProjectsParamsSchema,
  safeParseData,
} from "../utils/validation";

// Helper to get current user
async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Authentication required");
  }
  return user;
}

// 🎯 REFACTORED: Return structured JSON instead of formatted strings

const listAvailableProjects = tool({
  description: `
    Get a list of all available projects the user can view.
    Supports filtering by status and pagination.
    Returns structured project data for display and further processing.
  `,
  parameters: ListProjectsParamsSchema,
  execute: async ({ limit, offset, status, organizationId }) => {
    try {
      console.log("📋 Executing listAvailableProjects tool...");

      const result = await getAllProjects({
        limit,
        offset,
        status,
        organizationId,
      });

      // ✅ FIXED: Return structured data instead of formatted string
      return {
        success: true,
        data: {
          projects: result.projects,
          total: result.total,
          hasMore: result.hasMore,
          pagination: {
            limit,
            offset,
            showing: result.projects.length,
          },
        },
        message:
          result.projects.length === 0
            ? "No projects found"
            : `Found ${result.projects.length} project${
                result.projects.length === 1 ? "" : "s"
              }`,
      };
    } catch (error) {
      console.error("🚨 Error in listAvailableProjects tool:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        data: { projects: [], total: 0, hasMore: false },
      };
    }
  },
});

const getProjectDetails = tool({
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

      // ✅ FIXED: Return structured data instead of formatted string
      return {
        success: true,
        data: {
          projects,
          searchTerm: identifier,
          includeRelated,
          total: projects.length,
        },
        message:
          projects.length === 0
            ? `No projects found matching "${identifier}"`
            : `Found ${projects.length} matching project${
                projects.length === 1 ? "" : "s"
              }`,
      };
    } catch (error) {
      console.error("🚨 Error in getProjectDetails tool:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        data: { projects: [], searchTerm: identifier, total: 0 },
      };
    }
  },
});

const createNewProject = tool({
  description: `
    Create a new construction project with the provided details.
    Requires at minimum: name, address, and project type.
    Optional fields include location details, building class, and project scale.
  `,
  parameters: CreateProjectValidationSchema,
  execute: async (projectData) => {
    try {
      console.log(
        `📝 Executing createNewProject tool for: "${projectData.name}"`
      );

      // ✅ Get current user automatically
      const user = await getCurrentUser();

      // Create the project using Supabase utility
      const newProject = await createProject({
        ...projectData,
        user_id: user.id, // ✅ Use authenticated user ID
      });

      return {
        success: true,
        data: {
          project: newProject,
          operation: "create",
        },
        message: `Successfully created project: ${newProject.name}`,
      };
    } catch (error) {
      console.error("🚨 Error in createNewProject tool:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        data: null,
      };
    }
  },
});

const updateExistingProject = tool({
  description: `
    Update an existing project's details by project ID.
    Can modify any project field including status, progress, and descriptive information.
    Returns the updated project data.
  `,
  parameters: z.object({
    project_id: z.string().uuid().describe("ID of the project to update"),
    name: z.string().optional().describe("Updated project name"),
    address: z.string().optional().describe("Updated project address"),
    project_type: z.string().optional().describe("Updated project type"),
    suburb: z.string().optional().describe("Updated suburb"),
    state: z.string().optional().describe("Updated state"),
    postcode: z.string().optional().describe("Updated postcode"),
    building_class: z.string().optional().describe("Updated building class"),
    project_scale: z.string().optional().describe("Updated project scale"),
    status: z.string().optional().describe("Updated project status"),
    progress: z
      .number()
      .min(0)
      .max(100)
      .optional()
      .describe("Updated progress percentage"),
  }),
  execute: async ({ project_id, ...updateData }) => {
    try {
      console.log(
        `📝 Executing updateExistingProject tool for ID: ${project_id}`
      );

      // ✅ Get current user automatically
      const user = await getCurrentUser();

      // ✅ Remove undefined values from updateData
      const cleanUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      );

      // Update the project using Supabase utility
      const updatedProject = await updateProject(
        project_id,
        cleanUpdateData,
        user.id // ✅ Use authenticated user ID
      );

      return {
        success: true,
        data: {
          project: updatedProject,
          operation: "update",
          updatedFields: Object.keys(cleanUpdateData),
        },
        message: `Successfully updated project: ${updatedProject.name}`,
      };
    } catch (error) {
      console.error("🚨 Error in updateExistingProject tool:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        data: null,
      };
    }
  },
});

const deleteExistingProject = tool({
  description: `
    Safely delete a project by ID with confirmation.
    This is a destructive operation that removes the project and associated data.
    Returns confirmation of deletion.
  `,
  parameters: z.object({
    project_id: z.string().uuid().describe("ID of the project to delete"),
    confirm: z
      .boolean()
      .default(false)
      .describe("Confirmation flag - must be true to proceed"),
  }),
  execute: async ({ project_id, confirm }) => {
    try {
      console.log(
        `🗑️ Executing deleteExistingProject tool for ID: ${project_id}`
      );

      if (!confirm) {
        return {
          success: false,
          error: "Deletion requires explicit confirmation",
          data: { requiresConfirmation: true, project_id },
        };
      }

      // ✅ Get current user automatically
      const user = await getCurrentUser();

      // Delete the project using Supabase utility
      const deletedProject = await deleteProject(project_id, user.id);

      return {
        success: true,
        data: {
          deletedProject,
          operation: "delete",
          project_id,
        },
        message: `Successfully deleted project: ${deletedProject.name}`,
      };
    } catch (error) {
      console.error("🚨 Error in deleteExistingProject tool:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        data: { project_id },
      };
    }
  },
});

const getProjectStatistics = tool({
  description: `
    Get analytics and statistics about projects.
    Includes counts by status, progress distribution, and other metrics.
    Useful for dashboard views and project overview.
  `,
  parameters: z.object({
    organizationId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    timeframe: z
      .enum(["week", "month", "quarter", "year", "all"])
      .default("all")
      .describe("Time period for statistics"),
  }),
  execute: async ({ organizationId, userId, timeframe }) => {
    try {
      console.log("📊 Executing getProjectStatistics tool...");

      // Get project statistics using Supabase utility
      const stats = await getProjectStats({
        organizationId,
        userId,
        timeframe,
      });

      // ✅ FIXED: Return structured data instead of formatted string
      return {
        success: true,
        data: {
          statistics: stats,
          timeframe,
          generatedAt: new Date().toISOString(),
        },
        message: `Generated project statistics for ${timeframe} timeframe`,
      };
    } catch (error) {
      console.error("🚨 Error in getProjectStatistics tool:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        data: { statistics: null, timeframe },
      };
    }
  },
});

// Export individual tools and combined object
export {
  listAvailableProjects,
  getProjectDetails,
  createNewProject,
  updateExistingProject,
  deleteExistingProject,
  getProjectStatistics,
};

// Combined tools object for easy import in route.ts
export const projectTools = {
  listAvailableProjects,
  getProjectDetails,
  createNewProject,
  updateExistingProject,
  deleteExistingProject,
  getProjectStatistics,
};
