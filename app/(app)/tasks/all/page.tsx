"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { usePanel } from "@/hooks/use-panel";
import { TaskStats, TasksGrid, TaskFilters } from "@/components/tasks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { TaskWithProject } from "@/hooks/tasks-context";

export default function AllTasksPage() {
  const { tasks, loading, error } = useTasks();
  const { openPanel } = usePanel();
  const [filteredTasks, setFilteredTasks] = useState<TaskWithProject[]>([]);

  const handleNewTask = () => {
    openPanel("new-task", {});
  };

  // Use filtered tasks if filters are applied, otherwise use all tasks
  const displayTasks =
    filteredTasks.length > 0 || filteredTasks === tasks ? filteredTasks : tasks;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">All Tasks</h1>
            <p className="text-muted-foreground">
              View and manage all tasks across your projects
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleNewTask} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
            <div className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${displayTasks.length} tasks`}
            </div>
          </div>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Task Overview</h2>
        <TaskStats tasks={tasks} isLoading={loading} />
      </div>

      {/* Task Filters */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Filter Tasks</h2>
        <TaskFilters tasks={tasks} onFilteredTasksChange={setFilteredTasks} />
      </div>

      {/* All Tasks Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {filteredTasks.length !== tasks.length
              ? "Filtered Tasks"
              : "All Tasks"}
          </h2>
          {!loading && displayTasks.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {displayTasks.length}{" "}
              {displayTasks.length === 1 ? "task" : "tasks"}
              {filteredTasks.length !== tasks.length &&
                ` of ${tasks.length} total`}
            </span>
          )}
        </div>
        <TasksGrid tasks={displayTasks} isLoading={loading} error={error} />
      </div>
    </div>
  );
}
