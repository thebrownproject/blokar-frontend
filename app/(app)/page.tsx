"use client";

import { Button } from "@/components/ui/button";
import { usePanel } from "@/hooks/use-panel";
import { MessageCircle, Plus } from "lucide-react";

export default function Page() {
  const { openPanel } = usePanel();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Test buttons to activate panels */}
      <div className="flex gap-2 mb-4">
        <Button
          onClick={() => openPanel("ai-assistant")}
          variant="outline"
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Open AI Assistant
        </Button>
        <Button
          onClick={() => openPanel("new-project")}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Your existing dashboard content */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </div>
  );
}
