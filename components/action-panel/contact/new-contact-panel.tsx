"use client";

import { ActionPanelCard } from "../action-panel-card";
import { UserPlus } from "lucide-react";

export function NewContactPanel() {
  const headerActions = <UserPlus className="h-4 w-4" />;

  return (
    <ActionPanelCard title="New Contact" headerActions={headerActions}>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Contact creation form will go here...
        </p>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm">Form fields coming soon!</p>
        </div>
      </div>
    </ActionPanelCard>
  );
}
