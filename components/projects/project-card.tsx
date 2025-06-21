"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, ListTodo } from "lucide-react";
import type { Project } from "@/services/supabase";

interface ProjectCardProps {
  project: Project;
  taskCount?: number;
}

export function ProjectCard({ project, taskCount = 0 }: ProjectCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Building className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg font-semibold truncate">
            {project.name}
          </CardTitle>
        </div>
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            {project.status || "active"}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
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
