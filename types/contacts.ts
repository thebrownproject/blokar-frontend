/**
 * Contact types for BuildSpec.io project management
 * Matches backend schema and provides type safety for contact components
 */

export type ContactType = "council" | "engineer" | "contractor" | "consultant";

export interface ProjectContact {
  id: string;
  project_id: string;
  contact_type: ContactType;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  notes?: string;
  created_at: string;
}

export interface ContactCardProps {
  contact: ProjectContact;
  onEmailClick?: (email: string) => void;
  onPhoneClick?: (phone: string) => void;
  onChatClick?: (contact: ProjectContact) => void;
}

export interface ContactsListProps {
  projectId: string;
  filterType?: ContactType | "all";
  searchQuery?: string;
}

export interface ContactFilterProps {
  selectedType: ContactType | "all";
  onTypeChange: (type: ContactType | "all") => void;
  contactCounts: Record<ContactType, number>;
}

// Contact type metadata for UI rendering
export const CONTACT_TYPE_META: Record<
  ContactType,
  {
    label: string;
    color: string;
    icon: string;
    description: string;
  }
> = {
  council: {
    label: "Council",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: "Building2",
    description: "Local government authorities and planning officers",
  },
  engineer: {
    label: "Engineer",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: "Calculator",
    description: "Structural, civil, and services engineers",
  },
  contractor: {
    label: "Contractor",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    icon: "HardHat",
    description: "Main contractors and construction specialists",
  },
  consultant: {
    label: "Consultant",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    icon: "Users",
    description: "Building surveyors, certifiers, and advisory specialists",
  },
};

export const CONTACT_TYPE_OPTIONS: Array<{
  value: ContactType | "all";
  label: string;
}> = [
  { value: "all", label: "All Contacts" },
  { value: "council", label: "Council" },
  { value: "engineer", label: "Engineers" },
  { value: "contractor", label: "Contractors" },
  { value: "consultant", label: "Consultants" },
];
