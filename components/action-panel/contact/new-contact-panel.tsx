"use client";

import { ActionPanelCard } from "../action-panel-card";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewContactPanel() {
  const headerActions = (
    <Button variant="ghost" size="icon" className="h-6 w-6">
      <UserPlus className="h-4 w-4" />
    </Button>
  );

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
