"use client";

import { useState, useEffect } from "react";
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
import { createClient } from "@/utils/supabase/client";
import {
  UserPen,
  Save,
  X,
  Edit2,
  Calendar,
  User,
  Building,
  Building2,
  Mail,
  Phone,
  FileText,
  UserCheck,
  Trash2,
} from "lucide-react";
import { DeleteContactDialog } from "../../contacts/delete-contact-dialog";
import type { ContactWithProject } from "@/hooks/contacts-context";
import { CONTACT_TYPE_META } from "@/types/contacts";

interface EditContactPanelProps {
  data?: { contactId: string } | Record<string, unknown>;
}

interface EditingState {
  [key: string]: boolean;
}

interface EditValues {
  [key: string]: string | number;
}

const supabase = createClient();

// Field configuration for rendering
const CONTACT_FIELDS = [
  {
    key: "name",
    label: "Full Name",
    type: "text",
    required: true,
    icon: User,
    editable: true,
  },
  {
    key: "company",
    label: "Company",
    type: "text",
    required: false,
    icon: Building,
    editable: true,
  },
  {
    key: "contact_type",
    label: "Contact Type",
    type: "contact_type_select",
    required: true,
    icon: UserCheck,
    editable: true,
    options: ["council", "engineer", "contractor", "consultant"],
  },
  {
    key: "project_name",
    label: "Project",
    type: "project_select",
    required: false,
    icon: Building2,
    editable: true,
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    required: false,
    icon: Mail,
    editable: true,
  },
  {
    key: "phone",
    label: "Phone",
    type: "tel",
    required: false,
    icon: Phone,
    editable: true,
  },
  {
    key: "notes",
    label: "Notes",
    type: "textarea",
    required: false,
    icon: FileText,
    editable: true,
  },
  {
    key: "created_at",
    label: "Added",
    type: "display",
    required: false,
    icon: Calendar,
    editable: false,
  },
];

export function EditContactPanel({ data }: EditContactPanelProps) {
  const { contacts, refetch, updateContact } = useContacts();
  const { projects } = useProjects();
  const [contact, setContact] = useState<ContactWithProject | null>(null);
  const [editing, setEditing] = useState<EditingState>({});
  const [editValues, setEditValues] = useState<EditValues>({});
  const [saving, setSaving] = useState<EditingState>({});
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Find the specific contact
  useEffect(() => {
    const contactId =
      data && typeof data === "object" && "contactId" in data
        ? (data.contactId as string)
        : undefined;
    if (contactId && contacts.length > 0) {
      const foundContact = contacts.find((c) => c.id === contactId);
      if (foundContact) {
        setContact(foundContact);
        // Initialize edit values
        const initialValues: EditValues = {};
        CONTACT_FIELDS.forEach((field) => {
          initialValues[field.key] =
            foundContact[field.key as keyof ContactWithProject] || "";
        });
        setEditValues(initialValues);
      }
    }
  }, [data, contacts]);

  const handleStartEdit = (fieldKey: string) => {
    setEditing((prev) => ({ ...prev, [fieldKey]: true }));
    setEditValues((prev) => ({
      ...prev,
      [fieldKey]: contact?.[fieldKey as keyof ContactWithProject] || "",
    }));
  };

  const handleCancelEdit = (fieldKey: string) => {
    setEditing((prev) => ({ ...prev, [fieldKey]: false }));
    setEditValues((prev) => ({
      ...prev,
      [fieldKey]: contact?.[fieldKey as keyof ContactWithProject] || "",
    }));
  };

  const handleSaveField = async (fieldKey: string) => {
    if (!contact) return;

    setSaving((prev) => ({ ...prev, [fieldKey]: true }));
    setError(null);

    try {
      let fieldValue = editValues[fieldKey];

      // Handle project selection - convert project name back to project_id
      if (fieldKey === "project_name" && fieldValue) {
        const selectedProject = projects.find((p) => p.name === fieldValue);
        if (selectedProject) {
          // We need to update both project_id and project_name
          const updateData = {
            project_id: selectedProject.id,
          };

          // Optimistic update for immediate UI feedback
          updateContact(contact.id, updateData);
          setContact((prev) =>
            prev
              ? { ...prev, ...updateData, project_name: selectedProject.name }
              : null
          );
          setEditing((prev) => ({ ...prev, [fieldKey]: false }));

          // Save to database
          const { error: supabaseError } = await supabase
            .from("project_contacts")
            .update(updateData)
            .eq("id", contact.id);

          if (supabaseError) throw supabaseError;

          // Refetch to ensure all components have latest data
          await refetch();
          return;
        }
      }

      // Handle regular field updates
      fieldValue = String(fieldValue || "");

      const updateData = {
        [fieldKey]: fieldValue,
      };

      // Optimistic update for immediate UI feedback
      updateContact(contact.id, updateData);
      setContact((prev) => (prev ? { ...prev, ...updateData } : null));
      setEditing((prev) => ({ ...prev, [fieldKey]: false }));

      // Save to database
      const { error: supabaseError } = await supabase
        .from("project_contacts")
        .update(updateData)
        .eq("id", contact.id);

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

  const handleDeleteContact = () => {
    setShowDeleteDialog(true);
  };

  const renderFieldValue = (
    field: (typeof CONTACT_FIELDS)[0],
    value: string | number | undefined
  ) => {
    if (!value && value !== 0)
      return <span className="text-muted-foreground italic">Not set</span>;

    if (field.type === "display") {
      return new Date(value as string).toLocaleDateString();
    }

    if (field.key === "contact_type") {
      const contactTypeConfig =
        CONTACT_TYPE_META[value as keyof typeof CONTACT_TYPE_META];
      if (contactTypeConfig) {
        return (
          <Badge variant="secondary" className={contactTypeConfig.color}>
            {contactTypeConfig.label}
          </Badge>
        );
      }
    }

    if (field.key === "email") {
      return (
        <a
          href={`mailto:${value}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {value}
        </a>
      );
    }

    if (field.key === "phone") {
      return (
        <a
          href={`tel:${value}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {value}
        </a>
      );
    }

    return value;
  };

  const renderEditField = (field: (typeof CONTACT_FIELDS)[0]) => {
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

    if (field.type === "contact_type_select" && field.options) {
      return (
        <Select
          value={String(value || "")}
          onValueChange={(newValue) =>
            setEditValues((prev) => ({ ...prev, [field.key]: newValue }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select contact type" />
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
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      );
    }

    if (field.type === "project_select") {
      return (
        <Select
          value={String(value || "")}
          onValueChange={(newValue) =>
            setEditValues((prev) => ({ ...prev, [field.key]: newValue }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No Project</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.name}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (field.type === "email") {
      return (
        <Input
          type="email"
          value={value}
          onChange={(e) =>
            setEditValues((prev) => ({ ...prev, [field.key]: e.target.value }))
          }
          placeholder="Enter email address"
        />
      );
    }

    if (field.type === "tel") {
      return (
        <Input
          type="tel"
          value={value}
          onChange={(e) =>
            setEditValues((prev) => ({ ...prev, [field.key]: e.target.value }))
          }
          placeholder="Enter phone number"
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

  if (!contact) {
    return (
      <ActionPanelCard
        title="Contact Details"
        headerActions={<UserPen className="h-4 w-4" />}
      >
        <div className="p-4 text-center text-muted-foreground">
          {contacts.length === 0 ? "Loading contact..." : "Contact not found"}
        </div>
      </ActionPanelCard>
    );
  }

  return (
    <ActionPanelCard
      title="Contact Details"
      headerActions={<UserPen className="h-4 w-4" />}
    >
      <div className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:text-red-400 dark:border-red-900">
            {error}
          </div>
        )}

        {CONTACT_FIELDS.map((field) => {
          const Icon = field.icon;
          const isEditing = editing[field.key];
          const isSaving = saving[field.key];
          const value = contact[field.key as keyof ContactWithProject];

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
              Permanently delete this contact. This action cannot be undone.
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteContact}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Contact
            </Button>
          </div>
        </div>
      </div>

      <DeleteContactDialog
        contact={contact}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </ActionPanelCard>
  );
}
