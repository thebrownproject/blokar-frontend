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
        <div className="pb-16">
          <div className="h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="max-w-6xl mx-auto">{children}</div>
          </div>
        </div>
      </ResizablePanel>

      {isOpen && (
        <>
          <div className="w-[500px]">
            <ResizablePanel className="h-full max-h-[calc(100vh-4rem)]">
              <div className="h-full">
                <ActionPanelContent />
              </div>
            </ResizablePanel>
          </div>
        </>
      )}
    </ResizablePanelGroup>
  );
}
