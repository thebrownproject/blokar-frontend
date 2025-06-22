"use client";

import { useProjectsContext } from "./projects-context";

// Re-export the context hook with the same API for backward compatibility
export function useProjects() {
  const {
    projects,
    isLoading,
    error,
    refetch,
    updateProject,
    addProject,
    deleteProject,
  } = useProjectsContext();

  return {
    projects,
    loading: isLoading,
    error,
    refetch,
    updateProject,
    addProject,
    deleteProject,
  };
}
