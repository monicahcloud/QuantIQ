import { z } from "zod";

export const administrativeDivisionTypeSchema = z.enum([
  "ISLAND",
  "STATE",
  "PROVINCE",
  "PARISH",
  "REGION",
  "COUNTY",
  "TERRITORY",
  "DISTRICT",
  "DEPARTMENT",
  "MUNICIPALITY",
  "OTHER",
]);

export const administrativeDivisionSchema = z.object({
  countryId: z.string().trim().min(1, "Please select a country."),

  parentDivisionId: z.string().trim().optional(),

  name: z
    .string()
    .trim()
    .min(2, "Division name must contain at least 2 characters.")
    .max(120, "Division name must not exceed 120 characters."),

  code: z
    .string()
    .trim()
    .max(20, "Code must not exceed 20 characters.")
    .optional(),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(120, "Slug must not exceed 120 characters.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug may only contain lowercase letters, numbers, and hyphens.",
    ),

  type: administrativeDivisionTypeSchema,

  description: z
    .string()
    .trim()
    .max(750, "Description must not exceed 750 characters.")
    .optional(),

  sequence: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return Number(value);
  }, z.number().int("Sequence must be a whole number.").min(1, "Sequence must be at least 1.").nullable()),
});

export type AdministrativeDivisionInput = z.infer<
  typeof administrativeDivisionSchema
>;
