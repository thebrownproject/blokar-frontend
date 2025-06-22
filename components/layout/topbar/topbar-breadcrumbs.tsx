"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProjectsContext } from "@/hooks/projects-context";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBarBreadcrumbs() {
  const pathname = usePathname();
  const { projects } = useProjectsContext();

  // Generate breadcrumb items from pathname
  const pathSegments = pathname.split("/").filter(Boolean);

  // Create breadcrumb items with proper titles
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    let title =
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

    // Check if this segment looks like a UUID and we're in a project context
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        segment
      );
    if (
      isUUID &&
      pathSegments[index - 1] === "projects" &&
      projects.length > 0
    ) {
      const project = projects.find((p) => p.id === segment);
      if (project) {
        title = project.name;
      }
    }

    return {
      title,
      href,
      isLast: index === pathSegments.length - 1,
    };
  });

  // Use breadcrumb items without Dashboard prefix
  const allItems = breadcrumbItems;

  // Show ellipsis if more than 3 items
  const shouldShowEllipsis = allItems.length > 3;
  const visibleItems = shouldShowEllipsis
    ? [allItems[0], ...allItems.slice(-2)]
    : allItems;
  const hiddenItems = shouldShowEllipsis ? allItems.slice(1, -2) : [];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {shouldShowEllipsis && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={allItems[0].href}>{allItems[0].title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {hiddenItems.map((item) => (
                    <DropdownMenuItem key={item.href}>
                      <Link href={item.href} className="w-full">
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {visibleItems.slice(shouldShowEllipsis ? 1 : 0).map((item) => (
          <div key={item.href} className="flex items-center">
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.title}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
