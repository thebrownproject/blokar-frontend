"use client";

import { ActionPanelCard } from "../action-panel-card";
import { Building } from "lucide-react";

export function NewProjectPanel() {
  const headerActions = <Building className="h-4 w-4" />;

  return (
    <ActionPanelCard title="New Project" headerActions={headerActions}>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Project creation form will go here...
        </p>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm">Form fields coming soon!</p>
        </div>
      </div>
    </ActionPanelCard>
  );
}
