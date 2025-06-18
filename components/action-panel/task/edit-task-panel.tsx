"use client";

import { ActionPanelCard } from "../action-panel-card";

interface EditTaskPanelProps {
  data?: any;
}

export function EditTaskPanel({ data }: EditTaskPanelProps) {
  return (
    <ActionPanelCard title="Edit Task">
      <div className="space-y-4">
        <p className="text-muted-foreground">Edit task form will go here...</p>
        {data && (
          <pre className="text-xs bg-muted p-2 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </ActionPanelCard>
  );
}
