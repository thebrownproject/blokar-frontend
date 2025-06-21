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
    let isMounted = true;

    const fetchProjects = async () => {
      // Wait for user loading to complete
      if (userLoading) {
        return;
      }

      // Only fetch if user is authenticated
      if (!user) {
        if (isMounted) {
          setProjects([]);
          setIsLoading(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
        }

        const { data, error: supabaseError } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (supabaseError) throw supabaseError;

        if (isMounted) {
          setProjects(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        if (isMounted) {
          setError(
            error instanceof Error ? error.message : "Failed to fetch projects"
          );
          setProjects([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProjects();

    // Set up real-time subscription only if user is authenticated
    let channel: any = null;

    if (user && !userLoading) {
      channel = supabase
        .channel("projects-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "projects",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (!isMounted) return;

            const { eventType, new: newRecord, old: oldRecord } = payload;

            setProjects((prev) => {
              switch (eventType) {
                case "INSERT":
                  return [newRecord as Project, ...prev];
                case "UPDATE":
                  return prev.map((p) =>
                    p.id === newRecord.id ? (newRecord as Project) : p
                  );
                case "DELETE":
                  return prev.filter((p) => p.id !== oldRecord.id);
                default:
                  return prev;
              }
            });
          }
        )
        .subscribe();
    }

    return () => {
      isMounted = false;
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [user?.id, userLoading]); // Only depend on user.id and userLoading

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
