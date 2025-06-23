// Supabase types and interfaces

export interface Project {
  id: string;
  name: string;
  description?: string;
  status?: string;
  user_id: string;
  organization_id?: string;
  address: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  // Additional project fields
  building_class?: string;
  project_type?: string;
  project_scale?: string;
  progress?: number;
  council_name?: string;
  council_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  project_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  task_type?: string;
  status: string;
  priority: string;
  due_date?: string;
  completed_at?: string;
  assigned_to?: string;
  assignee?: string;
  progress?: number;
  estimated_hours?: number;
  notes?: string;
  project_id?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  project_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
