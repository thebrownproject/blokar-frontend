"use client";

import { useState } from "react";
import { ActionPanelCard } from "../action-panel-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTasks } from "@/hooks/use-tasks";
import { useProjects } from "@/hooks/use-projects";
import { usePanel } from "@/hooks/use-panel";
import {
  CheckSquare,
  Save,
  X,
  Building,
  Edit,
  CheckCircle,
  AlertTriangle,
  Calendar,
  FileText,
  AlertCircle,
} from "lucide-react";
import type { Task } from "@/services/supabase";

interface NewTaskFormData {
  title: string;
  description: string;
  project_id: string;
  status: string;
  priority: string;
  due_date: string;
}

// Field configuration for form rendering
const TASK_FORM_FIELDS = [
  {
    key: "title",
    label: "Task Title",
    type: "text",
    required: true,
    icon: Edit,
    placeholder: "Enter task title",
  },
  {
    key: "project_id",
    label: "Project",
    type: "project_select",
    required: true,
    icon: Building,
    placeholder: "Select project",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    icon: CheckCircle,
    placeholder: "Select status",
    options: ["todo", "in_progress", "completed"],
  },
  {
    key: "priority",
    label: "Priority",
    type: "select",
    required: true,
    icon: AlertTriangle,
    placeholder: "Select priority",
    options: ["low", "medium", "high"],
  },
  {
    key: "due_date",
    label: "Due Date",
    type: "date",
    required: false,
    icon: Calendar,
    placeholder: "Select due date",
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    required: false,
    icon: FileText,
    placeholder: "Enter task description (optional)",
  },
];

export function NewTaskPanel() {
  const { addTask } = useTasks();
  const { projects } = useProjects();
  const { closePanel } = usePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewTaskFormData>({
    title: "",
    description: "",
    project_id: "",
    status: "todo",
    priority: "medium",
    due_date: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate required fields
    const requiredFields = TASK_FORM_FIELDS.filter((field) => field.required);

    requiredFields.forEach((field) => {
      const value = formData[field.key as keyof NewTaskFormData];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors[field.key] = `${field.label} is required`;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[key]) {
      setValidationErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fix the validation errors below");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare task data for submission
      const taskData: Omit<
        Task,
        "id" | "user_id" | "created_at" | "updated_at"
      > = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        project_id: formData.project_id,
        status: formData.status as "todo" | "in_progress" | "completed",
        priority: formData.priority as "low" | "medium" | "high",
        due_date: formData.due_date
          ? new Date(formData.due_date).toISOString()
          : undefined,
        task_type: undefined,
        assignee: undefined,
        progress: 0,
        estimated_hours: undefined,
        notes: undefined,
        completed_at: undefined,
        assigned_to: undefined,
      };

      // Create the task using optimistic updates
      await addTask(taskData);

      // Close the panel on success
      closePanel();
    } catch (error) {
      console.error("Failed to create task:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create task"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormField = (field: (typeof TASK_FORM_FIELDS)[0]) => {
    const value = formData[field.key as keyof NewTaskFormData];
    const hasError = !!validationErrors[field.key];
    const Icon = field.icon;

    return (
      <div key={field.key} className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">{field.label}</Label>
          {field.required && <span className="text-red-500">*</span>}
        </div>

        {field.type === "textarea" && (
          <Textarea
            value={String(value)}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={`min-h-[80px] ${hasError ? "border-red-500" : ""}`}
          />
        )}

        {field.type === "project_select" && (
          <Select
            value={String(value)}
            onValueChange={(newValue) => handleInputChange(field.key, newValue)}
          >
            <SelectTrigger className={hasError ? "border-red-500" : ""}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {field.type === "select" && field.options && (
          <Select
            value={String(value)}
            onValueChange={(newValue) => handleInputChange(field.key, newValue)}
          >
            <SelectTrigger className={hasError ? "border-red-500" : ""}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option === "todo"
                    ? "To Do"
                    : option === "in_progress"
                    ? "In Progress"
                    : option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {field.type === "date" && (
          <Input
            type="date"
            value={String(value)}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={hasError ? "border-red-500" : ""}
          />
        )}

        {field.type === "text" && (
          <Input
            type="text"
            value={String(value)}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={hasError ? "border-red-500" : ""}
          />
        )}

        {hasError && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="h-3 w-3" />
            {validationErrors[field.key]}
          </div>
        )}
      </div>
    );
  };

  return (
    <ActionPanelCard
      title="Create New Task"
      headerActions={<CheckSquare className="h-4 w-4" />}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:text-red-400 dark:border-red-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          </div>
        )}

        <div className="space-y-4">{TASK_FORM_FIELDS.map(renderFormField)}</div>

        <div className="flex gap-3 pt-4 border-t">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Creating Task...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Task
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={closePanel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    </ActionPanelCard>
  );
}
