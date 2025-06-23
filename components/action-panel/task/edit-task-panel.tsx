"use client";

import { useState, useEffect } from "react";
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
import { createClient } from "@/utils/supabase/client";
import {
  Edit,
  Save,
  X,
  Edit2,
  Calendar,
  Building,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Trash2,
} from "lucide-react";
import { DeleteTaskDialog } from "../../tasks/delete-task-dialog";
import type { TaskWithProject } from "@/hooks/tasks-context";

interface EditTaskPanelProps {
  data?: { taskId: string } | Record<string, unknown>;
}

interface EditingState {
  [key: string]: boolean;
}

interface EditValues {
  [key: string]: string | number;
}

const supabase = createClient();

// Field configuration for rendering
const TASK_FIELDS = [
  {
    key: "title",
    label: "Task Title",
    type: "text",
    required: true,
    icon: Edit,
    editable: true,
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    required: false,
    icon: FileText,
    editable: true,
  },
  {
    key: "project_name",
    label: "Project",
    type: "display",
    required: false,
    icon: Building,
    editable: false,
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    icon: CheckCircle,
    editable: true,
    options: ["todo", "in_progress", "completed"],
  },
  {
    key: "priority",
    label: "Priority",
    type: "select",
    required: true,
    icon: AlertTriangle,
    editable: true,
    options: ["low", "medium", "high"],
  },
  {
    key: "due_date",
    label: "Due Date",
    type: "date",
    required: false,
    icon: Calendar,
    editable: true,
  },
  {
    key: "created_at",
    label: "Created",
    type: "display",
    required: false,
    icon: Clock,
    editable: false,
  },
  {
    key: "updated_at",
    label: "Last Updated",
    type: "display",
    required: false,
    icon: Clock,
    editable: false,
  },
];

export function EditTaskPanel({ data }: EditTaskPanelProps) {
  const { tasks, refetch, updateTask } = useTasks();
  const [task, setTask] = useState<TaskWithProject | null>(null);
  const [editing, setEditing] = useState<EditingState>({});
  const [editValues, setEditValues] = useState<EditValues>({});
  const [saving, setSaving] = useState<EditingState>({});
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Find the specific task
  useEffect(() => {
    const taskId =
      data && typeof data === "object" && "taskId" in data
        ? (data.taskId as string)
        : undefined;
    if (taskId && tasks.length > 0) {
      const foundTask = tasks.find((t) => t.id === taskId);
      if (foundTask) {
        setTask(foundTask);
        // Initialize edit values
        const initialValues: EditValues = {};
        TASK_FIELDS.forEach((field) => {
          initialValues[field.key] =
            foundTask[field.key as keyof TaskWithProject] || "";
        });
        setEditValues(initialValues);
      }
    }
  }, [data, tasks]);

  const handleStartEdit = (fieldKey: string) => {
    setEditing((prev) => ({ ...prev, [fieldKey]: true }));
    setEditValues((prev) => ({
      ...prev,
      [fieldKey]: task?.[fieldKey as keyof TaskWithProject] || "",
    }));
  };

  const handleCancelEdit = (fieldKey: string) => {
    setEditing((prev) => ({ ...prev, [fieldKey]: false }));
    setEditValues((prev) => ({
      ...prev,
      [fieldKey]: task?.[fieldKey as keyof TaskWithProject] || "",
    }));
  };

  const handleSaveField = async (fieldKey: string) => {
    if (!task) return;

    setSaving((prev) => ({ ...prev, [fieldKey]: true }));
    setError(null);

    try {
      // Handle type conversion based on field type
      let fieldValue = editValues[fieldKey];
      const fieldConfig = TASK_FIELDS.find((f) => f.key === fieldKey);

      if (fieldConfig?.type === "date") {
        fieldValue = fieldValue
          ? new Date(fieldValue as string).toISOString()
          : "";
      } else {
        fieldValue = String(fieldValue || "");
      }

      const updateData: Partial<TaskWithProject> = {
        [fieldKey]: fieldValue,
        updated_at: new Date().toISOString(),
      };

      // Optimistic update for immediate UI feedback
      updateTask(task.id, updateData);
      setTask((prev) => (prev ? { ...prev, ...updateData } : null));
      setEditing((prev) => ({ ...prev, [fieldKey]: false }));

      // Save to database
      const { error: supabaseError } = await supabase
        .from("project_tasks")
        .update(updateData)
        .eq("id", task.id);

      if (supabaseError) throw supabaseError;

      // Refetch to ensure all components have latest data
      await refetch();
    } catch (error) {
      console.error("Failed to update field:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update field"
      );
      // Revert optimistic update on error
      await refetch();
    } finally {
      setSaving((prev) => ({ ...prev, [fieldKey]: false }));
    }
  };

  const handleDeleteTask = () => {
    setShowDeleteDialog(true);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Completed</span>
          </div>
        );
      case "in_progress":
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <Clock className="h-4 w-4" />
            <span>In Progress</span>
          </div>
        );
      case "todo":
        return (
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle className="h-4 w-4" />
            <span>To Do</span>
          </div>
        );
      default:
        return status;
    }
  };

  const getPriorityDisplay = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            High Priority
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Medium Priority
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Low Priority
          </span>
        );
      default:
        return priority;
    }
  };

  const renderFieldValue = (
    field: (typeof TASK_FIELDS)[0],
    value: string | number | undefined
  ) => {
    if (!value && value !== 0)
      return <span className="text-muted-foreground italic">Not set</span>;

    if (field.type === "display") {
      if (field.key === "created_at" || field.key === "updated_at") {
        return new Date(value as string).toLocaleDateString();
      }
      return value;
    }

    if (field.key === "status") {
      return getStatusDisplay(value as string);
    }

    if (field.key === "priority") {
      return getPriorityDisplay(value as string);
    }

    if (field.type === "date") {
      return new Date(value as string).toLocaleDateString();
    }

    return value;
  };

  const renderEditField = (field: (typeof TASK_FIELDS)[0]) => {
    const value = editValues[field.key] || "";

    if (field.type === "textarea") {
      return (
        <Textarea
          value={value}
          onChange={(e) =>
            setEditValues((prev) => ({ ...prev, [field.key]: e.target.value }))
          }
          placeholder={`Enter ${field.label.toLowerCase()}`}
          className="min-h-[80px]"
        />
      );
    }

    if (field.type === "select" && field.options) {
      return (
        <Select
          value={String(value || "")}
          onValueChange={(newValue) =>
            setEditValues((prev) => ({ ...prev, [field.key]: newValue }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
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
      );
    }

    if (field.type === "date") {
      const dateValue = value
        ? new Date(value as string).toISOString().split("T")[0]
        : "";
      return (
        <Input
          type="date"
          value={dateValue}
          onChange={(e) =>
            setEditValues((prev) => ({ ...prev, [field.key]: e.target.value }))
          }
        />
      );
    }

    return (
      <Input
        type="text"
        value={value}
        onChange={(e) =>
          setEditValues((prev) => ({ ...prev, [field.key]: e.target.value }))
        }
        placeholder={`Enter ${field.label.toLowerCase()}`}
      />
    );
  };

  if (!task) {
    return (
      <ActionPanelCard
        title="Task Details"
        headerActions={<Edit className="h-4 w-4" />}
      >
        <div className="p-4 text-center text-muted-foreground">
          {tasks.length === 0 ? "Loading task..." : "Task not found"}
        </div>
      </ActionPanelCard>
    );
  }

  return (
    <ActionPanelCard
      title="Task Details"
      headerActions={<Edit className="h-4 w-4" />}
    >
      <div className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:text-red-400 dark:border-red-900">
            {error}
          </div>
        )}

        {TASK_FIELDS.map((field) => {
          const Icon = field.icon;
          const isEditing = editing[field.key];
          const isSaving = saving[field.key];
          const value = task[field.key as keyof TaskWithProject];

          return (
            <div key={field.key} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">{field.label}</Label>
                {field.required && <span className="text-red-500">*</span>}
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  {renderEditField(field)}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSaveField(field.key)}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-3 w-3 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelEdit(field.key)}
                      disabled={isSaving}
                    >
                      <X className="h-3 w-3 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between group">
                  <div className="flex-1 py-2 px-3 bg-muted/30 rounded-md min-h-[40px] flex items-center">
                    {renderFieldValue(field, value)}
                  </div>
                  {field.editable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartEdit(field.key)}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Delete Section */}
        <div className="pt-6 border-t border-border">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-destructive">
              Danger Zone
            </Label>
            <p className="text-sm text-muted-foreground">
              Permanently delete this task. This action cannot be undone.
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteTask}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Task
            </Button>
          </div>
        </div>
      </div>

      <DeleteTaskDialog
        task={task}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </ActionPanelCard>
  );
}
