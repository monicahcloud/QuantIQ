import { z } from "zod";

export const subjectSchema = z.object({
  countryId: z.string().trim().min(1, "Please select a country."),

  name: z
    .string()
    .trim()
    .min(2, "Subject name must contain at least 2 characters.")
    .max(120, "Subject name must not exceed 120 characters."),

  code: z
    .string()
    .trim()
    .min(2, "Subject code is required.")
    .max(60, "Subject code must not exceed 60 characters.")
    .regex(
      /^[A-Z0-9_]+$/,
      "Subject code may only contain uppercase letters, numbers, and underscores.",
    ),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(120, "Slug must not exceed 120 characters.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug may only contain lowercase letters, numbers, and hyphens.",
    ),

  description: z
    .string()
    .trim()
    .max(750, "Description must not exceed 750 characters.")
    .optional(),

  sequence: z.coerce
    .number()
    .int("Sequence must be a whole number.")
    .min(1, "Sequence must be at least 1."),
});

export type SubjectInput = z.infer<typeof subjectSchema>;
