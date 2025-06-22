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
import { useProjects } from "@/hooks/use-projects";
import { AlertTriangle, Trash2 } from "lucide-react";
import type { Project } from "@/services/supabase";

interface DeleteProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
}: DeleteProjectDialogProps) {
  const { deleteProject } = useProjects();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!project) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteProject(project.id);
      // Close dialog on successful deletion
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete project:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete project"
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

  if (!project) return null;

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
                Delete Project
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-left space-y-2">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{project.name}&rdquo;
              </span>
              ?
            </p>
            <p className="text-sm">
              This action cannot be undone. This will permanently delete the
              project and all of its associated data including:
            </p>
            <ul className="text-sm list-disc list-inside pl-2 space-y-1">
              <li>Project details and settings</li>
              <li>All tasks and to-dos</li>
              <li>Uploaded documents and files</li>
              <li>Contact information</li>
              <li>Chat history and AI conversations</li>
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
                Delete Project
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
