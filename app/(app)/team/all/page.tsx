"use client";

import { useState } from "react";
import { useContacts } from "@/hooks/use-contacts";
import { usePanel } from "@/hooks/use-panel";
import {
  ContactStats,
  ContactsGrid,
  ContactFilters,
} from "@/components/contacts";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { ContactWithProject } from "@/hooks/contacts-context";

export default function AllContactsPage() {
  const { contacts, loading, error } = useContacts();
  const { openPanel } = usePanel();
  const [filteredContacts, setFilteredContacts] = useState<
    ContactWithProject[]
  >([]);

  const handleNewContact = () => {
    openPanel("new-contact", {});
  };

  // Use filtered contacts if filters are applied, otherwise use all contacts
  const displayContacts =
    filteredContacts.length > 0 || filteredContacts === contacts
      ? filteredContacts
      : contacts;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Team Directory</h1>
            <p className="text-muted-foreground">
              View and manage all contacts across your projects
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleNewContact}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Contact
            </Button>
            <div className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${displayContacts.length} contacts`}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Statistics */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Contact Overview</h2>
        <ContactStats contacts={contacts} isLoading={loading} />
      </div>

      {/* Contact Filters */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Filter Contacts</h2>
        <ContactFilters
          contacts={contacts}
          onFilteredContactsChange={setFilteredContacts}
        />
      </div>

      {/* All Contacts Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {filteredContacts.length !== contacts.length
              ? "Filtered Contacts"
              : "All Contacts"}
          </h2>
          {!loading && displayContacts.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {displayContacts.length}{" "}
              {displayContacts.length === 1 ? "contact" : "contacts"}
              {filteredContacts.length !== contacts.length &&
                ` of ${contacts.length} total`}
            </span>
          )}
        </div>
        <ContactsGrid
          contacts={displayContacts}
          isLoading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
