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
import type { Task } from "@/services/supabase";

// Create client outside to ensure it's stable
const supabase = createClient();

// Extended Task interface with project name for display
export interface TaskWithProject extends Task {
  project_name?: string;
}

// Type for task data from Supabase with joined project
interface TaskFromDB extends Task {
  projects?: { name: string } | null;
}

interface TasksContextType {
  tasks: TaskWithProject[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addTask: (
    taskData: Omit<Task, "id" | "created_at" | "updated_at">
  ) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<TaskWithProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: userLoading } = useUser();

  // Fetch tasks function with project names
  const fetchTasks = useCallback(async () => {
    // Wait for user loading to complete
    if (userLoading) return;

    // Only fetch if user is authenticated
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("project_tasks")
        .select(
          `
          *,
          projects!project_tasks_project_id_fkey(name)
        `
        )
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;

      // Transform data to include project name
      const tasksWithProjects = (data || []).map((task: any) => ({
        ...task,
        project_name: task.projects?.name || "No Project",
      }));

      setTasks(tasksWithProjects);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch tasks"
      );
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, userLoading]);

  // Initial fetch effect
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Refetch function for manual updates
  const refetch = useCallback(async () => {
    if (!user) {
      setTasks([]);
      return;
    }

    try {
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from("project_tasks")
        .select(
          `
          *,
          projects!project_tasks_project_id_fkey(name)
        `
        )
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;

      // Transform data to include project name
      const tasksWithProjects = (data || []).map((task: any) => ({
        ...task,
        project_name: task.projects?.name || "No Project",
      }));

      setTasks(tasksWithProjects);
    } catch (error) {
      console.error("Failed to refetch tasks:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch tasks"
      );
    }
  }, [user]);

  // Optimistic update function for immediate UI feedback
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, ...updates, updated_at: new Date().toISOString() }
          : task
      )
    );
  }, []);

  // Optimistic add task function for new task creation
  const addTask = useCallback(
    async (
      taskData: Omit<Task, "id" | "created_at" | "updated_at">
    ): Promise<Task> => {
      if (!user) {
        throw new Error("User must be authenticated to create tasks");
      }

      // Generate temporary ID for optimistic update
      const tempId = crypto.randomUUID();
      const now = new Date().toISOString();

      // Create optimistic task with temporary ID
      const optimisticTask: TaskWithProject = {
        id: tempId,
        created_at: now,
        updated_at: now,
        project_name: "Loading...",
        ...taskData,
      };

      // Optimistically add to UI immediately
      setTasks((prevTasks) => [optimisticTask, ...prevTasks]);

      try {
        // Save to database
        const { data, error: supabaseError } = await supabase
          .from("project_tasks")
          .insert(taskData)
          .select(
            `
            *,
            projects!project_tasks_project_id_fkey(name)
          `
          )
          .single();

        if (supabaseError) throw supabaseError;

        // Transform and replace optimistic task with real data from database
        const taskWithProject = {
          ...data,
          project_name: data.projects?.name || "No Project",
        };

        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === tempId ? taskWithProject : task))
        );

        return data;
      } catch (error) {
        // Remove optimistic task on error
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== tempId));
        throw error;
      }
    },
    [user]
  );

  // Optimistic delete task function for task deletion
  const deleteTask = useCallback(
    async (taskId: string): Promise<void> => {
      if (!user) {
        throw new Error("User must be authenticated to delete tasks");
      }

      // Store the task for potential restoration on error
      const taskToDelete = tasks.find((t) => t.id === taskId);
      if (!taskToDelete) {
        throw new Error("Task not found");
      }

      // Optimistically remove from UI immediately
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      try {
        // Delete from database
        const { error: supabaseError } = await supabase
          .from("project_tasks")
          .delete()
          .eq("id", taskId);

        if (supabaseError) throw supabaseError;

        // Successfully deleted - no need to update UI as it's already removed
      } catch (error) {
        // Restore task on error by re-adding it to the list
        setTasks((prevTasks) => {
          // Insert the task back in its original position (sorted by created_at)
          const newTasks = [...prevTasks, taskToDelete];
          return newTasks.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
        });
        throw error;
      }
    },
    [user, tasks]
  );

  const value: TasksContextType = {
    tasks,
    isLoading,
    error,
    refetch,
    updateTask,
    addTask,
    deleteTask,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

// Custom hook to consume the context
export function useTasksContext() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasksContext must be used within a TasksProvider");
  }
  return context;
}
