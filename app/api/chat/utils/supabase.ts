// ============================================================================
// BLOKAR SUPABASE UTILITIES
// ============================================================================
// Database operations for project management
// ============================================================================

import { createClient } from "@/utils/supabase/server";

// ============================================================================
// PROJECT OPERATIONS
// ============================================================================

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
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);
  if (organizationId) query = query.eq("organization_id", organizationId);
  if (userId) query = query.eq("user_id", userId);

  const { data: projects, error, count } = await query;

  if (error) throw new Error(`Failed to fetch projects: ${error.message}`);

  return {
    projects: projects || [],
    total: count || 0,
    hasMore: (projects?.length || 0) === limit,
  };
}

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
  const supabase = await createClient();

  const isUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      identifier
    );

  let selectClause = "*";
  if (includeRelated) {
    selectClause += ", project_tasks(*), project_contacts(*)";
  }

  let query = supabase.from("projects").select(selectClause).limit(limit);

  if (isUUID) {
    query = query.eq("id", identifier);
  } else {
    query = query.ilike("name", `%${identifier}%`);
  }

  if (organizationId) query = query.eq("organization_id", organizationId);
  if (userId) query = query.eq("user_id", userId);

  const { data: projects, error } = await query;
  if (error) throw new Error(`Failed to search projects: ${error.message}`);

  return projects || [];
}

export async function createProject(projectData: {
  name: string;
  address: string;
  project_type: string;
  user_id: string;
  [key: string]: any;
}) {
  const supabase = await createClient();

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

  if (error) throw new Error(`Failed to create project: ${error.message}`);
  return project;
}

export async function updateProject(
  projectId: string,
  updates: Record<string, any>,
  userId: string
) {
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update project: ${error.message}`);
  if (!project) throw new Error("Project not found or access denied");

  return project;
}

export async function deleteProject(projectId: string, userId: string) {
  const supabase = await createClient();

  // Get project info before deletion
  const { data: project } = await supabase
    .from("projects")
    .select("name")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to delete project: ${error.message}`);
  return project || { name: "Unknown Project" };
}

export async function getProjectStats(
  options: {
    organizationId?: string;
    userId?: string;
    timeframe?: string;
  } = {}
) {
  const { organizationId, userId } = options;
  const supabase = await createClient();

  let query = supabase.from("projects").select("status, progress");

  if (organizationId) query = query.eq("organization_id", organizationId);
  if (userId) query = query.eq("user_id", userId);

  const { data: projects, error } = await query;
  if (error) throw new Error(`Failed to get project stats: ${error.message}`);

  const total = projects?.length || 0;
  const byStatus =
    projects?.reduce((acc: Record<string, number>, project) => {
      const status = project.status || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {}) || {};

  const averageProgress = projects?.length
    ? Math.round(
        (projects.reduce((sum, p) => sum + (p.progress || 0), 0) /
          projects.length) *
          100
      ) / 100
    : 0;

  return { total, byStatus, averageProgress };
}
