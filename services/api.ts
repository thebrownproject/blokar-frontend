import { ContactType } from "@/types/contacts";
import { TaskType, TaskStatus } from "@/types/tasks";
import { DocumentCategory } from "@/types/documents";

const API_BASE_URL = "http://127.0.0.1:8000";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  professional_type: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  company_name: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    professional_type: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

// Project-related interfaces based on confirmed backend schema
export interface Project {
  id: string;
  name: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  building_class: string; // "1a", "1b", "2", "3", "5", "8", etc.
  project_type: string; // "residential", "commercial", "industrial"
  project_scale: string; // "small", "medium", "large"
  status: string; // "planning", "approved", "construction", "complete"
  progress: number; // 0-100 percentage
  council_name?: string;
  council_contact?: string;
  organization_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectContact {
  id: string;
  project_id: string;
  contact_type: ContactType; // "council", "engineer", "contractor", etc.
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  notes?: string;
  created_at: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  task_type: TaskType; // "compliance", "approval", "inspection", etc.
  status: TaskStatus; // "pending", "in_progress", "completed"
  due_date?: string;
  completed_at?: string;
  assigned_to?: string;
  created_at: string;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  filename: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  document_category?: DocumentCategory; // Proper typed category
  content_text?: string;
  processed_at?: string;
  created_at: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available and not a login/refresh request
    if (
      !endpoint.includes("/auth/login") &&
      !endpoint.includes("/auth/refresh")
    ) {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      console.log(`Making API request to: ${url}`, {
        method: config.method,
        headers: config.headers,
      });
      const response = await fetch(url, config);
      console.log(`API response status: ${response.status}`, response);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          // If response isn't JSON, try to get text
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            // Keep the HTTP status as fallback
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);

      // Improve error message handling
      if (error instanceof Error) {
        throw error;
      } else if (typeof error === "string") {
        throw new Error(error);
      } else {
        // Handle non-Error objects that might be thrown
        throw new Error("API request failed: Unknown error");
      }
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    return this.request<RefreshTokenResponse>("/api/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  async getCurrentUser(): Promise<UserProfile> {
    return this.request<UserProfile>("/api/v1/auth/me");
  }

  async logout(): Promise<void> {
    return this.request<void>("/api/v1/auth/logout", {
      method: "POST",
    });
  }

  // Project endpoints
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>("/api/v1/projects/");
  }

  async getProject(id: string): Promise<Project> {
    return this.request<Project>(`/api/v1/projects/${id}`);
  }

  async getProjectContacts(projectId: string): Promise<ProjectContact[]> {
    return this.request<ProjectContact[]>(
      `/api/v1/contacts/projects/${projectId}`
    );
  }

  async getProjectTasks(projectId: string): Promise<ProjectTask[]> {
    return this.request<ProjectTask[]>(`/api/v1/tasks/projects/${projectId}`);
  }

  async getProjectDocuments(projectId: string): Promise<ProjectDocument[]> {
    const response = await this.request<{
      success: boolean;
      data: ProjectDocument[];
      count: number;
      message: string;
    }>(`/api/v1/documents/?project_id=${projectId}`);

    return response.data || [];
  }

  async uploadProjectDocument(
    projectId: string,
    file: File,
    documentCategory?: string,
    onProgress?: (progress: number) => void
  ): Promise<ProjectDocument> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("project_id", projectId);
    if (documentCategory) {
      formData.append("document_category", documentCategory);
    }

    const url = `${this.baseURL}/api/v1/documents/upload`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Upload progress tracking
      if (onProgress) {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(Math.round(progress));
          }
        });
      }

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            // Extract document from wrapped response
            if (response.success && response.data) {
              resolve(response.data);
            } else {
              resolve(response);
            }
          } catch {
            reject(new Error("Invalid response format"));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(
              new Error(
                errorData.detail || errorData.message || `HTTP ${xhr.status}`
              )
            );
          } catch {
            reject(new Error(`HTTP ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      // IMPORTANT: Open the request first
      xhr.open("POST", url);

      // THEN add auth token if available
      const token = localStorage.getItem("access_token");
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      // FINALLY send the request
      xhr.send(formData);
    });
  }

  async deleteProjectDocument(documentId: string): Promise<void> {
    return this.request<void>(`/api/v1/documents/${documentId}`, {
      method: "DELETE",
    });
  }

  async getDocumentUrl(documentId: string): Promise<{ url: string }> {
    return this.request<{ url: string }>(`/api/v1/documents/${documentId}/url`);
  }
}

export const apiClient = new ApiClient();
