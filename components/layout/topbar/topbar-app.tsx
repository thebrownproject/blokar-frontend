"use client";

import { TopBarBreadcrumbs } from "./topbar-breadcrumbs";
import { TopBarSearch } from "./topbar-search";
import { TopBarActions } from "./topbar-actions";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function TopBarApp() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      {/* Sidebar Trigger */}
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Left: Breadcrumbs */}
      <div className="flex-shrink-0">
        <TopBarBreadcrumbs />
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md mx-auto">
        <TopBarSearch />
      </div>

      {/* Right: Actions */}
      <div className="flex-shrink-0">
        <TopBarActions />
      </div>
    </header>
  );
}
