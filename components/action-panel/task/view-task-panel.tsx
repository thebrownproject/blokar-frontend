"use client";

import { ActionPanelCard } from "../action-panel-card";
import { Eye } from "lucide-react";

interface ViewTaskPanelProps {
  data?: any;
}

export function ViewTaskPanel({ data }: ViewTaskPanelProps) {
  const headerActions = <Eye className="h-4 w-4" />;

  return (
    <ActionPanelCard title="View Task" headerActions={headerActions}>
      <div className="space-y-4">
        <p className="text-muted-foreground">Task details will go here...</p>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm">Task information coming soon!</p>
        </div>
        {data && (
          <pre className="text-xs bg-muted p-2 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </ActionPanelCard>
  );
}
