import { z } from "zod";

export const academicYearSchema = z
  .object({
    countryId: z.string().trim().min(1, "Please select a country."),

    name: z
      .string()
      .trim()
      .min(4, "Academic year name is required.")
      .max(30, "Academic year name must not exceed 30 characters."),

    slug: z
      .string()
      .trim()
      .min(4, "Slug is required.")
      .max(40, "Slug must not exceed 40 characters.")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug may only contain lowercase letters, numbers, and hyphens.",
      ),

    startDate: z.coerce.date({
      error: "Please enter a valid start date.",
    }),

    endDate: z.coerce.date({
      error: "Please enter a valid end date.",
    }),

    isCurrent: z.boolean(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after the start date.",
    path: ["endDate"],
  });

export type AcademicYearInput = z.infer<typeof academicYearSchema>;
