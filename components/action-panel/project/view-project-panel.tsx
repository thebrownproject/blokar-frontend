"use client";

// Re-export the hybrid edit component as the view component
// This ensures both "View Project" and "Edit Project" actions
// use the same comprehensive hybrid interface
export { EditProjectPanel as ViewProjectPanel } from "./edit-project-panel";
