import { z } from "zod";

export const authorityTypeSchema = z.enum([
  "MINISTRY",
  "DEPARTMENT",
  "BOARD",
  "DISTRICT",
  "REGION",
  "OTHER",
]);

export const educationAuthoritySchema = z.object({
  countryId: z.string().trim().min(1, "Please select a country."),

  administrativeDivisionId: z.string().trim().optional(),

  localityId: z.string().trim().optional(),

  name: z
    .string()
    .trim()
    .min(2, "Authority name must contain at least 2 characters.")
    .max(160, "Authority name must not exceed 160 characters."),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(160, "Slug must not exceed 160 characters.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug may only contain lowercase letters, numbers, and hyphens.",
    ),

  type: authorityTypeSchema,

  description: z
    .string()
    .trim()
    .max(1000, "Description must not exceed 1000 characters.")
    .optional(),

  websiteUrl: z
    .string()
    .trim()
    .url("Enter a valid website URL.")
    .max(500, "Website URL is too long.")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(255, "Email address is too long.")
    .optional(),

  phone: z
    .string()
    .trim()
    .max(50, "Phone number must not exceed 50 characters.")
    .optional(),
});

export type EducationAuthorityInput = z.infer<typeof educationAuthoritySchema>;
