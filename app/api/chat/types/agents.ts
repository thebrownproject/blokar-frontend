// ============================================================================
// BLOKAR AI AGENT SYSTEM - TYPE DEFINITIONS
// ============================================================================
// This file defines TypeScript interfaces for our multi-agent architecture.
//
// LEARNING NOTES:
// - Intent classification helps route user requests to appropriate agents
// - Agent responses contain both data and metadata for logging/debugging
// - Tool results can be either strings or structured data
// ============================================================================

import { z } from "zod";

// ============================================================================
// INTENT CLASSIFICATION TYPES
// ============================================================================

/**
 * LEARNING: Intent classification is the first step in multi-agent systems
 * The Master Agent analyzes user input to determine which domain agent should handle the request
 */
export type UserIntent =
  | "project-listing" // "Show me all projects"
  | "project-retrieval" // "Show me the Harbor project"
  | "project-creation" // "Create a new building project"
  | "project-update" // "Update the status of project X"
  | "project-deletion" // "Delete the abandoned project"
  | "ui-interaction" // "Clear the screen" or "Show project card"
  | "general-inquiry" // "How does Blokar work?"
  | "unknown"; // Fallback for unclear requests

/**
 * LEARNING: Intent classification result includes confidence score
 * This helps us handle uncertain classifications gracefully
 */
export interface IntentClassification {
  intent: UserIntent;
  confidence: number; // 0-1, how certain we are about the classification
  reasoning: string; // Why this intent was chosen (for debugging)
  entities?: string[]; // Key information extracted from user message
  extractedEntities?: {
    // Key information extracted from user message
    projectName?: string;
    projectId?: string;
    status?: string;
    [key: string]: unknown;
  };
}

// ============================================================================
// AGENT COMMUNICATION TYPES
// ============================================================================

/**
 * LEARNING: Standardized agent response format
 * All agents return this structure for consistent handling
 */
export interface AgentResponse {
  success: boolean;
  data?: Record<string, unknown>; // The actual result (projects, confirmation, etc.)
  message: string; // Human-readable message
  metadata?: {
    // Optional debugging/logging info
    agent: string;
    processingTime?: number;
    toolsUsed?: string[];
    confidence?: number;
    [key: string]: unknown;
  };
  suggestions?: string[]; // Optional next actions for the user
}

/**
 * LEARNING: Context passed between agents
 * Contains all information needed for agents to make informed decisions
 */
export interface AgentContext {
  userMessage: string;
  intent: IntentClassification;
  conversationHistory?: Array<{ role: string; content: string }>; // Previous messages for context
  userId?: string; // For RLS and personalization
  organizationId?: string; // For multi-tenant data access
}

// ============================================================================
// TOOL EXECUTION TYPES
// ============================================================================

/**
 * LEARNING: Tool results can be various types
 * We use a union type to handle different return formats
 */
export type ToolResult = string | Record<string, unknown> | null;

/**
 * LEARNING: Tool execution context
 * Provides tools with access to database and user information
 */
export interface ToolContext {
  supabase: unknown; // Supabase client for database operations
  userId?: string; // Current user for RLS
  organizationId?: string; // Organization context
}

// ============================================================================
// PROJECT-SPECIFIC TYPES
// ============================================================================

/**
 * LEARNING: Zod schemas for validation
 * These ensure tool parameters are correctly typed and validated
 */

// Project creation parameters
export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  address: z.string().min(1, "Address is required"),
  project_type: z.string().min(1, "Project type is required"),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  building_class: z.string().optional(),
  project_scale: z.string().optional(),
  status: z.string().default("planning"),
});

// Project update parameters
export const UpdateProjectSchema = z.object({
  id: z.string().uuid("Invalid project ID"),
  name: z.string().optional(),
  status: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  address: z.string().optional(),
  // ... other updatable fields
});

// Project search parameters
export const SearchProjectSchema = z.object({
  identifier: z.string().min(1, "Search identifier is required"),
  searchType: z.enum(["id", "name", "auto"]).default("auto"),
});

// Export Zod schema types for use in tools
export type CreateProjectParams = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectParams = z.infer<typeof UpdateProjectSchema>;
export type SearchProjectParams = z.infer<typeof SearchProjectSchema>;

// ============================================================================
// MASTER AGENT TYPES
// ============================================================================

/**
 * LEARNING: Master Agent configuration
 * Defines how the Master Agent routes requests to domain agents
 */
export interface MasterAgentConfig {
  confidenceThreshold: number; // Minimum confidence for intent classification
  maxRetries: number; // Max retry attempts for failed operations
  enableLogging: boolean; // Whether to log agent interactions
  fallbackToGeneral: boolean; // Whether to fallback to general responses
}

// Default configuration for the Master Agent
export const DEFAULT_MASTER_CONFIG: MasterAgentConfig = {
  confidenceThreshold: 0.7,
  maxRetries: 2,
  enableLogging: true,
  fallbackToGeneral: true,
};
