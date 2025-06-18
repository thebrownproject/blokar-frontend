"use client";

import * as React from "react";
import {
  Bot,
  Building,
  Building2,
  Calendar,
  FileText,
  GalleryVerticalEnd,
  Home,
  Map,
  Plus,
  Settings2,
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
          url: "/dashboard/overview",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Reports",
          url: "/dashboard/reports",
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
    {
      title: "Team",
      url: "/team",
      icon: Users,
      items: [
        {
          title: "Contractors",
          url: "/team/contractors",
        },
        {
          title: "Subcontractors",
          url: "/team/subcontractors",
        },
        {
          title: "Contacts",
          url: "/team/contacts",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "Organization",
          url: "/settings/organization",
        },
        {
          title: "Projects",
          url: "/settings/projects",
        },
        {
          title: "Integrations",
          url: "/settings/integrations",
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
      icon: ListTodo,
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
  const { user, isLoading: userLoading } = useUser();
  const {
    projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjects();

  // Create user object for NavUser component with fallback values
  const userData = user
    ? {
        name: user.name || user.email?.split("@")[0] || "User",
        email: user.email,
        avatar: "/avatars/default.jpg", // You can add avatar support later
      }
    : {
        name: "Loading...",
        email: "loading...",
        avatar: "/avatars/default.jpg",
      };

  // Transform API projects to the format expected by NavProjects
  const projectsData = projects.map((project) => ({
    name: project.name,
    url: `/projects/${project.id}`,
    icon: getProjectIcon(project.project_type),
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
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
