"use client";

import * as React from "react";

// Expanded panel types for all your CRUD operations
type PanelType =
  | "ai-assistant"
  | "new-project"
  | "edit-project"
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
  panelData?: any; // For passing data to panels (e.g., item to edit)
  openPanel: (type: PanelType, data?: any) => void;
  closePanel: () => void;
  togglePanel: (type: PanelType, data?: any) => void;
}

const PanelContext = React.createContext<PanelContextType | undefined>(
  undefined
);

export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [panelType, setPanelType] = React.useState<PanelType>(null);
  const [panelData, setPanelData] = React.useState<any>(undefined);

  const openPanel = React.useCallback((type: PanelType, data?: any) => {
    setPanelType(type);
    setPanelData(data);
    setIsOpen(true);
  }, []);

  const closePanel = React.useCallback(() => {
    setIsOpen(false);
    setPanelType(null);
    setPanelData(undefined);
  }, []);

  const togglePanel = React.useCallback(
    (type: PanelType, data?: any) => {
      if (isOpen && panelType === type) {
        closePanel();
      } else {
        openPanel(type, data);
      }
    },
    [isOpen, panelType, openPanel, closePanel]
  );

  return (
    <PanelContext.Provider
      value={{
        isOpen,
        panelType,
        panelData,
        openPanel,
        closePanel,
        togglePanel,
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
