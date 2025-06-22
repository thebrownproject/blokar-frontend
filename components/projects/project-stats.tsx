"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
import type { Project } from "@/services/supabase";

interface ProjectStatsProps {
  projects: Project[];
  isLoading: boolean;
}

export function ProjectStats({ projects, isLoading }: ProjectStatsProps) {
  // Calculate stats from projects
  const stats = {
    totalActive: projects.filter((p) => p.status === "active").length,
    inProgress: projects.filter(
      (p) => p.status === "in_progress" || p.status === "planning"
    ).length,
    completedThisMonth: projects.filter((p) => {
      if (p.status !== "completed") return false;
      const completedDate = new Date(p.updated_at);
      const now = new Date();
      return (
        completedDate.getMonth() === now.getMonth() &&
        completedDate.getFullYear() === now.getFullYear()
      );
    }).length,
    overdue: projects.filter(
      (p) => p.status === "overdue" || p.status === "delayed"
    ).length,
  };

  const statCards = [
    {
      title: "Total Active",
      value: stats.totalActive,
      description: "Currently active projects",
      icon: Building,
      color: "text-blue-600",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      description: "Projects being worked on",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Completed This Month",
      value: stats.completedThisMonth,
      description: "Projects finished this month",
      icon: CheckCircle,
      color: "text-emerald-600",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      description: "Projects behind schedule",
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid gap-4 auto-fit-cards">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
