"use client";

import { ActionPanelCard } from "../action-panel-card";

interface EditProjectPanelProps {
  data?: any;
}

export function EditProjectPanel({ data }: EditProjectPanelProps) {
  return (
    <ActionPanelCard title="Edit Project">
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Edit project form will go here...
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
