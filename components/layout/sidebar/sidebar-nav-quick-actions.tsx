"use client";

import { type LucideIcon } from "lucide-react";
import { usePanel } from "@/hooks/use-panel";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavQuickActions({
  actions,
}: {
  actions: {
    name: string;
    panelType?: string;
    url?: string;
    icon: LucideIcon;
  }[];
}) {
  const { openPanel } = usePanel();

  const handleActionClick = (action: (typeof actions)[0]) => {
    if (action.panelType) {
      openPanel(action.panelType as any);
    } else if (action.url) {
      window.location.href = action.url;
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
      <SidebarMenu>
        {actions.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton onClick={() => handleActionClick(item)}>
              <item.icon />
              <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
