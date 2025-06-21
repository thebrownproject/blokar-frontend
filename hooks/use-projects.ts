"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "./use-user";
import type { Project } from "@/services/supabase";

// Create client outside the hook to ensure it's stable
const supabase = createClient();

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    const fetchProjects = async () => {
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
    };

    fetchProjects();
  }, [user?.id, userLoading]);

  const refetch = async () => {
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
  };

  return { projects, isLoading, error, refetch };
}
