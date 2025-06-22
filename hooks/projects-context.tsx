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
  addProject: (
    projectData: Omit<Project, "id" | "user_id" | "created_at" | "updated_at">
  ) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
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

  // Optimistic add project function for new project creation
  const addProject = useCallback(
    async (
      projectData: Omit<Project, "id" | "user_id" | "created_at" | "updated_at">
    ): Promise<Project> => {
      if (!user) {
        throw new Error("User must be authenticated to create projects");
      }

      // Generate temporary ID for optimistic update
      const tempId = crypto.randomUUID();
      const now = new Date().toISOString();

      // Create optimistic project with temporary ID
      const optimisticProject: Project = {
        id: tempId,
        created_at: now,
        updated_at: now,
        user_id: user.id,
        ...projectData,
      };

      // Optimistically add to UI immediately
      setProjects((prevProjects) => [optimisticProject, ...prevProjects]);

      try {
        // Save to database
        const { data, error: supabaseError } = await supabase
          .from("projects")
          .insert({
            user_id: user.id,
            ...projectData,
          })
          .select()
          .single();

        if (supabaseError) throw supabaseError;

        // Replace optimistic project with real data from database
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === tempId ? data : project
          )
        );

        return data;
      } catch (error) {
        // Remove optimistic project on error
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== tempId)
        );
        throw error;
      }
    },
    [user]
  );

  // Optimistic delete project function for project deletion
  const deleteProject = useCallback(
    async (projectId: string): Promise<void> => {
      if (!user) {
        throw new Error("User must be authenticated to delete projects");
      }

      // Store the project for potential restoration on error
      const projectToDelete = projects.find((p) => p.id === projectId);
      if (!projectToDelete) {
        throw new Error("Project not found");
      }

      // Optimistically remove from UI immediately
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId)
      );

      try {
        // Delete from database
        const { error: supabaseError } = await supabase
          .from("projects")
          .delete()
          .eq("id", projectId);

        if (supabaseError) throw supabaseError;

        // Successfully deleted - no need to update UI as it's already removed
      } catch (error) {
        // Restore project on error by re-adding it to the list
        setProjects((prevProjects) => {
          // Insert the project back in its original position (sorted by created_at)
          const newProjects = [...prevProjects, projectToDelete];
          return newProjects.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
        });
        throw error;
      }
    },
    [user, projects]
  );

  const value: ProjectsContextType = {
    projects,
    isLoading,
    error,
    refetch,
    updateProject,
    addProject,
    deleteProject,
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
