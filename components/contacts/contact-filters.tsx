"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import type { ContactWithProject } from "@/hooks/contacts-context";
import { CONTACT_TYPE_OPTIONS } from "@/types/contacts";

interface ContactFiltersProps {
  contacts: ContactWithProject[];
  onFilteredContactsChange: (filteredContacts: ContactWithProject[]) => void;
}

export function ContactFilters({
  contacts,
  onFilteredContactsChange,
}: ContactFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedContactType, setSelectedContactType] = useState<string>("all");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");

  // Get unique values for filters
  const uniqueProjects = Array.from(
    new Set(contacts.map((contact) => contact.project_name).filter(Boolean))
  ).sort();

  const uniqueCompanies = Array.from(
    new Set(contacts.map((contact) => contact.company).filter(Boolean))
  ).sort();

  // Apply filters
  const applyFilters = () => {
    let filtered = contacts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Project filter
    if (selectedProject !== "all") {
      filtered = filtered.filter(
        (contact) => contact.project_name === selectedProject
      );
    }

    // Contact type filter
    if (selectedContactType !== "all") {
      filtered = filtered.filter(
        (contact) => contact.contact_type === selectedContactType
      );
    }

    // Company filter
    if (selectedCompany !== "all") {
      filtered = filtered.filter(
        (contact) => contact.company === selectedCompany
      );
    }

    onFilteredContactsChange(filtered);
  };

  // Apply filters whenever any filter changes
  React.useEffect(() => {
    applyFilters();
  }, [
    searchTerm,
    selectedProject,
    selectedContactType,
    selectedCompany,
    contacts,
  ]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedProject("all");
    setSelectedContactType("all");
    setSelectedCompany("all");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedProject !== "all" ||
    selectedContactType !== "all" ||
    selectedCompany !== "all";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts by name, company, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-3">
            {/* Project Filter */}
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {uniqueProjects.map((project) => (
                  <SelectItem key={project} value={project!}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Contact Type Filter */}
            <Select
              value={selectedContactType}
              onValueChange={setSelectedContactType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select contact type" />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Company Filter */}
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {uniqueCompanies.map((company) => (
                  <SelectItem key={company} value={company!}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Filter className="h-3 w-3" />
                Active filters:
              </span>
              {searchTerm && (
                <Badge variant="secondary">
                  Search: &quot;{searchTerm}&quot;
                </Badge>
              )}
              {selectedProject !== "all" && (
                <Badge variant="secondary">Project: {selectedProject}</Badge>
              )}
              {selectedContactType !== "all" && (
                <Badge variant="secondary">
                  Type:{" "}
                  {
                    CONTACT_TYPE_OPTIONS.find(
                      (opt) => opt.value === selectedContactType
                    )?.label
                  }
                </Badge>
              )}
              {selectedCompany !== "all" && (
                <Badge variant="secondary">Company: {selectedCompany}</Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
