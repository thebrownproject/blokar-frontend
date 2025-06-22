"use client";

import { use, useMemo } from "react";
import { notFound } from "next/navigation";
import { useProjectsContext } from "@/hooks/projects-context";
import { usePanel } from "@/hooks/use-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building,
  MapPin,
  Calendar,
  Users,
  FileText,
  ListTodo,
  Edit,
  ArrowLeft,
  Plus,
  MoreHorizontal,
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface ProjectDashboardPageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectDashboardPage({
  params,
}: ProjectDashboardPageProps) {
  const { projectId } = use(params);
  const { projects, isLoading, error } = useProjectsContext();
  const { openPanel } = usePanel();

  // Find the current project
  const project = useMemo(() => {
    return projects.find((p) => p.id === projectId);
  }, [projects, projectId]);

  // Show loading state
  if (isLoading) {
    return <ProjectDashboardSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">
            Error Loading Project
          </h1>
          <p className="text-muted-foreground">
            {error.message || "Something went wrong"}
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/active">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  // Show not found if project doesn't exist
  if (!project) {
    notFound();
  }

  const handleEditProject = () => {
    openPanel("edit-project", { projectId: project.id });
  };

  const handleAddTask = () => {
    openPanel("new-task", { projectId: project.id });
  };

  const handleUploadDocument = () => {
    openPanel("upload-document", { projectId: project.id });
  };

  const handleAddContact = () => {
    openPanel("new-contact", { projectId: project.id });
  };

  // Format address from project data
  const formatAddress = (project: any) => {
    const parts = [
      project.address,
      project.suburb,
      project.state,
      project.postcode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Address not provided";
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "in_progress":
        return "bg-green-100 text-green-700 border-green-200";
      case "planning":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "on_hold":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Navigation Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/projects/active" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Projects</span>
          <span>/</span>
          <span className="text-foreground font-medium">{project.name}</span>
        </div>
      </div>

      {/* Hero Project Card */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {project.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {formatAddress(project)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={getStatusColor(project.status || "active")}
              >
                {project.status || "Active"}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleEditProject}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Project Type
              </p>
              <p className="text-sm">
                {project.project_type || "Not specified"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Building Class
              </p>
              <p className="text-sm">
                {project.building_class || "Not specified"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Project Scale
              </p>
              <p className="text-sm">
                {project.project_scale || "Not specified"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Created
              </p>
              <p className="text-sm">
                {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Progress Section */}
          {typeof project.progress === "number" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Project Progress</p>
                <span className="text-sm text-muted-foreground">
                  {project.progress}%
                </span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
          )}

          {/* Description */}
          {project.description && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </div>
          )}

          {/* Council Information */}
          {(project.council_name || project.council_contact) && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Council Information</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.council_name && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Council Name
                    </p>
                    <p className="text-sm">{project.council_name}</p>
                  </div>
                )}
                {project.council_contact && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Council Contact
                    </p>
                    <p className="text-sm">{project.council_contact}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleAddTask} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
        <Button
          variant="outline"
          onClick={handleUploadDocument}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Upload Document
        </Button>
        <Button
          variant="outline"
          onClick={handleAddContact}
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProjectStatsCard
          title="Tasks"
          icon={ListTodo}
          count={0}
          subtitle="0 completed, 0 pending"
          color="text-blue-600"
        />
        <ProjectStatsCard
          title="Contacts"
          icon={Users}
          count={0}
          subtitle="Team members & stakeholders"
          color="text-green-600"
        />
        <ProjectStatsCard
          title="Documents"
          icon={FileText}
          count={0}
          subtitle="Plans, permits & reports"
          color="text-purple-600"
        />
        <ProjectStatsCard
          title="Recent Activity"
          icon={Clock}
          count={0}
          subtitle="Updates this week"
          color="text-orange-600"
        />
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No recent activity</p>
              <p className="text-xs">
                Activity will appear here as you work on the project
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No upcoming deadlines</p>
              <p className="text-xs">Task deadlines will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Stats Card Component
interface ProjectStatsCardProps {
  title: string;
  icon: React.ElementType;
  count: number;
  subtitle: string;
  color?: string;
}

function ProjectStatsCard({
  title,
  icon: Icon,
  count,
  subtitle,
  color = "text-primary",
}: ProjectStatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <Icon className={`h-8 w-8 ${color} opacity-70`} />
        </div>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton Component
function ProjectDashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Navigation Header Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-32" />
        <Separator orientation="vertical" className="h-6" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Hero Card Skeleton */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-7 w-64" />
                  <Skeleton className="h-4 w-80" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Skeleton */}
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Sections Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
