"use client";

import { ProjectsProvider } from "@/hooks/projects-context";
import { TasksProvider } from "@/hooks/tasks-context";
import { ContactsProvider } from "@/hooks/contacts-context";
import { WorkspaceProvider } from "@/hooks/use-workspace";
import { PanelProvider } from "@/hooks/use-panel";

interface ProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: ProvidersProps) {
  return (
    <ProjectsProvider>
      <TasksProvider>
        <ContactsProvider>
          <WorkspaceProvider>
            <PanelProvider>
              {children}
            </PanelProvider>
          </WorkspaceProvider>
        </ContactsProvider>
      </TasksProvider>
    </ProjectsProvider>
  );
}
