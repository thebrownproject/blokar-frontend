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
    <ResizablePanelGroup
      direction="horizontal"
      className="absolute top-16 left-0 right-0 bottom-0" // top-16 instead of top-0
    >
      <ResizablePanel defaultSize={isOpen ? 70 : 100}>
        <div className="h-full overflow-y-auto">{children}</div>
      </ResizablePanel>

      {isOpen && (
        <>
          <ResizableHandle className="bg-transparent w-0 hover:bg-border/50 transition-colors" />
          <ResizablePanel
            defaultSize={30}
            minSize={20}
            maxSize={50}
            className="bg-background border-l top-16"
          >
            <div className="h-full overflow-hidden relative">
              <div className="absolute inset-0">
                <ActionPanelContent />
              </div>
            </div>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
