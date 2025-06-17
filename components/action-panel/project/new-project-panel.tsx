"use client";

import { ActionPanelCard } from "../action-panel-card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewProjectPanel() {
  const headerActions = (
    <Button variant="ghost" size="icon" className="h-6 w-6">
      <Plus className="h-4 w-4" />
    </Button>
  );

  return (
    <ActionPanelCard
      title="New Project"
      headerActions={headerActions}
      className="border-green-500/20"
    >
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
