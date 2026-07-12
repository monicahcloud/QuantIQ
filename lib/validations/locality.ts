import { z } from "zod";

export const localityTypeSchema = z.enum([
  "CITY",
  "TOWN",
  "SETTLEMENT",
  "VILLAGE",
  "DISTRICT",
  "MUNICIPALITY",
  "COMMUNITY",
  "OTHER",
]);

const optionalCoordinate = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return Number(value);
}, z.number().nullable());

export const localitySchema = z
  .object({
    countryId: z.string().trim().min(1, "Please select a country."),

    administrativeDivisionId: z
      .string()
      .trim()
      .min(1, "Please select an administrative division."),

    name: z
      .string()
      .trim()
      .min(2, "Locality name must contain at least 2 characters.")
      .max(120, "Locality name must not exceed 120 characters."),

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

    type: localityTypeSchema,

    description: z
      .string()
      .trim()
      .max(750, "Description must not exceed 750 characters.")
      .optional(),

    postalCode: z
      .string()
      .trim()
      .max(30, "Postal code must not exceed 30 characters.")
      .optional(),

    latitude: optionalCoordinate,
    longitude: optionalCoordinate,

    sequence: z.preprocess((value) => {
      if (value === "" || value === null || value === undefined) {
        return null;
      }

      return Number(value);
    }, z.number().int("Sequence must be a whole number.").min(1, "Sequence must be at least 1.").nullable()),
  })
  .refine(
    (data) =>
      data.latitude === null || (data.latitude >= -90 && data.latitude <= 90),
    {
      message: "Latitude must be between -90 and 90.",
      path: ["latitude"],
    },
  )
  .refine(
    (data) =>
      data.longitude === null ||
      (data.longitude >= -180 && data.longitude <= 180),
    {
      message: "Longitude must be between -180 and 180.",
      path: ["longitude"],
    },
  );

export type LocalityInput = z.infer<typeof localitySchema>;
