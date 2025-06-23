"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  MoreHorizontal,
  Edit,
  Eye,
  Building,
  Calendar,
  Circle,
  AlertCircle,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePanel } from "@/hooks/use-panel";
import type { TaskWithProject } from "@/hooks/tasks-context";

interface TaskCardProps {
  task: TaskWithProject;
}

export function TaskCard({ task }: TaskCardProps) {
  const isMobile = useIsMobile();
  const { openPanel } = usePanel();

  // Get status color and icon
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          color: "bg-green-100 text-green-700",
          icon: CheckCircle,
          label: "Completed",
        };
      case "in_progress":
      case "in-progress":
        return {
          color: "bg-blue-100 text-blue-700",
          icon: Clock,
          label: "In Progress",
        };
      case "pending":
      case "todo":
        return {
          color: "bg-gray-100 text-gray-700",
          icon: Circle,
          label: "Todo",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700",
          icon: Circle,
          label: status || "Unknown",
        };
    }
  };

  // Get priority color
  const getPriorityConfig = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return { color: "bg-red-100 text-red-700", label: "High" };
      case "medium":
        return { color: "bg-yellow-100 text-yellow-700", label: "Medium" };
      case "low":
        return { color: "bg-green-100 text-green-700", label: "Low" };
      default:
        return {
          color: "bg-gray-100 text-gray-700",
          label: priority || "Medium",
        };
    }
  };

  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);
  const StatusIcon = statusConfig.icon;

  // Check if task is overdue
  const isOverdue =
    task.due_date &&
    new Date(task.due_date) < new Date() &&
    task.status !== "completed";

  const handleViewTask = () => {
    openPanel("view-task", { taskId: task.id });
  };

  const handleEditTask = () => {
    openPanel("edit-task", { taskId: task.id });
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            <StatusIcon className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {task.title}
            </CardTitle>
          </div>

          {task.project_name && (
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Building className="h-3 w-3" />
              <span>{task.project_name}</span>
            </div>
          )}
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
            <DropdownMenuItem onClick={handleViewTask}>
              <Eye className="text-muted-foreground" />
              <span>View Task</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditTask}>
              <Edit className="text-muted-foreground" />
              <span>Edit Task</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Status and Priority badges */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={statusConfig.color}>
              {statusConfig.label}
            </Badge>
            <Badge variant="outline" className={priorityConfig.color}>
              {priorityConfig.label}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="bg-red-100 text-red-700">
                <AlertCircle className="h-3 w-3 mr-1" />
                Overdue
              </Badge>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Footer with due date and created date */}
          <div className="flex items-center justify-between pt-2 border-t">
            {task.due_date ? (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Due {new Date(task.due_date).toLocaleDateString()}</span>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No due date</div>
            )}

            <div className="text-xs text-muted-foreground">
              {new Date(task.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
