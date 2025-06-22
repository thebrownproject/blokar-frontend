"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "./use-user";
import type { Project } from "@/services/supabase";

// Create client outside to ensure it's stable
const supabase = createClient();

interface ProjectsContextType {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: userLoading } = useUser();

  // Fetch projects function
  const fetchProjects = useCallback(async () => {
    // Wait for user loading to complete
    if (userLoading) return;

    // Only fetch if user is authenticated
    if (!user) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;

      setProjects(data || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch projects"
      );
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, userLoading]);

  // Initial fetch effect
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Refetch function for manual updates
  const refetch = useCallback(async () => {
    if (!user) {
      setProjects([]);
      return;
    }

    try {
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;
      setProjects(data || []);
    } catch (error) {
      console.error("Failed to refetch projects:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch projects"
      );
    }
  }, [user]);

  // Optimistic update function for immediate UI feedback
  const updateProject = useCallback(
    (projectId: string, updates: Partial<Project>) => {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? { ...project, ...updates, updated_at: new Date().toISOString() }
            : project
        )
      );
    },
    []
  );

  const value: ProjectsContextType = {
    projects,
    isLoading,
    error,
    refetch,
    updateProject,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

// Custom hook to consume the context
export function useProjectsContext() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error(
      "useProjectsContext must be used within a ProjectsProvider"
    );
  }
  return context;
}
