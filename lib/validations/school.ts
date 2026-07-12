import { z } from "zod";

export const schoolTypeSchema = z.enum([
  "PRESCHOOL",
  "PRIMARY",
  "JUNIOR_HIGH",
  "SENIOR_HIGH",
  "ALL_AGE",
  "SPECIALIZED",
  "VOCATIONAL",
  "PRIVATE",
  "OTHER",
]);

export const schoolSchema = z.object({
  countryId: z.string().trim().min(1, "Please select a country."),

  authorityId: z.string().trim().optional(),

  organizationId: z.string().trim().optional(),

  administrativeDivisionId: z.string().trim().optional(),

  localityId: z.string().trim().optional(),

  name: z
    .string()
    .trim()
    .min(2, "School name must contain at least 2 characters.")
    .max(180, "School name must not exceed 180 characters."),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(180, "Slug must not exceed 180 characters.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug may only contain lowercase letters, numbers, and hyphens.",
    ),

  schoolCode: z
    .string()
    .trim()
    .max(50, "School code must not exceed 50 characters.")
    .optional(),

  type: schoolTypeSchema,

  description: z
    .string()
    .trim()
    .max(1200, "Description must not exceed 1200 characters.")
    .optional(),

  addressLine1: z
    .string()
    .trim()
    .max(200, "Address line 1 is too long.")
    .optional(),

  addressLine2: z
    .string()
    .trim()
    .max(200, "Address line 2 is too long.")
    .optional(),

  postalCode: z
    .string()
    .trim()
    .max(30, "Postal code must not exceed 30 characters.")
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

export type SchoolInput = z.infer<typeof schoolSchema>;
