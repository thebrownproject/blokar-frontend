"use client";

import { ActionPanelCard } from "../action-panel-card";
import { ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewTaskPanel() {
  const headerActions = (
    <Button variant="ghost" size="icon" className="h-6 w-6">
      <ListTodo className="h-4 w-4" />
    </Button>
  );

  return (
    <ActionPanelCard title="New Task" headerActions={headerActions}>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Task creation form will go here...
        </p>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm">Form fields coming soon!</p>
        </div>
      </div>
    </ActionPanelCard>
  );
}
