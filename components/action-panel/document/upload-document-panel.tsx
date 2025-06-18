"use client";

import { ActionPanelCard } from "../action-panel-card";
import { Upload } from "lucide-react";

export function UploadDocumentPanel() {
  const headerActions = <Upload className="h-4 w-4" />;

  return (
    <ActionPanelCard title="Upload Document" headerActions={headerActions}>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Document upload form will go here...
        </p>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm">File upload interface coming soon!</p>
        </div>
      </div>
    </ActionPanelCard>
  );
}
