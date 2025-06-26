"use client";

import * as React from "react";
import type { Project } from "@/services/supabase";

interface WorkspaceCard {
  id: string;
  type: "project";
  data: Project;
  timestamp: number;
  highlighted?: boolean;
}

interface WorkspaceState {
  cards: WorkspaceCard[];
  layout: "grid" | "list" | "timeline" | "kanban";
  density: "compact" | "comfortable" | "spacious";
}

interface WorkspaceActions {
  showProjectCard: (project: Project) => void;
  showMultipleProjectCards: (projects: Project[], clearFirst?: boolean) => void;
  clearAllCards: () => void;
  removeCard: (cardId: string) => void;
  highlightCard: (cardId: string) => void;
  setLayout: (layout: WorkspaceState["layout"]) => void;
  setDensity: (density: WorkspaceState["density"]) => void;
}

type WorkspaceContextType = WorkspaceState & WorkspaceActions;

const WorkspaceContext = React.createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = React.useState<WorkspaceCard[]>([]);
  const [layout, setLayout] = React.useState<WorkspaceState["layout"]>("grid");
  const [density, setDensity] = React.useState<WorkspaceState["density"]>("comfortable");

  const showProjectCard = React.useCallback((project: Project) => {
    setCards((prev) => {
      const existingIndex = prev.findIndex(
        (card) => card.type === "project" && card.data.id === project.id
      );
      
      const newCard: WorkspaceCard = {
        id: `project-${project.id}-${Date.now()}`,
        type: "project",
        data: project,
        timestamp: Date.now(),
      };

      if (existingIndex >= 0) {
        // Update existing card
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], timestamp: Date.now() };
        return updated;
      }
      
      return [...prev, newCard];
    });
  }, []);

  const showMultipleProjectCards = React.useCallback((projects: Project[], clearFirst = true) => {
    const newCards: WorkspaceCard[] = projects.map((project) => ({
      id: `project-${project.id}-${Date.now()}`,
      type: "project",
      data: project,
      timestamp: Date.now(),
    }));

    setCards((prev) => clearFirst ? newCards : [...prev, ...newCards]);
  }, []);

  const clearAllCards = React.useCallback(() => setCards([]), []);
  
  const removeCard = React.useCallback((cardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId));
  }, []);

  const highlightCard = React.useCallback((cardId: string) => {
    setCards((prev) => prev.map((card) => ({ 
      ...card, 
      highlighted: card.id === cardId 
    })));
    
    // Auto-remove highlight after 3 seconds
    setTimeout(() => {
      setCards((prev) => prev.map((card) => ({ ...card, highlighted: false })));
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
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
