import { z } from "zod";

import { WeekStartDay } from "@/lib/generated/prisma/client";

export const generateAcademicWeeksSchema = z.object({
  academicYearId: z.string().trim().min(1, "Please select an academic year."),

  weekStartsOn: z.enum(WeekStartDay),

  replaceExisting: z.boolean(),
});

export const academicWeekIdSchema = z.object({
  academicWeekId: z
    .string()
    .trim()
    .min(1, "A valid academic week is required."),
});
