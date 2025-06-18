"use client";

import { ActionPanelCard } from "../action-panel-card";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AiAssistantPanel() {
  const headerActions = (
    <Button variant="ghost" size="icon" className="h-6 w-6">
      <MessageCircle className="h-4 w-4" />
    </Button>
  );

  return (
    <ActionPanelCard title="AI Assistant" headerActions={headerActions}>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          AI Assistant functionality will go here...
        </p>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm">Chat interface coming soon!</p>
        </div>
      </div>
    </ActionPanelCard>
  );
}
