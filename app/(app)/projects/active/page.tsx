"use client";

import { useProjects } from "@/hooks/use-projects";
import { usePanel } from "@/hooks/use-panel";
import { ProjectStats, ProjectsGrid } from "@/components/projects";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMemo } from "react";

export default function ActiveProjectsPage() {
  const { projects, loading, error } = useProjects();
  const { openPanel } = usePanel();

  // Filter for active projects
  const activeProjects = useMemo(() => {
    return projects;
  }, [projects]);

  const handleNewProject = () => {
    openPanel("new-project", {});
  };

  console.log(
    "Project statuses:",
    projects.map((p) => p.status)
  );

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
          <div className="flex items-center gap-4">
            <Button
              onClick={handleNewProject}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Project
            </Button>
            <div className="text-sm text-muted-foreground">
              {loading
                ? "Loading..."
                : `${activeProjects.length} active projects`}
            </div>
          </div>
        </div>
      </div>

      {/* Project Statistics */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Project Overview</h2>
        <ProjectStats projects={projects} isLoading={loading} />
      </div>

      {/* Active Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active Projects</h2>
          {!loading && activeProjects.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {activeProjects.length}{" "}
              {activeProjects.length === 1 ? "project" : "projects"}
            </span>
          )}
        </div>
        <ProjectsGrid
          projects={activeProjects}
          isLoading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
