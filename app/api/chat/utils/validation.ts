// ============================================================================
// BLOKAR VALIDATION UTILITIES
// ============================================================================
// Zod schemas and validation functions for project management tools
// ============================================================================

import { z } from "zod";

// ============================================================================
// COMMON SCHEMAS
// ============================================================================

export const UUIDSchema = z.string().uuid("Invalid UUID format");

export const NonEmptyStringSchema = z
  .string()
  .min(1, "This field cannot be empty")
  .trim();

export const OptionalStringSchema = z.string().optional().nullable();

// ============================================================================
// PROJECT SCHEMAS
// ============================================================================

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

export const SearchProjectValidationSchema = z.object({
  identifier: NonEmptyStringSchema,
  limit: z.number().min(1).max(50).default(10),
  offset: z.number().min(0).default(0),
});

export const ListProjectsParamsSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  status: z.string().optional(),
  organizationId: UUIDSchema.optional(),
});

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

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
