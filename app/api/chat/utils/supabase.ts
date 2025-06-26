// ============================================================================
// BLOKAR AI AGENT SYSTEM - SUPABASE UTILITIES
// ============================================================================
// This file contains helper functions for interacting with the Supabase database.
//
// LEARNING NOTES:
// - These utilities provide a clean interface between agents and the database
// - Error handling is centralized and consistent
// - RLS (Row Level Security) is properly handled for multi-tenant access
// ============================================================================

import { createClient } from "@/utils/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

// ============================================================================
// SUPABASE CLIENT WRAPPER
// ============================================================================

/**
 * LEARNING: Supabase client wrapper with error handling
 * This ensures we always have a properly initialized client
 */
export async function getSupabaseClient(): Promise<SupabaseClient> {
  try {
    const client = await createClient();
    return client;
  } catch (error) {
    console.error("🚨 Failed to initialize Supabase client:", error);
    throw new Error("Database connection failed");
  }
}

// ============================================================================
// PROJECT OPERATIONS
// ============================================================================

/**
 * LEARNING: Get all projects with optional filtering
 * Supports pagination and organization-based filtering for multi-tenancy
 */
export async function getAllProjects(
  options: {
    limit?: number;
    offset?: number;
    status?: string;
    organizationId?: string;
    userId?: string;
  } = {}
) {
  const { limit = 20, offset = 0, status, organizationId, userId } = options;

  try {
    console.log("📋 Fetching projects with options:", options);

    const supabase = await getSupabaseClient();

    // Build query with optional filters
    let query = supabase
      .from("projects")
      .select(
        `
        id,
        name,
        address,
        suburb,
        state,
        postcode,
        project_type,
        project_scale,
        building_class,
        status,
        progress,
        created_at,
        updated_at,
        organization_id,
        user_id
      `
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters if provided
    if (status) {
      query = query.eq("status", status);
    }

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: projects, error, count } = await query;

    if (error) {
      console.error("❌ Supabase error fetching projects:", error);
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    console.log(`✅ Successfully fetched ${projects?.length || 0} projects`);

    return {
      projects: projects || [],
      total: count || 0,
      hasMore: (projects?.length || 0) === limit,
    };
  } catch (error) {
    console.error("🚨 Error in getAllProjects:", error);
    throw error;
  }
}

/**
 * LEARNING: Search projects by ID or name
 * Flexible search function that handles both UUID and text searches
 */
export async function searchProjects(
  identifier: string,
  options: {
    limit?: number;
    includeRelated?: boolean;
    organizationId?: string;
    userId?: string;
  } = {}
) {
  const { limit = 5, includeRelated = false, organizationId, userId } = options;

  try {
    console.log(`🔍 Searching for projects with identifier: "${identifier}"`);

    const supabase = await getSupabaseClient();

    // Check if identifier is a UUID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier
      );

    // Build base query
    let selectClause = `
      id,
      name,
      address,
      suburb,
      state,
      postcode,
      project_type,
      project_scale,
      building_class,
      status,
      progress,
      created_at,
      updated_at,
      organization_id,
      user_id
    `;

    // Optionally include related data
    if (includeRelated) {
      selectClause += `,
        project_tasks (
          id,
          title,
          status,
          due_date,
          assignee
        ),
        project_contacts (
          id,
          name,
          contact_type,
          company,
          email
        )
      `;
    }

    let query = supabase.from("projects").select(selectClause).limit(limit);

    // Search by ID or name
    if (isUUID) {
      console.log("🆔 Searching by project ID");
      query = query.eq("id", identifier);
    } else {
      console.log("🏷️ Searching by project name");
      query = query.ilike("name", `%${identifier}%`);
    }

    // Apply organizational filters
    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: projects, error } = await query;

    if (error) {
      console.error("❌ Supabase error searching projects:", error);
      throw new Error(`Failed to search projects: ${error.message}`);
    }

    console.log(`✅ Found ${projects?.length || 0} matching projects`);

    return projects || [];
  } catch (error) {
    console.error("🚨 Error in searchProjects:", error);
    throw error;
  }
}

/**
 * LEARNING: Create a new project
 * Handles project creation with proper validation and error handling
 */
export async function createProject(projectData: {
  name: string;
  address: string;
  project_type: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  building_class?: string;
  project_scale?: string;
  status?: string;
  progress?: number;
  user_id: string;
  organization_id?: string;
}) {
  try {
    console.log("📝 Creating new project:", projectData.name);

    const supabase = await getSupabaseClient();

    const { data: project, error } = await supabase
      .from("projects")
      .insert([
        {
          ...projectData,
          status: projectData.status || "planning",
          progress: projectData.progress || 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase error creating project:", error);
      throw new Error(`Failed to create project: ${error.message}`);
    }

    console.log(`✅ Successfully created project: ${project.name}`);
    return project;
  } catch (error) {
    console.error("🚨 Error in createProject:", error);
    throw error;
  }
}

/**
 * LEARNING: Update an existing project
 * Allows partial updates to project data
 */
export async function updateProject(
  projectId: string,
  updates: Partial<{
    name: string;
    address: string;
    project_type: string;
    suburb: string;
    state: string;
    postcode: string;
    building_class: string;
    project_scale: string;
    status: string;
    progress: number;
  }>,
  options: {
    organizationId?: string;
    userId?: string;
  } = {}
) {
  try {
    console.log(`📝 Updating project ${projectId}:`, updates);

    const supabase = await getSupabaseClient();

    // Build query with RLS considerations
    let query = supabase
      .from("projects")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select()
      .single();

    // Apply additional filters for security
    if (options.organizationId) {
      query = query.eq("organization_id", options.organizationId);
    }

    if (options.userId) {
      query = query.eq("user_id", options.userId);
    }

    const { data: project, error } = await query;

    if (error) {
      console.error("❌ Supabase error updating project:", error);
      throw new Error(`Failed to update project: ${error.message}`);
    }

    if (!project) {
      throw new Error("Project not found or access denied");
    }

    console.log(`✅ Successfully updated project: ${project.name}`);
    return project;
  } catch (error) {
    console.error("🚨 Error in updateProject:", error);
    throw error;
  }
}

/**
 * LEARNING: Delete a project
 * Handles project deletion with proper authorization checks
 */
export async function deleteProject(
  projectId: string,
  options: {
    organizationId?: string;
    userId?: string;
  } = {}
) {
  try {
    console.log(`🗑️ Deleting project ${projectId}`);

    const supabase = await getSupabaseClient();

    // Build query with RLS considerations
    let query = supabase.from("projects").delete().eq("id", projectId);

    // Apply additional filters for security
    if (options.organizationId) {
      query = query.eq("organization_id", options.organizationId);
    }

    if (options.userId) {
      query = query.eq("user_id", options.userId);
    }

    const { error } = await query;

    if (error) {
      console.error("❌ Supabase error deleting project:", error);
      throw new Error(`Failed to delete project: ${error.message}`);
    }

    console.log(`✅ Successfully deleted project ${projectId}`);
    return { success: true, projectId };
  } catch (error) {
    console.error("🚨 Error in deleteProject:", error);
    throw error;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * LEARNING: Check if user has access to project
 * Useful for authorization checks before operations
 */
export async function hasProjectAccess(
  projectId: string,
  userId: string,
  organizationId?: string
): Promise<boolean> {
  try {
    const supabase = await getSupabaseClient();

    let query = supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", userId);

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("🚨 Error checking project access:", error);
    return false;
  }
}

/**
 * LEARNING: Get project statistics
 * Useful for dashboard and analytics features
 */
export async function getProjectStats(
  options: {
    organizationId?: string;
    userId?: string;
  } = {}
) {
  try {
    const supabase = await getSupabaseClient();

    let query = supabase.from("projects").select("status, progress");

    if (options.organizationId) {
      query = query.eq("organization_id", options.organizationId);
    }

    if (options.userId) {
      query = query.eq("user_id", options.userId);
    }

    const { data: projects, error } = await query;

    if (error) {
      throw new Error(`Failed to get project stats: ${error.message}`);
    }

    // Calculate statistics
    const total = projects?.length || 0;
    const byStatus =
      projects?.reduce((acc, project) => {
        const status = project.status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

    const averageProgress = projects?.length
      ? projects.reduce((sum, p) => sum + (p.progress || 0), 0) /
        projects.length
      : 0;

    return {
      total,
      byStatus,
      averageProgress: Math.round(averageProgress * 100) / 100,
    };
  } catch (error) {
    console.error("🚨 Error in getProjectStats:", error);
    throw error;
  }
}
