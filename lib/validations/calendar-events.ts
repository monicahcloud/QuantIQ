import { z } from "zod";

export const calendarEventTypeSchema = z.enum([
  "PUBLIC_HOLIDAY",
  "SCHOOL_HOLIDAY",
  "SCHOOL_BREAK",
  "PROFESSIONAL_DEVELOPMENT",
  "TEACHER_WORKDAY",
  "EXAM_PERIOD",
  "NATIONAL_ASSESSMENT",
  "PARENT_CONFERENCE",
  "ORIENTATION",
  "SPORTS_DAY",
  "CULTURAL_EVENT",
  "GRADUATION",
  "MINISTRY_EVENT",
  "SCHOOL_CLOSURE",
  "EMERGENCY_CLOSURE",
  "WEATHER_EVENT",
  "OTHER",
]);

export const calendarEventScopeSchema = z.enum([
  "COUNTRY",
  "AUTHORITY",
  "ORGANIZATION",
  "SCHOOL",
]);

export const calendarEventSchema = z
  .object({
    countryId: z.string().trim().min(1, "Please select a country."),

    academicYearId: z.string().trim().min(1, "Please select an academic year."),

    authorityId: z.string().trim().optional(),
    organizationId: z.string().trim().optional(),
    schoolId: z.string().trim().optional(),

    title: z
      .string()
      .trim()
      .min(2, "Event title must contain at least 2 characters.")
      .max(150, "Event title must not exceed 150 characters."),

    description: z
      .string()
      .trim()
      .max(1000, "Description must not exceed 1000 characters.")
      .optional(),

    eventType: calendarEventTypeSchema,
    scope: calendarEventScopeSchema,

    startDate: z.coerce.date(),
    endDate: z.coerce.date(),

    allDay: z.boolean(),

    isInstructional: z.boolean(),
    affectsPacing: z.boolean(),
    affectsForecast: z.boolean(),
    affectsAttendance: z.boolean(),
    affectsAssessments: z.boolean(),
    affectsLessonPlanning: z.boolean(),

    color: z.string().trim().max(30).optional(),
    notes: z.string().trim().max(1000).optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after the start date.",
    path: ["endDate"],
  })
  .superRefine((data, context) => {
    if (data.scope === "AUTHORITY" && !data.authorityId) {
      context.addIssue({
        code: "custom",
        path: ["authorityId"],
        message: "Please select an education authority.",
      });
    }

    if (data.scope === "ORGANIZATION" && !data.organizationId) {
      context.addIssue({
        code: "custom",
        path: ["organizationId"],
        message: "Please select an organization.",
      });
    }

    if (data.scope === "SCHOOL" && !data.schoolId) {
      context.addIssue({
        code: "custom",
        path: ["schoolId"],
        message: "Please select a school.",
      });
    }
  });

export type CalendarEventInput = z.infer<typeof calendarEventSchema>;
