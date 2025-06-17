"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { usePanel } from "@/hooks/use-panel";
import { ActionPanelContent } from "@/components/action-panel";

interface ResizablePanelLayoutProps {
  children: React.ReactNode;
}

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
            <ActionPanelContent />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
