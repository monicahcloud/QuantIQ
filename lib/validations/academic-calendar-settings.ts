import { z } from "zod";

export const academicCalendarSettingSchema = z.object({
  countryId: z.string().trim().min(1, "Please select a country."),

  weekStartsOn: z.enum(["MONDAY", "SUNDAY"]),

  instructionalDays: z
    .array(z.coerce.number().int().min(1).max(7))
    .min(1, "Select at least one instructional day."),

  defaultPeriodType: z.enum([
    "TERM",
    "SEMESTER",
    "QUARTER",
    "TRIMESTER",
    "OTHER",
  ]),

  defaultLocale: z
    .string()
    .trim()
    .min(2, "Default locale is required.")
    .max(20, "Default locale is too long."),

  defaultTimeZone: z
    .string()
    .trim()
    .min(2, "Default time zone is required.")
    .max(100, "Default time zone is too long."),

  autoAssignWeeksToTerms: z.boolean(),

  outsideTermsNonInstructional: z.boolean(),
});

export type AcademicCalendarSettingInput = z.infer<
  typeof academicCalendarSettingSchema
>;
