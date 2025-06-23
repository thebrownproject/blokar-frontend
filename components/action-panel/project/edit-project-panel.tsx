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
import { useProjects } from "@/hooks/use-projects";
import { usePanel } from "@/hooks/use-panel";
import { createClient } from "@/utils/supabase/client";
import {
  PencilLine,
  Save,
  X,
  Edit2,
  Calendar,
  MapPin,
  Building,
  User,
  Percent,
  Trash2,
} from "lucide-react";
import { DeleteProjectDialog } from "../../projects/delete-project-dialog";
import type { Project } from "@/services/supabase";

interface EditProjectPanelProps {
  data?: { projectId: string } | Record<string, unknown>;
}

interface EditingState {
  [key: string]: boolean;
}

interface EditValues {
  [key: string]: string | number;
}

const supabase = createClient();

// Field configuration for rendering
const PROJECT_FIELDS = [
  {
    key: "name",
    label: "Project Name",
    type: "text",
    required: true,
    icon: Building,
    editable: true,
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    required: false,
    icon: Edit2,
    editable: true,
  },
  {
    key: "address",
    label: "Address",
    type: "text",
    required: true,
    icon: MapPin,
    editable: true,
  },
  {
    key: "suburb",
    label: "Suburb",
    type: "text",
    required: false,
    icon: MapPin,
    editable: true,
  },
  {
    key: "state",
    label: "State",
    type: "select",
    required: false,
    icon: MapPin,
    editable: true,
    options: ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"],
  },
  {
    key: "postcode",
    label: "Postcode",
    type: "text",
    required: false,
    icon: MapPin,
    editable: true,
  },
  {
    key: "project_type",
    label: "Project Type",
    type: "select",
    required: false,
    icon: Building,
    editable: true,
    options: ["Residential", "Commercial", "Industrial", "Infrastructure"],
  },
  {
    key: "building_class",
    label: "Building Class",
    type: "select",
    required: false,
    icon: Building,
    editable: true,
    options: [
      "Class 1a",
      "Class 1b",
      "Class 2",
      "Class 3",
      "Class 5",
      "Class 6",
      "Class 7a",
      "Class 7b",
      "Class 8",
      "Class 9a",
      "Class 9b",
      "Class 9c",
      "Class 10a",
      "Class 10b",
      "Class 10c",
    ],
  },
  {
    key: "project_scale",
    label: "Project Scale",
    type: "select",
    required: false,
    icon: Building,
    editable: true,
    options: ["Small", "Medium", "Large", "Major"],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: false,
    icon: Building,
    editable: true,
    options: [
      "Planning",
      "DA Approved",
      "CC In Progress",
      "Under Construction",
      "Complete",
      "On Hold",
    ],
  },
  {
    key: "progress",
    label: "Progress (%)",
    type: "number",
    required: false,
    icon: Percent,
    editable: true,
  },
  {
    key: "council_name",
    label: "Council Name",
    type: "text",
    required: false,
    icon: Building,
    editable: true,
  },
  {
    key: "council_contact",
    label: "Council Contact",
    type: "text",
    required: false,
    icon: User,
    editable: true,
  },
  {
    key: "created_at",
    label: "Created",
    type: "display",
    required: false,
    icon: Calendar,
    editable: false,
  },
  {
    key: "updated_at",
    label: "Last Updated",
    type: "display",
    required: false,
    icon: Calendar,
    editable: false,
  },
];

export function EditProjectPanel({ data }: EditProjectPanelProps) {
  const { projects, refetch, updateProject } = useProjects();
  const { closePanel } = usePanel();
  const [project, setProject] = useState<Project | null>(null);
  const [editing, setEditing] = useState<EditingState>({});
  const [editValues, setEditValues] = useState<EditValues>({});
  const [saving, setSaving] = useState<EditingState>({});
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Find the specific project
  useEffect(() => {
    const projectId =
      data && typeof data === "object" && "projectId" in data
        ? (data.projectId as string)
        : undefined;
    if (projectId && projects.length > 0) {
      const foundProject = projects.find((p) => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
        // Initialize edit values
        const initialValues: EditValues = {};
        PROJECT_FIELDS.forEach((field) => {
          initialValues[field.key] =
            foundProject[field.key as keyof Project] || "";
        });
        setEditValues(initialValues);
      }
    }
  }, [data, projects]);

  const handleStartEdit = (fieldKey: string) => {
    setEditing((prev) => ({ ...prev, [fieldKey]: true }));
    setEditValues((prev) => ({
      ...prev,
      [fieldKey]: project?.[fieldKey as keyof Project] || "",
    }));
  };

  const handleCancelEdit = (fieldKey: string) => {
    setEditing((prev) => ({ ...prev, [fieldKey]: false }));
    setEditValues((prev) => ({
      ...prev,
      [fieldKey]: project?.[fieldKey as keyof Project] || "",
    }));
  };

  const handleSaveField = async (fieldKey: string) => {
    if (!project) return;

    setSaving((prev) => ({ ...prev, [fieldKey]: true }));
    setError(null);

    try {
      // Handle type conversion based on field type
      let fieldValue = editValues[fieldKey];
      const fieldConfig = PROJECT_FIELDS.find((f) => f.key === fieldKey);

      if (fieldConfig?.type === "number") {
        fieldValue =
          typeof fieldValue === "string"
            ? parseInt(fieldValue) || 0
            : fieldValue;
      } else {
        fieldValue = String(fieldValue || "");
      }

      const updateData: Partial<Project> = {
        [fieldKey]: fieldValue,
        updated_at: new Date().toISOString(),
      };

      // Optimistic update for immediate UI feedback
      updateProject(project.id, updateData);
      setProject((prev) => (prev ? { ...prev, ...updateData } : null));
      setEditing((prev) => ({ ...prev, [fieldKey]: false }));

      // Save to database
      const { error: supabaseError } = await supabase
        .from("projects")
        .update(updateData)
        .eq("id", project.id);

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

  const renderFieldValue = (
    field: (typeof PROJECT_FIELDS)[0],
    value: string | number | undefined
  ) => {
    if (!value && value !== 0)
      return <span className="text-muted-foreground italic">Not set</span>;

    if (field.type === "display") {
      return new Date(value as string).toLocaleDateString();
    }

    if (field.key === "progress") {
      return `${value}%`;
    }

    return value;
  };

  const renderEditField = (field: (typeof PROJECT_FIELDS)[0]) => {
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
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (field.type === "number") {
      return (
        <Input
          type="number"
          value={value}
          onChange={(e) =>
            setEditValues((prev) => ({
              ...prev,
              [field.key]: parseInt(e.target.value) || 0,
            }))
          }
          placeholder={`Enter ${field.label.toLowerCase()}`}
          min="0"
          max="100"
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

  if (!project) {
    return (
      <ActionPanelCard
        title="Project Details"
        headerActions={<PencilLine className="h-4 w-4" />}
      >
        <div className="p-4 text-center text-muted-foreground">
          {projects.length === 0 ? "Loading project..." : "Project not found"}
        </div>
      </ActionPanelCard>
    );
  }

  return (
    <ActionPanelCard
      title="Project Details"
      headerActions={<PencilLine className="h-4 w-4" />}
    >
      <div className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:text-red-400 dark:border-red-900">
            {error}
          </div>
        )}

        {PROJECT_FIELDS.map((field) => {
          const Icon = field.icon;
          const isEditing = editing[field.key];
          const isSaving = saving[field.key];
          const value = project[field.key as keyof Project];

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
              Permanently delete this project and all associated data. This
              action cannot be undone.
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Project
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      {project && (
        <DeleteProjectDialog
          project={project}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onSuccess={() => {
            closePanel();
            setShowDeleteDialog(false);
          }}
        />
      )}
    </ActionPanelCard>
  );
}
