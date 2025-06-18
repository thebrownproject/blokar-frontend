"use client";

import { useState, useEffect } from "react";
import { authService } from "@/services/auth";
import { UserProfile } from "@/services/api";

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        const userProfile = authService.getUserProfile();
        setUser(userProfile);
      } catch (error) {
        console.error("Failed to load user profile:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user_profile") {
        loadUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { user, isLoading };
}
