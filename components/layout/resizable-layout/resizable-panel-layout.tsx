"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { usePanel } from "@/hooks/use-panel";

interface ResizablePanelLayoutProps {
  children: React.ReactNode;
}

// Panel content components
const AiAssistantPanel = () => (
  <div className="p-4 space-y-4">
    <h3 className="text-lg font-semibold">AI Assistant</h3>
    <p>AI Assistant functionality will go here...</p>
  </div>
);

const NewProjectPanel = () => (
  <div className="p-4 space-y-4">
    <h3 className="text-lg font-semibold">New Project</h3>
    <p>New project creation form will go here...</p>
  </div>
);

const RightPanelContent = () => {
  const { panelType } = usePanel();

  const getPanelContent = () => {
    switch (panelType) {
      case "ai-assistant":
        return <AiAssistantPanel />;
      case "new-project":
        return <NewProjectPanel />;
      default:
        return (
          <div className="p-4">
            <p className="text-muted-foreground">
              Select an action to get started
            </p>
          </div>
        );
    }
  };

  return <div className="h-full bg-background">{getPanelContent()}</div>;
};

export function ResizablePanelLayout({ children }: ResizablePanelLayoutProps) {
  const { isOpen } = usePanel();

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1">
      <ResizablePanel defaultSize={isOpen ? 70 : 100}>
        {children}
      </ResizablePanel>

      {isOpen && (
        <>
          <ResizableHandle className="bg-transparent w-0 hover:bg-border/50 transition-colors" />
          <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
            <RightPanelContent />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
