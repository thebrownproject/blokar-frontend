"use client";

import { ActionPanelCard } from "../action-panel-card";
import { Edit } from "lucide-react";

interface EditDocumentPanelProps {
  data?: any;
}

export function EditDocumentPanel({ data }: EditDocumentPanelProps) {
  const headerActions = <Edit className="h-4 w-4" />;

  return (
    <ActionPanelCard title="Edit Document" headerActions={headerActions}>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Edit document form will go here...
        </p>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm">Document editing interface coming soon!</p>
          {data && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">Document data:</p>
              <pre className="text-xs mt-1 p-2 bg-background rounded border">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </ActionPanelCard>
  );
}
