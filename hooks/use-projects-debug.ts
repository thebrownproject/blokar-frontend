// TEMPORARY: Simplified useProjects for debugging
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "./use-user";
import type { Project } from "@/services/supabase";

const supabase = createClient();

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    // SIMPLIFIED: No real-time, no complex logic
    const fetchProjects = async () => {
      if (userLoading) return;
      
      if (!user) {
        setProjects([]);
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching projects for user:', user.id);
        setIsLoading(true);
        setError(null);

        // SIMPLIFIED QUERY - no RLS complications
        const { data, error: supabaseError } = await supabase
          .from("projects")
          .select("*")
          .limit(5); // Limit to reduce RLS issues

        console.log('📊 Projects data:', data);
        console.log('❌ Projects error:', supabaseError);

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
          throw supabaseError;
        }

        setProjects(data || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch projects");
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user?.id, userLoading]);

  // NO REAL-TIME SUBSCRIPTION FOR NOW
  // NO REFETCH FUNCTION FOR NOW

  return { projects, isLoading, error, refetch: () => {} };
}
