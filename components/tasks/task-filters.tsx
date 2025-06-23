"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import type { TaskWithProject } from "@/hooks/tasks-context";

interface TaskFiltersProps {
  tasks: TaskWithProject[];
  onFilteredTasksChange: (filteredTasks: TaskWithProject[]) => void;
}

export function TaskFilters({
  tasks,
  onFilteredTasksChange,
}: TaskFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");

  // Get unique values for filters
  const uniqueProjects = Array.from(
    new Set(tasks.map((task) => task.project_name).filter(Boolean))
  ).sort();

  const uniqueStatuses = Array.from(
    new Set(tasks.map((task) => task.status).filter(Boolean))
  ).sort();

  const uniquePriorities = Array.from(
    new Set(tasks.map((task) => task.priority).filter(Boolean))
  ).sort();

  // Apply filters
  const applyFilters = () => {
    let filtered = tasks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Project filter
    if (selectedProject !== "all") {
      filtered = filtered.filter(
        (task) => task.project_name === selectedProject
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((task) => task.status === selectedStatus);
    }

    // Priority filter
    if (selectedPriority !== "all") {
      filtered = filtered.filter((task) => task.priority === selectedPriority);
    }

    onFilteredTasksChange(filtered);
  };

  // Apply filters whenever any filter changes
  React.useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedProject, selectedStatus, selectedPriority, tasks]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedProject("all");
    setSelectedStatus("all");
    setSelectedPriority("all");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedProject !== "all" ||
    selectedStatus !== "all" ||
    selectedPriority !== "all";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-3">
            {/* Project Filter */}
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {uniqueProjects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select
              value={selectedPriority}
              onValueChange={setSelectedPriority}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {uniquePriorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Filter className="h-3 w-3" />
                Active filters:
              </span>
              {searchTerm && (
                <Badge variant="secondary">Search: "{searchTerm}"</Badge>
              )}
              {selectedProject !== "all" && (
                <Badge variant="secondary">Project: {selectedProject}</Badge>
              )}
              {selectedStatus !== "all" && (
                <Badge variant="secondary">Status: {selectedStatus}</Badge>
              )}
              {selectedPriority !== "all" && (
                <Badge variant="secondary">Priority: {selectedPriority}</Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
