"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { useProjects } from "@/hooks/use-projects";
import {
  Building,
  ListTodo,
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const {
    projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjects();

  // Dashboard stats (placeholder for now)
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(
      (p) => p.status === "planning" || p.status === "approved"
    ).length,
    pendingTasks: 12, // TODO: Get from API
    teamMembers: 8, // TODO: Get from API
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.email?.split("@")[0] || "User"}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your projects today.
        </p>

        {/* DEBUG INFO - Remove after fixing */}
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
          <strong>Debug Info:</strong>
          <br />
          User Loading: {userLoading ? "Yes" : "No"}
          <br />
          User: {user ? user.email : "Not logged in"}
          <br />
          Projects Loading: {projectsLoading ? "Yes" : "No"}
          <br />
          Projects Error: {projectsError || "None"}
          <br />
          Projects Count: {projects.length}
        </div>
      </div>

      {/* Stats Overview - Container Responsive Grid */}
      <div className="grid gap-4 auto-fit-cards">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projectsLoading ? "..." : stats.totalProjects}
            </div>
            <p className="text-xs text-muted-foreground">
              All projects in your organization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projectsLoading ? "..." : stats.activeProjects}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently in planning or approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tasks requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamMembers}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity - Container Responsive Grid */}
      <div className="grid gap-4 auto-fit-large-cards">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <p className="text-muted-foreground">Loading projects...</p>
            ) : projectsError ? (
              <p className="text-red-500">Error: {projectsError}</p>
            ) : projects.length > 0 ? (
              <div className="space-y-2">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{project.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {project.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No projects found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Building permit renewal due</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Safety inspection overdue</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  New compliance document required
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
