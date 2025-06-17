/**
 * Document types for BuildSpec.io professional document management
 * Matches backend schema and provides type safety for document components
 * Australian construction industry focused
 */

export type DocumentCategory =
  | "architectural_plans"
  | "structural_plans"
  | "services_plans"
  | "specifications"
  | "permits_approvals"
  | "reports"
  | "compliance_docs"
  | "photos_media"
  | "correspondence"
  | "contracts";

export type DocumentStatus = "processing" | "ready" | "error" | "archived";

export interface ProjectDocument {
  id: string;
  project_id: string;
  filename: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  document_category?: DocumentCategory;
  content_text?: string;
  processed_at?: string;
  created_at: string;
}

export interface DocumentCardProps {
  document: ProjectDocument;
  onViewClick?: (document: ProjectDocument) => void;
  onDownloadClick?: (document: ProjectDocument) => void;
  onDeleteClick?: (document: ProjectDocument) => void;
  onCategorizeClick?: (document: ProjectDocument) => void;
}

export interface DocumentsListProps {
  projectId: string;
  filterCategory?: DocumentCategory | "all";
  searchQuery?: string;
}

export interface DocumentFilterProps {
  selectedCategory: DocumentCategory | "all";
  onCategoryChange: (category: DocumentCategory | "all") => void;
  documentCounts: Record<DocumentCategory, number>;
}

export interface FileUploadProps {
  projectId: string;
  onUploadSuccess?: (documents: ProjectDocument[]) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  maxSizeBytes?: number;
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

// Document category metadata for UI rendering (Australian construction industry)
export const DOCUMENT_CATEGORY_META: Record<
  DocumentCategory,
  {
    label: string;
    color: string;
    icon: string;
    description: string;
    acceptedTypes: string[];
  }
> = {
  architectural_plans: {
    label: "Architectural Plans",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: "Blueprint",
    description:
      "Floor plans, elevations, sections, and architectural drawings",
    acceptedTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/dwg",
    ],
  },
  structural_plans: {
    label: "Structural Plans",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: "Building",
    description: "Structural drawings, calculations, and engineering plans",
    acceptedTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/dwg",
    ],
  },
  services_plans: {
    label: "Services Plans",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: "Zap",
    description: "Electrical, plumbing, HVAC, and services drawings",
    acceptedTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/dwg",
    ],
  },
  specifications: {
    label: "Specifications",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    icon: "FileText",
    description:
      "Technical specifications, product schedules, and material specs",
    acceptedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ],
  },
  permits_approvals: {
    label: "Permits & Approvals",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: "Shield",
    description:
      "Development applications, building permits, construction certificates",
    acceptedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
  reports: {
    label: "Reports",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    icon: "BookOpen",
    description: "Engineering reports, soil tests, compliance reports",
    acceptedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
  compliance_docs: {
    label: "Compliance Documents",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: "CheckCircle",
    description: "NCC compliance, accessibility reports, safety documentation",
    acceptedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
  photos_media: {
    label: "Photos & Media",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    icon: "Camera",
    description: "Site photos, progress images, video documentation",
    acceptedTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/mov",
    ],
  },
  correspondence: {
    label: "Correspondence",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: "Mail",
    description: "Emails, letters, meeting notes, communication records",
    acceptedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ],
  },
  contracts: {
    label: "Contracts",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: "FileContract",
    description:
      "Construction contracts, subcontractor agreements, legal documents",
    acceptedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
};

export const DOCUMENT_CATEGORY_OPTIONS: Array<{
  value: DocumentCategory | "all";
  label: string;
}> = [
  { value: "all", label: "All Documents" },
  { value: "architectural_plans", label: "Architectural Plans" },
  { value: "structural_plans", label: "Structural Plans" },
  { value: "services_plans", label: "Services Plans" },
  { value: "specifications", label: "Specifications" },
  { value: "permits_approvals", label: "Permits & Approvals" },
  { value: "reports", label: "Reports" },
  { value: "compliance_docs", label: "Compliance Documents" },
  { value: "photos_media", label: "Photos & Media" },
  { value: "correspondence", label: "Correspondence" },
  { value: "contracts", label: "Contracts" },
];

// File type validation for construction industry
export const ACCEPTED_FILE_TYPES = {
  // Images for photos and plans
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],

  // Documents
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/plain": [".txt"],

  // Spreadsheets for schedules and estimates
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],

  // CAD files (note: these may need special handling)
  "application/dwg": [".dwg"],
  "application/dxf": [".dxf"],

  // Video for site documentation
  "video/mp4": [".mp4"],
  "video/quicktime": [".mov"],
};

// Utility functions
export const getFileIcon = (mimeType?: string): string => {
  if (!mimeType) return "File";

  if (mimeType.startsWith("image/")) return "Image";
  if (mimeType.startsWith("video/")) return "Video";
  if (mimeType === "application/pdf") return "FileText";
  if (mimeType.includes("word")) return "FileText";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
    return "Calculator";
  if (mimeType.includes("dwg") || mimeType.includes("dxf")) return "Blueprint";

  return "File";
};

export const formatFileSize = (bytes?: number): string => {
  if (!bytes || bytes === 0) return "0 B";

  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`;
};

export const getCategoryFromFileName = (
  filename: string
): DocumentCategory | undefined => {
  const lowerName = filename.toLowerCase();

  if (
    lowerName.includes("architect") ||
    lowerName.includes("floor") ||
    lowerName.includes("plan")
  ) {
    return "architectural_plans";
  }
  if (lowerName.includes("structural") || lowerName.includes("engineer")) {
    return "structural_plans";
  }
  if (
    lowerName.includes("electrical") ||
    lowerName.includes("plumbing") ||
    lowerName.includes("hvac")
  ) {
    return "services_plans";
  }
  if (lowerName.includes("spec") || lowerName.includes("schedule")) {
    return "specifications";
  }
  if (
    lowerName.includes("permit") ||
    lowerName.includes("approval") ||
    lowerName.includes("certificate")
  ) {
    return "permits_approvals";
  }
  if (lowerName.includes("report") || lowerName.includes("test")) {
    return "reports";
  }
  if (lowerName.includes("compliance") || lowerName.includes("ncc")) {
    return "compliance_docs";
  }
  if (
    lowerName.includes("photo") ||
    lowerName.includes("image") ||
    lowerName.includes("site")
  ) {
    return "photos_media";
  }
  if (
    lowerName.includes("email") ||
    lowerName.includes("letter") ||
    lowerName.includes("correspondence")
  ) {
    return "correspondence";
  }
  if (lowerName.includes("contract") || lowerName.includes("agreement")) {
    return "contracts";
  }

  return undefined;
};
