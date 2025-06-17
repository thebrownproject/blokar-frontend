export interface Project {
  id: string;
  address: string;
  suburb: string;
  state: string;
  type: string;
  classification: string;
  status: string;
  daApproved: boolean;
  council: string;
  urgentItems: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  description: string;
}

export interface ProjectSubItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  description: string;
}

export type BuildingClassification =
  | "Class 1a"
  | "Class 1b"
  | "Class 2"
  | "Class 3"
  | "Class 5"
  | "Class 6"
  | "Class 7a"
  | "Class 7b"
  | "Class 8"
  | "Class 9a"
  | "Class 9b"
  | "Class 9c"
  | "Class 10a"
  | "Class 10b"
  | "Class 10c";

export type ProjectStatus =
  | "DA Approved"
  | "CC In Progress"
  | "Review Required";
