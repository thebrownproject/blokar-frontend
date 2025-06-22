"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Building,
  ListTodo,
  MoreHorizontal,
  Folder,
  Forward,
  Trash2,
  Edit,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePanel } from "@/hooks/use-panel";
import type { Project } from "@/services/supabase";

interface ProjectCardProps {
  project: Project;
  taskCount?: number;
}

export function ProjectCard({ project, taskCount = 0 }: ProjectCardProps) {
  const isMobile = useIsMobile();
  const { openPanel } = usePanel();

  // Format address from project data
  const formatAddress = (project: Project) => {
    const parts = [
      project.address,
      project.suburb,
      project.state,
      project.postcode,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : "Address not provided";
  };

  const handleEditProject = () => {
    openPanel("edit-project", { projectId: project.id });
  };

  const handleViewProject = () => {
    openPanel("view-project", { projectId: project.id });
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">
              {project.name}
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatAddress(project)}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-48 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align={isMobile ? "end" : "start"}
          >
            <DropdownMenuItem onClick={handleViewProject}>
              <Folder className="text-muted-foreground" />
              <span>View Project</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditProject}>
              <Edit className="text-muted-foreground" />
              <span>Edit Project</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Forward className="text-muted-foreground" />
              <span>Share Project</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="text-muted-foreground" />
              <span>Delete Project</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              {project.status || "active"}
            </span>
          </div>

          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-1">
              <ListTodo className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {taskCount} tasks
              </span>
            </div>

            <div className="text-xs text-muted-foreground">
              {new Date(project.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
