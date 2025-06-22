"use client";

import * as React from "react";
import {
  Building,
  Building2,
  FileText,
  GalleryVerticalEnd,
  Home,
  Map,
  Plus,
  Upload,
  Users,
  MessageSquare,
  ListTodo,
} from "lucide-react";

import { NavPlatform } from "@/components/layout/sidebar/sidebar-nav-platform";
import { NavProjects } from "@/components/layout/sidebar/sidebar-nav-projects";
import { NavQuickActions } from "@/components/layout/sidebar/sidebar-nav-quick-actions";
import { NavUser } from "@/components/layout/sidebar/sidebar-nav-user";
import { TeamSwitcher } from "@/components/layout/sidebar/sidebar-team-switcher";
import { useUser } from "@/hooks/use-user";
import { useProjects } from "@/hooks/use-projects";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Static data that doesn't depend on user
const data = {
  teams: [
    {
      name: "BuildSpec Pro",
      logo: GalleryVerticalEnd,
      plan: "Professional",
    },
  ],
  navPlatform: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Project Status",
          url: "/dashboard/project-status",
        },
        {
          title: "Compliance",
          url: "/dashboard/compliance",
        },
      ],
    },
    {
      title: "Projects",
      url: "/projects",
      icon: Building,
      items: [
        {
          title: "Active Projects",
          url: "/projects/active",
        },
        {
          title: "Planning",
          url: "/projects/planning",
        },
        {
          title: "Completed",
          url: "/projects/completed",
        },
      ],
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: ListTodo,
      items: [
        {
          title: "All Tasks",
          url: "/tasks/all",
        },
        {
          title: "Due Today",
          url: "/tasks/due-today",
        },
        {
          title: "Overdue",
          url: "/tasks/overdue",
        },
        {
          title: "Completed",
          url: "/tasks/completed",
        },
      ],
    },
    {
      title: "Team",
      url: "/team",
      icon: Users,
      items: [
        {
          title: "All",
          url: "/team/all",
        },
        {
          title: "Consultants",
          url: "/team/consultants",
        },
        {
          title: "Authorities",
          url: "/team/authorities",
        },
        {
          title: "Contractors",
          url: "/team/contractors",
        },
        {
          title: "Clients",
          url: "/team/clients",
        },
        {
          title: "Suppliers",
          url: "/team/suppliers",
        },
        {
          title: "General Contacts",
          url: "/team/contacts",
        },
      ],
    },
    {
      title: "Documents",
      url: "/documents",
      icon: FileText,
      items: [
        {
          title: "Plans & Drawings",
          url: "/documents/plans-drawings",
        },
        {
          title: "Permits",
          url: "/documents/permits",
        },
        {
          title: "Compliance",
          url: "/documents/compliance",
        },
      ],
    },
  ],
  quickActions: [
    {
      name: "Blokar Copilot",
      panelType: "ai-assistant",
      icon: MessageSquare,
    },
    {
      name: "New Task",
      panelType: "new-task",
      icon: Plus,
    },
    {
      name: "Upload Documents",
      panelType: "upload-document",
      icon: Upload,
    },
  ],
};

// Helper function to get project icon based on project type
const getProjectIcon = (projectType: string) => {
  switch (projectType?.toLowerCase()) {
    case "residential":
      return Building2;
    case "commercial":
      return Building;
    case "industrial":
      return Map;
    default:
      return Building;
  }
};

export function SidebarApp({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();

  // Transform API projects to the format expected by NavProjects
  const projectsData = projects.map((project) => ({
    name: project.name,
    url: `/projects/${project.id}`,
    icon: getProjectIcon(project.project_type || ""),
    id: project.id,
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavPlatform items={data.navPlatform} />
        <NavQuickActions actions={data.quickActions} />
        <NavProjects
          projects={projectsData}
          isLoading={projectsLoading}
          error={projectsError}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
