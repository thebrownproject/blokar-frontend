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
} from "lucide-react";

import { NavPlatform } from "@/components/layout/sidebar/sidebar-nav-platform";
import { NavProjects } from "@/components/layout/sidebar/sidebar-nav-projects";
import { NavQuickActions } from "@/components/layout/sidebar/sidebar-nav-quick-actions";
import { NavUser } from "@/components/layout/sidebar/sidebar-nav-user";
import { TeamSwitcher } from "@/components/layout/sidebar/sidebar-team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "BuildSpec Pro",
    email: "professional@buildspec.com",
    avatar: "/avatars/buildspec.jpg",
  },
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
  projects: [
    {
      name: "Residential Complex",
      url: "/projects/residential-complex",
      icon: Building,
    },
    {
      name: "Commercial Tower",
      url: "/projects/commercial-tower",
      icon: Building2,
    },
    {
      name: "Infrastructure",
      url: "/projects/infrastructure",
      icon: Map,
    },
  ],
  quickActions: [
    {
      name: "AI Assistant",
      url: "/ai-assistant",
      icon: Bot,
    },
    {
      name: "New Project",
      url: "/projects/new",
      icon: Plus,
    },
    {
      name: "Schedule Meeting",
      url: "/meetings/schedule",
      icon: Calendar,
    },
    {
      name: "Upload Documents",
      url: "/documents/upload",
      icon: Upload,
    },
  ],
};

export function SidebarApp({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavPlatform items={data.navPlatform} />
        <NavProjects projects={data.projects} />
        <NavQuickActions actions={data.quickActions} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
