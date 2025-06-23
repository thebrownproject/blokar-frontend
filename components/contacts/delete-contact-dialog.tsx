"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useContacts } from "@/hooks/use-contacts";
import { AlertTriangle, Trash2 } from "lucide-react";
import type { ContactWithProject } from "@/hooks/contacts-context";

interface DeleteContactDialogProps {
  contact: ContactWithProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteContactDialog({
  contact,
  open,
  onOpenChange,
}: DeleteContactDialogProps) {
  const { deleteContact } = useContacts();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!contact) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteContact(contact.id);
      // Close dialog on successful deletion
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete contact:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete contact"
      );
      // Keep dialog open on error to allow retry
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (!isDeleting) {
      setError(null);
      onOpenChange(false);
    }
  };

  if (!contact) return null;

  const displayName = contact.company
    ? `${contact.name} (${contact.company})`
    : contact.name;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">
                Delete Contact
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-left space-y-2">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{displayName}&rdquo;
              </span>
              ?
            </p>
            <p className="text-sm">
              This action cannot be undone. This will permanently delete the
              contact and all of its associated data including:
            </p>
            <ul className="text-sm list-disc list-inside pl-2 space-y-1">
              <li>Contact details and information</li>
              <li>Company and contact type</li>
              <li>Email and phone information</li>
              <li>Project associations and notes</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 dark:bg-red-950 dark:border-red-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Contact
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
