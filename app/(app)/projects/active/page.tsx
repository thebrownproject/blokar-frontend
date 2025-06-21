"use client";

import { useProjects } from "@/hooks/use-projects";
import { ProjectStats, ProjectsGrid } from "@/components/projects";
import { useMemo } from "react";

export default function ActiveProjectsPage() {
  const { projects, isLoading, error } = useProjects();

  // Filter for active projects
  const activeProjects = useMemo(() => {
    return projects.filter((project) => project.status === "active");
  }, [projects]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Active Projects</h1>
            <p className="text-muted-foreground">
              Manage and track your active construction projects
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading..."
              : `${activeProjects.length} active projects`}
          </div>
        </div>
      </div>

      {/* Project Statistics */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Project Overview</h2>
        <ProjectStats projects={projects} isLoading={isLoading} />
      </div>

      {/* Active Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active Projects</h2>
          {!isLoading && activeProjects.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {activeProjects.length}{" "}
              {activeProjects.length === 1 ? "project" : "projects"}
            </span>
          )}
        </div>
        <ProjectsGrid
          projects={activeProjects}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
