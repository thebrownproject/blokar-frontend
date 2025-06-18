"use client";

import { ActionPanelCard } from "../action-panel-card";
import { MessageSquare } from "lucide-react";

export function AiAssistantPanel() {
  const headerActions = <MessageSquare className="h-4 w-4" />;

  return (
    <ActionPanelCard title="Blokar Copilot" headerActions={headerActions}>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Blokar Copilot functionality will go here...
        </p>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm">Chat interface coming soon!</p>
        </div>
      </div>
    </ActionPanelCard>
  );
}
