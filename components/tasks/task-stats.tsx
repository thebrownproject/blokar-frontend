"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Circle, AlertTriangle } from "lucide-react";
import type { TaskWithProject } from "@/hooks/tasks-context";

interface TaskStatsProps {
  tasks: TaskWithProject[];
  isLoading: boolean;
}

export function TaskStats({ tasks, isLoading }: TaskStatsProps) {
  // Calculate stats from tasks
  const stats = {
    totalTasks: tasks.length,
    completed: tasks.filter((t) => t.status?.toLowerCase() === "completed")
      .length,
    inProgress: tasks.filter(
      (t) =>
        t.status?.toLowerCase() === "in_progress" ||
        t.status?.toLowerCase() === "in-progress"
    ).length,
    overdue: tasks.filter((t) => {
      if (t.status?.toLowerCase() === "completed" || !t.due_date) return false;
      return new Date(t.due_date) < new Date();
    }).length,
  };

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      description: "All tasks in your projects",
      icon: Circle,
      color: "text-blue-600",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      description: "Tasks being worked on",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Completed",
      value: stats.completed,
      description: "Tasks finished",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      description: "Tasks past due date",
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
