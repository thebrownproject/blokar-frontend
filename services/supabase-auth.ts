"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

class SupabaseAuthService {
  private supabase = createClient();

  // Convert Supabase User to our AuthUser format
  private mapUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || user.email?.split("@")[0],
      avatar: user.user_metadata?.avatar_url || "/avatars/default.jpg",
    };
  }

  // Register a new user
  async register(
    credentials: RegisterCredentials
  ): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: "Registration failed" };
      }

      return { user: this.mapUser(data.user), error: null };
    } catch {
      return { user: null, error: "Registration failed" };
    }
  }

  // Login with email and password
  async login(
    credentials: LoginCredentials
  ): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: "Login failed" };
      }

      return { user: this.mapUser(data.user), error: null };
    } catch {
      return { user: null, error: "Login failed" };
    }
  }

  // Logout
  async logout(): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch {
      return { error: "Logout failed" };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser();
      return user ? this.mapUser(user) : null;
    } catch {
      return null;
    }
  }

  // Get current session
  async getSession() {
    try {
      const {
        data: { session },
      } = await this.supabase.auth.getSession();
      return session;
    } catch {
      return null;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ? this.mapUser(session.user) : null;
      callback(user);
    });
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return !!session;
  }

  // Reset password
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch {
      return { error: "Reset password failed" };
    }
  }

  // Update password
  async updatePassword(password: string): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch {
      return { error: "Update password failed" };
    }
  }
}

export const supabaseAuthService = new SupabaseAuthService();
