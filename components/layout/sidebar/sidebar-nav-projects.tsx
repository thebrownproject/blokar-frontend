"use client";

import { useState } from "react";
import { usePanel } from "@/hooks/use-panel";
import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  Loader2,
  ChevronUp,
  Building,
  Edit,
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
  projects: any[];
  isLoading: boolean;
  error: string | null;
}) {
  const { isMobile } = useSidebar();
  const { openPanel } = usePanel();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEditProject = (projectId: string) => {
    openPanel("edit-project", { projectId });
  };

  const handleViewProject = (projectId: string) => {
    openPanel("view-project", { projectId });
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
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
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
                      key="edit"
                      onClick={() => handleEditProject(item.id)}
                    >
                      <Edit className="text-muted-foreground" />
                      <span>Edit Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem key="share">
                      <Forward className="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem key="delete">
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}

            {hasMoreProjects && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="text-sidebar-foreground/70"
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
