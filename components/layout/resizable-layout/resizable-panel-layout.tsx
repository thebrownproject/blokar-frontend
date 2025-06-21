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
      className="absolute top-16 bottom-0"
    >
      <ResizablePanel>
        <div className="pb-16">
          <div className="h-[calc(100vh-4rem)] overflow-y-auto">{children}</div>
        </div>
      </ResizablePanel>

      {isOpen && (
        <>
          <ResizableHandle className="w-0 hover:bg-border/50 transition-colors" />
          <ResizablePanel
            defaultSize={30}
            minSize={30}
            maxSize={30}
            className="h-full max-h-[calc(100vh-4rem)]"
          >
            <div className="h-full">
              <ActionPanelContent />
            </div>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
