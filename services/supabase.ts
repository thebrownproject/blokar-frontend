// Supabase types and interfaces

export interface Project {
  id: string;
  name: string;
  description?: string;
  status?: string;
  user_id: string;
  address: string;
  suburb?: string;
  state?: string;
  postcode?: string;
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
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  due_date?: string;
  project_id?: string;
  user_id: string;
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
