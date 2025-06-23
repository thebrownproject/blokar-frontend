"use client";

// Re-export the hybrid edit component as the view component
// This ensures both "View Task" and "Edit Task" actions
// use the same comprehensive hybrid interface
export { EditTaskPanel as ViewTaskPanel } from "./edit-task-panel";
