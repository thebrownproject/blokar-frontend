"use client";

import { ActionPanelCard } from "../action-panel-card";
import { UserCheck } from "lucide-react";

interface ViewContactPanelProps {
  data?: any;
}

export function ViewContactPanel({ data }: ViewContactPanelProps) {
  const headerActions = <UserCheck className="h-4 w-4" />;

  return (
    <ActionPanelCard title="View Contact" headerActions={headerActions}>
      <div className="space-y-4">
        <p className="text-muted-foreground">Contact details will go here...</p>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm">Contact information coming soon!</p>
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
