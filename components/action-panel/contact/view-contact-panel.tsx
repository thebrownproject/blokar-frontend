"use client";

// Re-export the hybrid edit component as the view component
// This ensures both "View Contact" and "Edit Contact" actions
// use the same comprehensive hybrid interface
export { EditContactPanel as ViewContactPanel } from "./edit-contact-panel";
