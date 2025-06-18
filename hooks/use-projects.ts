"use client";

import { useState, useEffect } from "react";
import { apiClient, Project } from "@/services/api";
import { authService } from "@/services/auth";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      // Only fetch if user is authenticated
      if (!authService.isAuthenticated()) {
        setProjects([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const projectData = await apiClient.getProjects();
        setProjects(projectData);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch projects"
        );
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const refetch = () => {
    const fetchProjects = async () => {
      if (!authService.isAuthenticated()) {
        setProjects([]);
        return;
      }

      try {
        setError(null);
        const projectData = await apiClient.getProjects();
        setProjects(projectData);
      } catch (error) {
        console.error("Failed to refetch projects:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch projects"
        );
      }
    };

    fetchProjects();
  };

  return { projects, isLoading, error, refetch };
}
