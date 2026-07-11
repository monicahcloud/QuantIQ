import { z } from "zod";

export const academicPeriodTypeSchema = z.enum([
  "TERM",
  "SEMESTER",
  "QUARTER",
  "TRIMESTER",
  "OTHER",
]);

export const academicTermSchema = z
  .object({
    academicYearId: z.string().trim().min(1, "Please select an academic year."),

    name: z
      .string()
      .trim()
      .min(2, "Term name must contain at least 2 characters.")
      .max(100, "Term name must not exceed 100 characters."),

    code: z
      .string()
      .trim()
      .min(2, "Term code is required.")
      .max(60, "Term code must not exceed 60 characters.")
      .regex(
        /^[A-Z0-9_]+$/,
        "Term code may only contain uppercase letters, numbers, and underscores.",
      ),

    type: academicPeriodTypeSchema,

    sequence: z.coerce
      .number()
      .int("Sequence must be a whole number.")
      .min(1, "Sequence must be at least 1."),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after the start date.",
    path: ["endDate"],
  });

export type AcademicTermInput = z.infer<typeof academicTermSchema>;
