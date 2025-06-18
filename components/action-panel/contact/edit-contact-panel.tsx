"use client";

import { ActionPanelCard } from "../action-panel-card";
import { UserPen } from "lucide-react";

interface EditContactPanelProps {
  data?: any;
}

export function EditContactPanel({ data }: EditContactPanelProps) {
  const headerActions = <UserPen className="h-4 w-4" />;

  return (
    <ActionPanelCard title="Edit Contact" headerActions={headerActions}>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Edit contact form will go here...
        </p>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm">Form fields coming soon!</p>
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
