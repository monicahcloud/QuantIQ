import { z } from "zod";

export const educationLevelCodeSchema = z.enum([
  "PRESCHOOL",
  "PRIMARY",
  "HIGH_SCHOOL",
]);

export const educationLevelSchema = z.object({
  countryId: z.string().trim().min(1, "Please select a country."),

  name: z
    .string()
    .trim()
    .min(2, "Education level name must contain at least 2 characters.")
    .max(100, "Education level name must not exceed 100 characters."),

  code: educationLevelCodeSchema,

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug may only contain lowercase letters, numbers, and hyphens.",
    ),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters.")
    .optional(),

  sequence: z.coerce
    .number()
    .int("Sequence must be a whole number.")
    .min(1, "Sequence must be at least 1."),
});

export type EducationLevelInput = z.infer<typeof educationLevelSchema>;
