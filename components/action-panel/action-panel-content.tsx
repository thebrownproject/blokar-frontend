"use client";

import { usePanel } from "@/hooks/use-panel";
import { AiAssistantPanel } from "./ai-assistant";
import { NewProjectPanel, EditProjectPanel, ViewProjectPanel } from "./project";
import { NewTaskPanel, EditTaskPanel, ViewTaskPanel } from "./task";
import {
  UploadDocumentPanel,
  EditDocumentPanel,
  ViewDocumentPanel,
} from "./document";
import { NewContactPanel, EditContactPanel, ViewContactPanel } from "./contact";

export function ActionPanelContent() {
  const { panelType, panelData } = usePanel();

  const getPanelContent = () => {
    switch (panelType) {
      case "ai-assistant":
        return <AiAssistantPanel />;

      case "new-project":
        return <NewProjectPanel />;
      case "edit-project":
        return <EditProjectPanel data={panelData} />;
      case "view-project":
        return <ViewProjectPanel data={panelData} />;

      case "new-task":
        return <NewTaskPanel />;
      case "edit-task":
        return <EditTaskPanel data={panelData} />;
      case "view-task":
        return <ViewTaskPanel data={panelData} />;

      case "upload-document":
        return <UploadDocumentPanel />;
      case "edit-document":
        return <EditDocumentPanel data={panelData} />;
      case "view-document":
        return <ViewDocumentPanel data={panelData} />;

      case "new-contact":
        return <NewContactPanel />;
      case "edit-contact":
        return <EditContactPanel data={panelData} />;
      case "view-contact":
        return <ViewContactPanel data={panelData} />;

      default:
        return (
          <div className="p-4">
            <p className="text-muted-foreground">
              Select an action to get started
            </p>
          </div>
        );
    }
  };

  return <div className="h-full bg-background">{getPanelContent()}</div>;
}
