"use client";

import { useState } from "react";
import { ActionPanelCard } from "../action-panel-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContacts } from "@/hooks/use-contacts";
import { useProjects } from "@/hooks/use-projects";
import { usePanel } from "@/hooks/use-panel";
import {
  UserPlus,
  Save,
  X,
  User,
  Building,
  Building2,
  Mail,
  Phone,
  FileText,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { CONTACT_TYPE_META } from "@/types/contacts";
import type { ProjectContact } from "@/types/contacts";

interface NewContactFormData {
  name: string;
  company: string;
  contact_type: string;
  project_id: string;
  email: string;
  phone: string;
  notes: string;
}

// Field configuration for form rendering
const CONTACT_FORM_FIELDS = [
  {
    key: "name",
    label: "Full Name",
    type: "text",
    required: true,
    icon: User,
    placeholder: "Enter full name",
  },
  {
    key: "contact_type",
    label: "Contact Type",
    type: "contact_type_select",
    required: true,
    icon: UserCheck,
    placeholder: "Select contact type",
    options: ["council", "engineer", "contractor", "consultant"],
  },
  {
    key: "project_id",
    label: "Project",
    type: "project_select",
    required: true,
    icon: Building2,
    placeholder: "Select project",
  },
  {
    key: "company",
    label: "Company",
    type: "text",
    required: false,
    icon: Building,
    placeholder: "Enter company name (optional)",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    required: false,
    icon: Mail,
    placeholder: "Enter email address (optional)",
  },
  {
    key: "phone",
    label: "Phone",
    type: "tel",
    required: false,
    icon: Phone,
    placeholder: "Enter phone number (optional)",
  },
  {
    key: "notes",
    label: "Notes",
    type: "textarea",
    required: false,
    icon: FileText,
    placeholder: "Enter additional notes (optional)",
  },
];

export function NewContactPanel() {
  const { addContact } = useContacts();
  const { projects } = useProjects();
  const { closePanel } = usePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewContactFormData>({
    name: "",
    company: "",
    contact_type: "",
    project_id: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate required fields
    const requiredFields = CONTACT_FORM_FIELDS.filter(
      (field) => field.required
    );

    requiredFields.forEach((field) => {
      const value = formData[field.key as keyof NewContactFormData];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors[field.key] = `${field.label} is required`;
      }
    });

    // Validate email format if provided
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Please enter a valid email address";
      }
    }

    // Validate phone format if provided
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        errors.phone = "Please enter a valid phone number";
      }
    }

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
      // Prepare contact data for submission
      const contactData: Omit<
        ProjectContact,
        "id" | "created_at" | "updated_at"
      > = {
        name: formData.name.trim(),
        company: formData.company.trim() || undefined,
        contact_type: formData.contact_type as ProjectContact["contact_type"],
        project_id: formData.project_id,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      };

      // Create the contact using optimistic updates
      await addContact(contactData);

      // Close the panel on success
      closePanel();
    } catch (error) {
      console.error("Failed to create contact:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create contact"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormField = (field: (typeof CONTACT_FORM_FIELDS)[0]) => {
    const value = formData[field.key as keyof NewContactFormData];
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

        {field.type === "contact_type_select" && field.options && (
          <Select
            value={String(value)}
            onValueChange={(newValue) => handleInputChange(field.key, newValue)}
          >
            <SelectTrigger className={hasError ? "border-red-500" : ""}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option: string) => {
                const typeConfig =
                  CONTACT_TYPE_META[option as keyof typeof CONTACT_TYPE_META];
                return (
                  <SelectItem key={option} value={option}>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={typeConfig.color}>
                        {typeConfig.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {typeConfig.description}
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
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
                  <div className="flex flex-col">
                    <span>{project.name}</span>
                    {project.address && (
                      <span className="text-xs text-muted-foreground">
                        {project.address}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {field.type === "email" && (
          <Input
            type="email"
            value={String(value)}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={hasError ? "border-red-500" : ""}
          />
        )}

        {field.type === "tel" && (
          <Input
            type="tel"
            value={String(value)}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder}
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
      title="Add New Contact"
      headerActions={<UserPlus className="h-4 w-4" />}
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

        {projects.length === 0 && (
          <div className="p-3 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              No projects available. Please create a project first before adding
              contacts.
            </div>
          </div>
        )}

        <div className="space-y-4">
          {CONTACT_FORM_FIELDS.map(renderFormField)}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isSubmitting || projects.length === 0}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Adding Contact...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Add Contact
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
