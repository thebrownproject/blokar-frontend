"use client";

import { ContactCard } from "./contact-card";
import type { ContactWithProject } from "@/hooks/contacts-context";

interface ContactsGridProps {
  contacts: ContactWithProject[];
  isLoading: boolean;
  error: string | null;
}

export function ContactsGrid({
  contacts,
  isLoading,
  error,
}: ContactsGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-xl border shadow-sm p-6 animate-pulse"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-4 w-4 bg-muted rounded" />
              <div className="h-6 w-32 bg-muted rounded" />
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-2/3 bg-muted rounded" />
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded" />
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-2">Error loading contacts</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
        <p className="text-muted-foreground">
          Get started by adding your first contact.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 auto-fit-cards">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
}
