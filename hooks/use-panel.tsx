"use client";

import * as React from "react";

// Expanded panel types for all your CRUD operations
type PanelType =
  | "ai-assistant"
  | "new-project"
  | "edit-project"
  | "project-details"
  | "view-project"
  | "new-task"
  | "edit-task"
  | "view-task"
  | "upload-document"
  | "edit-document"
  | "view-document"
  | "new-contact"
  | "edit-contact"
  | "view-contact"
  | null;

interface PanelContextType {
  isOpen: boolean;
  panelType: PanelType;
  panelData?: Record<string, unknown>;
  openPanel: (type: PanelType, data?: Record<string, unknown>) => void;
  closePanel: () => void;
  togglePanel: (type: PanelType, data?: Record<string, unknown>) => void;
  openAIAssistant: () => void; // Quick access to AI assistant
}

const PanelContext = React.createContext<PanelContextType | undefined>(
  undefined
);

export function PanelProvider({ children }: { children: React.ReactNode }) {
  // Start closed to avoid hydration flash, but make AI assistant easily accessible
  const [isOpen, setIsOpen] = React.useState(false);
  const [panelType, setPanelType] = React.useState<PanelType>(null);
  const [panelData, setPanelData] = React.useState<
    Record<string, unknown> | undefined
  >(undefined);

  const openPanel = React.useCallback(
    (type: PanelType, data?: Record<string, unknown>) => {
      setPanelType(type);
      setPanelData(data);
      setIsOpen(true);
    },
    []
  );

  const closePanel = React.useCallback(() => {
    setIsOpen(false);
    setPanelType(null);
    setPanelData(undefined);
  }, []);

  const openAIAssistant = React.useCallback(() => {
    setPanelType("ai-assistant");
    setPanelData(undefined);
    setIsOpen(true);
  }, []);

  const togglePanel = React.useCallback(
    (type: PanelType, data?: Record<string, unknown>) => {
      if (isOpen && panelType === type) {
        closePanel();
      } else {
        openPanel(type, data);
      }
    },
    [isOpen, panelType, openPanel, closePanel]
  );

  // Auto-open AI assistant after component mounts to avoid hydration issues
  React.useEffect(() => {
    // Small delay to ensure smooth mounting
    const timer = setTimeout(() => {
      openAIAssistant();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [openAIAssistant]);

  return (
    <PanelContext.Provider
      value={{
        isOpen,
        panelType,
        panelData,
        openPanel,
        closePanel,
        togglePanel,
        openAIAssistant,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}

export function usePanel() {
  const context = React.useContext(PanelContext);
  if (context === undefined) {
    throw new Error("usePanel must be used within a PanelProvider");
  }
  return context;
}
