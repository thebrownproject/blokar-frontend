"use client";

import * as React from "react";

type PanelType = "ai-assistant" | "new-project" | "notifications" | null;

interface PanelContextType {
  isOpen: boolean;
  panelType: PanelType;
  openPanel: (type: PanelType) => void;
  closePanel: () => void;
  togglePanel: (type: PanelType) => void;
}

const PanelContext = React.createContext<PanelContextType | undefined>(
  undefined
);

export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [panelType, setPanelType] = React.useState<PanelType>(null);

  const openPanel = React.useCallback((type: PanelType) => {
    setPanelType(type);
    setIsOpen(true);
  }, []);

  const closePanel = React.useCallback(() => {
    setIsOpen(false);
    setPanelType(null);
  }, []);

  const togglePanel = React.useCallback(
    (type: PanelType) => {
      if (isOpen && panelType === type) {
        closePanel();
      } else {
        openPanel(type);
      }
    },
    [isOpen, panelType, openPanel, closePanel]
  );

  return (
    <PanelContext.Provider
      value={{
        isOpen,
        panelType,
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
