import { z } from "zod";

export const gradeLevelSchema = z.object({
  countryId: z.string().trim().min(1, "Please select a country."),

  educationLevelId: z
    .string()
    .trim()
    .min(1, "Please select an education level."),

  name: z
    .string()
    .trim()
    .min(2, "Grade name must contain at least 2 characters.")
    .max(100, "Grade name must not exceed 100 characters."),

  code: z
    .string()
    .trim()
    .min(2, "Grade code is required.")
    .max(50, "Grade code must not exceed 50 characters.")
    .regex(
      /^[A-Z0-9_]+$/,
      "Grade code may only contain uppercase letters, numbers, and underscores.",
    ),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug may only contain lowercase letters, numbers, and hyphens.",
    ),

  numericGrade: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return Number(value);
  }, z.number().int("Numeric grade must be a whole number.").min(0, "Numeric grade cannot be less than 0.").max(20, "Numeric grade cannot exceed 20.").nullable()),

  sequence: z.coerce
    .number()
    .int("Sequence must be a whole number.")
    .min(0, "Sequence cannot be less than 0."),
});

export type GradeLevelInput = z.infer<typeof gradeLevelSchema>;
