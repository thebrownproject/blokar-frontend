import { SidebarApp } from "@/components/layout/sidebar";
import { TopBarApp } from "@/components/layout/topbar";
import { ResizablePanelLayout } from "@/components/layout/resizable-layout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PanelProvider } from "@/hooks/use-panel";
import { ProjectsProvider } from "@/hooks/projects-context";
import { TasksProvider } from "@/hooks/tasks-context";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProjectsProvider>
      <TasksProvider>
        <PanelProvider>
          <SidebarProvider>
            <SidebarApp />
            <SidebarInset>
              <TopBarApp />
              <ResizablePanelLayout>{children}</ResizablePanelLayout>
            </SidebarInset>
          </SidebarProvider>
        </PanelProvider>
      </TasksProvider>
    </ProjectsProvider>
  );
}
