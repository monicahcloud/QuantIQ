import { z } from "zod";

export const countrySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Country name must contain at least 2 characters."),

  officialName: z.string().trim().optional(),

  iso2Code: z
    .string()
    .trim()
    .length(2, "ISO-2 code must contain exactly 2 characters.")
    .transform((value) => value.toUpperCase()),

  iso3Code: z
    .string()
    .trim()
    .length(3, "ISO-3 code must contain exactly 3 characters.")
    .transform((value) => value.toUpperCase()),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain lowercase letters, numbers, and hyphens only.",
    ),

  defaultLocale: z.string().trim().min(2, "Default locale is required."),

  defaultTimeZone: z.string().trim().optional(),
});

export type CountryInput = z.infer<typeof countrySchema>;
