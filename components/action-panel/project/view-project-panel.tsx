"use client";

import { ActionPanelCard } from "../action-panel-card";

interface ViewProjectPanelProps {
  data?: any;
}

export function ViewProjectPanel({ data }: ViewProjectPanelProps) {
  return (
    <ActionPanelCard title="View Project">
      <div className="space-y-4">
        <p className="text-muted-foreground">Project details will go here...</p>
        {data && (
          <pre className="text-xs bg-muted p-2 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </ActionPanelCard>
  );
}
