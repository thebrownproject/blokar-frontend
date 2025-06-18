"use client";

import { ActionPanelCard } from "../action-panel-card";

interface EditContactPanelProps {
  data?: any;
}

export function EditContactPanel({ data }: EditContactPanelProps) {
  return (
    <ActionPanelCard title="Edit Contact">
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Edit contact form will go here...
        </p>
        {data && (
          <pre className="text-xs bg-muted p-2 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </ActionPanelCard>
  );
}
