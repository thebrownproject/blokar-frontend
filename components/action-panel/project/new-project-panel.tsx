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
import { useProjects } from "@/hooks/use-projects";
import { usePanel } from "@/hooks/use-panel";
import {
  Building,
  Save,
  X,
  MapPin,
  Edit2,
  Percent,
  User,
  AlertCircle,
} from "lucide-react";
import type { Project } from "@/services/supabase";

interface NewProjectFormData {
  name: string;
  description: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  project_type: string;
  building_class: string;
  project_scale: string;
  status: string;
  progress: number;
  council_name: string;
  council_contact: string;
  organization_id?: string;
}

// Field configuration for form rendering
const PROJECT_FORM_FIELDS = [
  {
    key: "name",
    label: "Project Name",
    type: "text",
    required: true,
    icon: Building,
    placeholder: "Enter project name",
  },
  {
    key: "address",
    label: "Address",
    type: "text",
    required: true,
    icon: MapPin,
    placeholder: "Enter project address",
  },
  {
    key: "project_type",
    label: "Project Type",
    type: "select",
    required: true,
    icon: Building,
    placeholder: "Select project type",
    options: ["Residential", "Commercial", "Industrial", "Infrastructure"],
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    required: false,
    icon: Edit2,
    placeholder: "Enter project description (optional)",
  },
  {
    key: "suburb",
    label: "Suburb",
    type: "text",
    required: false,
    icon: MapPin,
    placeholder: "Enter suburb",
  },
  {
    key: "state",
    label: "State",
    type: "select",
    required: false,
    icon: MapPin,
    placeholder: "Select state",
    options: ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"],
  },
  {
    key: "postcode",
    label: "Postcode",
    type: "text",
    required: false,
    icon: MapPin,
    placeholder: "Enter postcode",
  },
  {
    key: "building_class",
    label: "Building Class",
    type: "select",
    required: false,
    icon: Building,
    placeholder: "Select building class",
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
    placeholder: "Select project scale",
    options: ["Small", "Medium", "Large", "Major"],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: false,
    icon: Building,
    placeholder: "Select status",
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
    placeholder: "Enter progress percentage",
  },
  {
    key: "council_name",
    label: "Council Name",
    type: "text",
    required: false,
    icon: Building,
    placeholder: "Enter council name",
  },
  {
    key: "council_contact",
    label: "Council Contact",
    type: "text",
    required: false,
    icon: User,
    placeholder: "Enter council contact",
  },
];

export function NewProjectPanel() {
  const { addProject } = useProjects();
  const { closePanel } = usePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewProjectFormData>({
    name: "",
    description: "",
    address: "",
    suburb: "",
    state: "",
    postcode: "",
    project_type: "",
    building_class: "",
    project_scale: "",
    status: "Planning",
    progress: 0,
    council_name: "",
    council_contact: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate required fields
    const requiredFields = PROJECT_FORM_FIELDS.filter(
      (field) => field.required
    );

    requiredFields.forEach((field) => {
      const value = formData[field.key as keyof NewProjectFormData];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors[field.key] = `${field.label} is required`;
      }
    });

    // Validate progress if provided
    if (formData.progress < 0 || formData.progress > 100) {
      errors.progress = "Progress must be between 0 and 100";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (key: string, value: string | number) => {
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
      // Prepare project data for submission
      const projectData: Omit<
        Project,
        "id" | "user_id" | "created_at" | "updated_at"
      > = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        address: formData.address.trim(),
        suburb: formData.suburb.trim() || undefined,
        state: formData.state || undefined,
        postcode: formData.postcode.trim() || undefined,
        project_type: formData.project_type,
        building_class: formData.building_class || undefined,
        project_scale: formData.project_scale || undefined,
        status: formData.status || "Planning",
        progress: formData.progress,
        council_name: formData.council_name.trim() || undefined,
        council_contact: formData.council_contact.trim() || undefined,
        organization_id: formData.organization_id || undefined,
      };

      // Create the project using optimistic updates
      await addProject(projectData);

      // Close the panel on success
      closePanel();
    } catch (error) {
      console.error("Failed to create project:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create project"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormField = (field: (typeof PROJECT_FORM_FIELDS)[0]) => {
    const value = formData[field.key as keyof NewProjectFormData];
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
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {field.type === "number" && (
          <Input
            type="number"
            value={value}
            onChange={(e) =>
              handleInputChange(field.key, parseInt(e.target.value) || 0)
            }
            placeholder={field.placeholder}
            min="0"
            max="100"
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
      title="Create New Project"
      headerActions={<Building className="h-4 w-4" />}
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

        <div className="space-y-4">
          {PROJECT_FORM_FIELDS.map(renderFormField)}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Creating Project...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Project
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
