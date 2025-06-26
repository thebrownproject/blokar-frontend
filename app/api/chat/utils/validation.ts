// ============================================================================
// BLOKAR AI AGENT SYSTEM - VALIDATION UTILITIES
// ============================================================================
// This file contains Zod schemas and validation functions for our multi-agent system.
//
// LEARNING NOTES:
// - Zod provides runtime type safety and validation
// - These schemas ensure tools receive properly formatted data
// - Validation happens before expensive database operations
// ============================================================================

import { z } from "zod";

// ============================================================================
// COMMON VALIDATION SCHEMAS
// ============================================================================

/**
 * LEARNING: UUID validation schema
 * Ensures project IDs are properly formatted UUIDs
 */
export const UUIDSchema = z.string().uuid("Invalid UUID format");

/**
 * LEARNING: Non-empty string validation
 * Many fields require actual content, not just whitespace
 */
export const NonEmptyStringSchema = z
  .string()
  .min(1, "This field cannot be empty")
  .trim();

/**
 * LEARNING: Optional string that can be null or undefined
 * For fields that truly are optional in the database
 */
export const OptionalStringSchema = z.string().optional().nullable();

// ============================================================================
// PROJECT VALIDATION SCHEMAS
// ============================================================================

/**
 * LEARNING: Project creation validation
 * These are the minimum required fields for creating a project
 */
export const CreateProjectValidationSchema = z.object({
  name: NonEmptyStringSchema,
  address: NonEmptyStringSchema,
  project_type: NonEmptyStringSchema,
  suburb: OptionalStringSchema,
  state: OptionalStringSchema,
  postcode: OptionalStringSchema,
  building_class: OptionalStringSchema,
  project_scale: OptionalStringSchema,
  status: z.string().default("planning"),
  progress: z.number().min(0).max(100).default(0),
});

/**
 * LEARNING: Project update validation
 * Only ID is required, all other fields are optional for updates
 */
export const UpdateProjectValidationSchema = z.object({
  id: UUIDSchema,
  name: NonEmptyStringSchema.optional(),
  address: NonEmptyStringSchema.optional(),
  project_type: NonEmptyStringSchema.optional(),
  suburb: OptionalStringSchema,
  state: OptionalStringSchema,
  postcode: OptionalStringSchema,
  building_class: OptionalStringSchema,
  project_scale: OptionalStringSchema,
  status: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
});

/**
 * LEARNING: Project search validation
 * Flexible search that accepts various identifiers
 */
export const SearchProjectValidationSchema = z.object({
  identifier: NonEmptyStringSchema,
  limit: z.number().min(1).max(50).default(10),
  offset: z.number().min(0).default(0),
});

/**
 * LEARNING: Project deletion validation
 * Simple but important - we only need the ID
 */
export const DeleteProjectValidationSchema = z.object({
  id: UUIDSchema,
});

// ============================================================================
// INTENT CLASSIFICATION VALIDATION
// ============================================================================

/**
 * LEARNING: Valid intents for the system
 * This enum defines all possible user intents our system can handle
 */
export const ValidIntentsSchema = z.enum([
  "project-listing",
  "project-retrieval",
  "project-creation",
  "project-update",
  "project-deletion",
  "ui-interaction",
  "general-inquiry",
  "unknown",
]);

/**
 * LEARNING: Intent classification result validation
 * Ensures intent classification returns properly structured data
 */
export const IntentClassificationSchema = z.object({
  intent: ValidIntentsSchema,
  confidence: z.number().min(0).max(1),
  reasoning: NonEmptyStringSchema,
  extractedEntities: z.record(z.any()).optional(),
});

// ============================================================================
// TOOL PARAMETER VALIDATION
// ============================================================================

/**
 * LEARNING: List projects tool parameters
 * Even simple tools benefit from validation
 */
export const ListProjectsParamsSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  status: z.string().optional(),
  organizationId: UUIDSchema.optional(),
});

/**
 * LEARNING: Get project details parameters
 * Support searching by ID or name
 */
export const GetProjectDetailsParamsSchema = z.object({
  identifier: NonEmptyStringSchema,
  includeRelated: z.boolean().default(false), // Include tasks, contacts, etc.
});

// ============================================================================
// VALIDATION HELPER FUNCTIONS
// ============================================================================

/**
 * LEARNING: Generic validation function
 * This helper validates any data against any Zod schema
 * Returns both validation result and formatted errors
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      return { success: false, errors };
    }
    return { success: false, errors: ["Unknown validation error"] };
  }
}

/**
 * LEARNING: UUID validation helper
 * Quick function to check if a string is a valid UUID
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * LEARNING: Safe parse helper
 * Provides a safe way to parse and validate data with better error handling
 */
export function safeParseData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context: string = "data"
): T {
  const result = validateData(schema, data);

  if (!result.success) {
    throw new Error(`Invalid ${context}: ${result.errors.join(", ")}`);
  }

  return result.data;
}

// Schemas are already exported above with 'export const' declarations
// No need for duplicate exports
