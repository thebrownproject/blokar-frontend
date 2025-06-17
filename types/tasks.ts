/**
 * Task types for BuildSpec.io project management
 * Matches backend schema and provides type safety for task components
 */

export type TaskType =
  | "compliance"
  | "approval"
  | "inspection"
  | "milestone"
  | "permit"
  | "review";

export type TaskStatus = "pending" | "in_progress" | "completed";

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  task_type: TaskType;
  status: TaskStatus;
  due_date?: string;
  completed_at?: string;
  assigned_to?: string;
  created_at: string;
}

export interface TaskCardProps {
  task: ProjectTask;
  onStatusUpdate?: (taskId: string, status: TaskStatus) => void;
  onEditClick?: (task: ProjectTask) => void;
  onMoreClick?: (task: ProjectTask) => void;
}

export interface TasksListProps {
  projectId: string;
  filterType?: TaskType | "all";
  filterStatus?: TaskStatus | "all";
  searchQuery?: string;
}

export interface TaskFilterProps {
  selectedType: TaskType | "all";
  selectedStatus: TaskStatus | "all";
  onTypeChange: (type: TaskType | "all") => void;
  onStatusChange: (status: TaskStatus | "all") => void;
  taskCounts: Record<TaskType, number>;
  statusCounts: Record<TaskStatus, number>;
}

// Task type metadata for UI rendering
export const TASK_TYPE_META: Record<
  TaskType,
  {
    label: string;
    color: string;
    icon: string;
    description: string;
  }
> = {
  compliance: {
    label: "Compliance",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: "Shield",
    description: "NCC compliance, building code requirements",
  },
  approval: {
    label: "Approval",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: "CheckCircle",
    description: "Development applications, planning permits",
  },
  inspection: {
    label: "Inspection",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    icon: "Eye",
    description: "Council inspections, engineer inspections",
  },
  milestone: {
    label: "Milestone",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    icon: "Flag",
    description: "Project deliverables and key dates",
  },
  permit: {
    label: "Permit",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: "FileText",
    description: "Building permits, construction certificates",
  },
  review: {
    label: "Review",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    icon: "BookOpen",
    description: "Professional reviews and certifications",
  },
};

// Task status metadata for UI rendering
export const TASK_STATUS_META: Record<
  TaskStatus,
  {
    label: string;
    color: string;
    icon: string;
    description: string;
  }
> = {
  pending: {
    label: "Pending",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    icon: "Clock",
    description: "Awaiting action or completion",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: "Play",
    description: "Currently being worked on",
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: "Check",
    description: "Successfully completed",
  },
};

export const TASK_TYPE_OPTIONS: Array<{
  value: TaskType | "all";
  label: string;
}> = [
  { value: "all", label: "All Tasks" },
  { value: "compliance", label: "Compliance" },
  { value: "approval", label: "Approvals" },
  { value: "inspection", label: "Inspections" },
  { value: "milestone", label: "Milestones" },
  { value: "permit", label: "Permits" },
  { value: "review", label: "Reviews" },
];

export const TASK_STATUS_OPTIONS: Array<{
  value: TaskStatus | "all";
  label: string;
}> = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];
