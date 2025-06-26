"use client";

import * as React from "react";
import type { Project } from "@/services/supabase";

// Types for workspace items
interface WorkspaceCard {
  id: string;
  type: "project";
  data: Project;
  timestamp: number;
  highlighted?: boolean;
}

interface WorkspaceContextType {
  cards: WorkspaceCard[];
  layout: "grid" | "list" | "timeline" | "kanban";
  density: "compact" | "comfortable" | "spacious";
  
  // Card management
  showProjectCard: (project: Project) => void;
  showMultipleProjectCards: (projects: Project[], clearFirst?: boolean) => void;
  clearAllCards: () => void;
  removeCard: (cardId: string) => void;
  highlightCard: (cardId: string) => void;
  
  // Layout management
  setLayout: (layout: "grid" | "list" | "timeline" | "kanban") => void;
  setDensity: (density: "compact" | "comfortable" | "spacious") => void;
}

const WorkspaceContext = React.createContext<WorkspaceContextType | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = React.useState<WorkspaceCard[]>([]);
  const [layout, setLayout] = React.useState<"grid" | "list" | "timeline" | "kanban">("grid");
  const [density, setDensity] = React.useState<"compact" | "comfortable" | "spacious">("comfortable");

  const showProjectCard = React.useCallback((project: Project) => {
    const newCard: WorkspaceCard = {
      id: `project-${project.id}-${Date.now()}`,
      type: "project",
      data: project,
      timestamp: Date.now(),
    };

    setCards((prev) => {
      // Check if this project is already displayed
      const existingIndex = prev.findIndex(
        (card) => card.type === "project" && card.data.id === project.id
      );
      
      if (existingIndex >= 0) {
        // Update existing card
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], timestamp: Date.now() };
        return updated;
      } else {
        // Add new card
        return [...prev, newCard];
      }
    });
  }, []);

  const showMultipleProjectCards = React.useCallback(
    (projects: Project[], clearFirst = true) => {
      const newCards: WorkspaceCard[] = projects.map((project) => ({
        id: `project-${project.id}-${Date.now()}`,
        type: "project",
        data: project,
        timestamp: Date.now(),
      }));

      setCards((prev) => {
        if (clearFirst) {
          return newCards;
        } else {
          // Merge with existing, avoiding duplicates
          const existing = prev.filter(
            (existingCard) =>
              !projects.some(
                (project) =>
                  existingCard.type === "project" &&
                  existingCard.data.id === project.id
              )
          );
          return [...existing, ...newCards];
        }
      });
    },
    []
  );

  const clearAllCards = React.useCallback(() => {
    setCards([]);
  }, []);

  const removeCard = React.useCallback((cardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId));
  }, []);

  const highlightCard = React.useCallback((cardId: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? { ...card, highlighted: true }
          : { ...card, highlighted: false }
      )
    );
    
    // Remove highlight after 3 seconds
    setTimeout(() => {
      setCards((prev) =>
        prev.map((card) => ({ ...card, highlighted: false }))
      );
    }, 3000);
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        cards,
        layout,
        density,
        showProjectCard,
        showMultipleProjectCards,
        clearAllCards,
        removeCard,
        highlightCard,
        setLayout,
        setDensity,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = React.useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
