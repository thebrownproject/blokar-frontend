"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePanel } from "@/hooks/use-panel";
import {
  Folder,
  MoreHorizontal,
  Loader2,
  ChevronUp,
  Building,
  Edit,
  ListTodo,
  Users,
  FileText,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const MAX_VISIBLE_PROJECTS = 3;

export function NavProjects({
  projects,
  isLoading,
  error,
}: {
  projects: Array<{ id: string; name: string; [key: string]: unknown }>;
  isLoading: boolean;
  error: string | null;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { openPanel } = usePanel();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleViewProject = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const handleProjectDetails = (projectId: string) => {
    openPanel("project-details", { projectId });
  };

  const handlePlaceholder = (feature: string) => {
    console.log(`${feature} feature coming soon`);
    // TODO: Show toast notification when toast component is available
  };

  // Transform projects into the expected format
  const projectItems = projects.map((project, index) => ({
    name: project.name,
    url: `/projects/${project.id}`,
    icon: Building,
    id: project.id || `project-${index}`, // Fallback if id is missing
  }));

  // Determine which projects to show
  const visibleProjects = isExpanded
    ? projectItems
    : projectItems.slice(0, MAX_VISIBLE_PROJECTS);

  const hasMoreProjects = projectItems.length > MAX_VISIBLE_PROJECTS;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading ? (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading projects...</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : error ? (
          <SidebarMenuItem>
            <SidebarMenuButton disabled className="text-muted-foreground">
              <span>Failed to load projects</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : projectItems.length === 0 ? (
          <SidebarMenuItem>
            <SidebarMenuButton disabled className="text-muted-foreground">
              <span>No projects found</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          <>
            {visibleProjects.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => router.push(item.url)}
                  className="cursor-pointer"
                >
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem
                      key="view"
                      onClick={() => handleViewProject(item.id)}
                    >
                      <Folder className="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      key="details"
                      onClick={() => handleProjectDetails(item.id)}
                    >
                      <Edit className="text-muted-foreground" />
                      <span>Project Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      key="tasks"
                      onClick={() => handlePlaceholder("Project Tasks")}
                    >
                      <ListTodo className="text-muted-foreground" />
                      <span>Project Tasks</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      key="team"
                      onClick={() => handlePlaceholder("Project Team")}
                    >
                      <Users className="text-muted-foreground" />
                      <span>Project Team</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      key="documents"
                      onClick={() => handlePlaceholder("Project Documents")}
                    >
                      <FileText className="text-muted-foreground" />
                      <span>Project Documents</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}

            {hasMoreProjects && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="text-sidebar-foreground/70 cursor-pointer"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronUp className="text-sidebar-foreground/70" />
                  ) : (
                    <MoreHorizontal className="text-sidebar-foreground/70" />
                  )}
                  <span>
                    {isExpanded
                      ? "Show Less"
                      : `More (${projectItems.length - MAX_VISIBLE_PROJECTS})`}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
