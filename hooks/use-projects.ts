"use client";

import { useState, useEffect } from "react";
import { apiClient, Project } from "@/services/api";
import { useUser } from "./use-user";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    const fetchProjects = async () => {
      // Wait for user loading to complete
      if (userLoading) {
        return;
      }

      // Only fetch if user is authenticated
      if (!user) {
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
  }, [user, userLoading]);

  const refetch = () => {
    const fetchProjects = async () => {
      if (!user) {
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
