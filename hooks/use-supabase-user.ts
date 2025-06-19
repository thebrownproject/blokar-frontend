"use client";

import { useState, useEffect } from "react";
import { supabaseAuthService, AuthUser } from "@/services/supabase-auth";

export function useSupabaseUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Get initial user
    const getInitialUser = async () => {
      try {
        setIsLoading(true);
        const currentUser = await supabaseAuthService.getCurrentUser();
        const authenticated = await supabaseAuthService.isAuthenticated();

        setUser(currentUser);
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error("Error getting initial user:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialUser();

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabaseAuthService.onAuthStateChange((user) => {
      setUser(user);
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    // Auth methods
    login: supabaseAuthService.login.bind(supabaseAuthService),
    register: supabaseAuthService.register.bind(supabaseAuthService),
    logout: supabaseAuthService.logout.bind(supabaseAuthService),
    resetPassword: supabaseAuthService.resetPassword.bind(supabaseAuthService),
    updatePassword:
      supabaseAuthService.updatePassword.bind(supabaseAuthService),
  };
}
