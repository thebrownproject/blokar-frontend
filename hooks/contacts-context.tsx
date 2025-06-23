"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "./use-user";
import type { ProjectContact } from "@/types/contacts";

// Create client outside to ensure it's stable
const supabase = createClient();

// Extended Contact interface with project name for display
export interface ContactWithProject extends ProjectContact {
  project_name?: string;
}

// Type for contact data from Supabase with joined project
interface ContactFromDB extends ProjectContact {
  projects?: { name: string } | null;
}

interface ContactsContextType {
  contacts: ContactWithProject[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateContact: (contactId: string, updates: Partial<ProjectContact>) => void;
  addContact: (
    contactData: Omit<ProjectContact, "id" | "created_at">
  ) => Promise<ProjectContact>;
  deleteContact: (contactId: string) => Promise<void>;
}

const ContactsContext = createContext<ContactsContextType | undefined>(
  undefined
);

export function ContactsProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<ContactWithProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: userLoading } = useUser();

  // Fetch contacts function with project names
  const fetchContacts = useCallback(async () => {
    // Wait for user loading to complete
    if (userLoading) return;

    // Only fetch if user is authenticated
    if (!user) {
      setContacts([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("project_contacts")
        .select(
          `
          *,
          projects!project_contacts_project_id_fkey(name)
        `
        )
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;

      // Transform data to include project name
      const contactsWithProjects = (data || []).map(
        (contact: ContactFromDB) => ({
          ...contact,
          project_name: contact.projects?.name || "No Project",
        })
      );

      setContacts(contactsWithProjects);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch contacts"
      );
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, userLoading]);

  // Initial fetch effect
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Refetch function for manual updates
  const refetch = useCallback(async () => {
    if (!user) {
      setContacts([]);
      return;
    }

    try {
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from("project_contacts")
        .select(
          `
          *,
          projects!project_contacts_project_id_fkey(name)
        `
        )
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;

      // Transform data to include project name
      const contactsWithProjects = (data || []).map(
        (contact: ContactFromDB) => ({
          ...contact,
          project_name: contact.projects?.name || "No Project",
        })
      );

      setContacts(contactsWithProjects);
    } catch (error) {
      console.error("Failed to refetch contacts:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch contacts"
      );
    }
  }, [user]);

  // Optimistic update function for immediate UI feedback
  const updateContact = useCallback(
    (contactId: string, updates: Partial<ProjectContact>) => {
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === contactId ? { ...contact, ...updates } : contact
        )
      );
    },
    []
  );

  // Optimistic add contact function for new contact creation
  const addContact = useCallback(
    async (
      contactData: Omit<ProjectContact, "id" | "created_at">
    ): Promise<ProjectContact> => {
      if (!user) {
        throw new Error("User must be authenticated to create contacts");
      }

      // Generate temporary ID for optimistic update
      const tempId = crypto.randomUUID();
      const now = new Date().toISOString();

      // Create optimistic contact with temporary ID
      const optimisticContact: ContactWithProject = {
        id: tempId,
        created_at: now,
        project_name: "Loading...",
        ...contactData,
      };

      // Optimistically add to UI immediately
      setContacts((prevContacts) => [optimisticContact, ...prevContacts]);

      try {
        // Save to database
        const { data, error: supabaseError } = await supabase
          .from("project_contacts")
          .insert(contactData)
          .select(
            `
            *,
            projects!project_contacts_project_id_fkey(name)
          `
          )
          .single();

        if (supabaseError) throw supabaseError;

        // Transform and replace optimistic contact with real data from database
        const contactWithProject = {
          ...data,
          project_name: data.projects?.name || "No Project",
        };

        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id === tempId ? contactWithProject : contact
          )
        );

        return data;
      } catch (error) {
        // Remove optimistic contact on error
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => contact.id !== tempId)
        );
        throw error;
      }
    },
    [user]
  );

  // Optimistic delete contact function for contact deletion
  const deleteContact = useCallback(
    async (contactId: string): Promise<void> => {
      if (!user) {
        throw new Error("User must be authenticated to delete contacts");
      }

      // Store the contact for potential restoration on error
      const contactToDelete = contacts.find((c) => c.id === contactId);
      if (!contactToDelete) {
        throw new Error("Contact not found");
      }

      // Optimistically remove from UI immediately
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.id !== contactId)
      );

      try {
        // Delete from database
        const { error: supabaseError } = await supabase
          .from("project_contacts")
          .delete()
          .eq("id", contactId);

        if (supabaseError) throw supabaseError;

        // Success - contact already removed optimistically
      } catch (error) {
        // Restore contact on error
        setContacts((prevContacts) => {
          const contactExists = prevContacts.some((c) => c.id === contactId);
          if (!contactExists) {
            return [contactToDelete, ...prevContacts];
          }
          return prevContacts;
        });
        throw error;
      }
    },
    [user, contacts]
  );

  const value: ContactsContextType = {
    contacts,
    isLoading,
    error,
    refetch,
    updateContact,
    addContact,
    deleteContact,
  };

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
}

export function useContactsContext() {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error(
      "useContactsContext must be used within a ContactsProvider"
    );
  }
  return context;
}
