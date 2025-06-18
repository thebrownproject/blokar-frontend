"use client";

import { ActionPanelCard } from "../action-panel-card";

interface ViewTaskPanelProps {
  data?: any;
}

export function ViewTaskPanel({ data }: ViewTaskPanelProps) {
  return (
    <ActionPanelCard title="View Task">
      <div className="space-y-4">
        <p className="text-muted-foreground">Task details will go here...</p>
        {data && (
          <pre className="text-xs bg-muted p-2 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </ActionPanelCard>
  );
}
