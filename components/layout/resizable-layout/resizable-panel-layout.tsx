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
    <ResizablePanelGroup direction="horizontal" className="">
      <ResizablePanel>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">{children}</div>
        </div>
      </ResizablePanel>

      <ResizableHandle className="opacity-0 hover:opacity-0" />

      {isOpen && (
        <>
          <ResizablePanel
            className="h-full max-h-[calc(100vh-4rem)]"
            minSize={30}
            defaultSize={40}
            maxSize={60}
          >
            <div className="h-[calc(100vh-4rem)] overflow-y-auto">
              <ActionPanelContent />
            </div>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
