import { z } from "zod";

export const curriculumFrameworkSchema = z.object({
  curriculumVersionId: z
    .string()
    .trim()
    .min(1, "Please select a curriculum version."),

  name: z
    .string()
    .trim()
    .min(2, "Framework name must contain at least 2 characters.")
    .max(160, "Framework name must not exceed 160 characters."),

  code: z
    .string()
    .trim()
    .max(50, "Framework code must not exceed 50 characters.")
    .optional(),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(160, "Slug must not exceed 160 characters.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug may only contain lowercase letters, numbers, and hyphens.",
    ),

  description: z
    .string()
    .trim()
    .max(1500, "Description must not exceed 1,500 characters.")
    .optional(),

  sequence: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return Number(value);
  }, z.number().int("Sequence must be a whole number.").min(1, "Sequence must be at least 1.").nullable()),
});

export const curriculumFrameworkIdSchema = z.object({
  curriculumFrameworkId: z
    .string()
    .trim()
    .min(1, "A valid curriculum framework is required."),
});

export type CurriculumFrameworkInput = z.infer<
  typeof curriculumFrameworkSchema
>;
