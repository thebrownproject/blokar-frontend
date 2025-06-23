"use client";

import { useTasksContext } from "./tasks-context";

// Re-export the context hook with the same API for backward compatibility
export function useTasks() {
  const { tasks, isLoading, error, refetch, updateTask, addTask, deleteTask } =
    useTasksContext();

  return {
    tasks,
    loading: isLoading,
    error,
    refetch,
    updateTask,
    addTask,
    deleteTask,
  };
}
