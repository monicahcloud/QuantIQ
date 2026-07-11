"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import { CalendarEventActionState } from "@/lib/types/calendar-event-action";
import { calendarEventSchema } from "@/lib/validations/calendar-events";

const calendarPath = "/admin/education-engine/academic-calendar";
const eventsPath = `${calendarPath}/events`;

function revalidateCalendarEvents() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath(calendarPath);
  revalidatePath(eventsPath);
  revalidatePath(`${calendarPath}/weeks`);
}

export async function createCalendarEvent(
  _previousState: CalendarEventActionState,
  formData: FormData,
): Promise<CalendarEventActionState> {
  await requireAdmin();

  const parsed = calendarEventSchema.safeParse({
    countryId: formData.get("countryId"),
    academicYearId: formData.get("academicYearId"),

    authorityId: formData.get("authorityId") || undefined,
    organizationId: formData.get("organizationId") || undefined,
    schoolId: formData.get("schoolId") || undefined,

    title: formData.get("title"),
    description: formData.get("description") || undefined,

    eventType: formData.get("eventType"),
    scope: formData.get("scope"),

    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),

    allDay: formData.get("allDay") === "on",

    isInstructional: formData.get("isInstructional") === "on",
    affectsPacing: formData.get("affectsPacing") === "on",
    affectsForecast: formData.get("affectsForecast") === "on",
    affectsAttendance: formData.get("affectsAttendance") === "on",
    affectsAssessments: formData.get("affectsAssessments") === "on",
    affectsLessonPlanning: formData.get("affectsLessonPlanning") === "on",

    color: formData.get("color") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const academicYear = await prisma.academicYear.findFirst({
    where: {
      id: parsed.data.academicYearId,
      countryId: parsed.data.countryId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,
    },
  });

  if (!academicYear) {
    return {
      success: false,
      message:
        "The selected academic year does not belong to the selected country.",
      errors: {
        academicYearId: ["Select an academic year belonging to this country."],
      },
    };
  }

  if (
    parsed.data.startDate < academicYear.startDate ||
    parsed.data.endDate > academicYear.endDate
  ) {
    return {
      success: false,
      message: "Calendar event dates must fall within the academic year.",
      errors: {
        startDate: ["Event dates must fall within the academic year."],
        endDate: ["Event dates must fall within the academic year."],
      },
    };
  }

  const scopeValidation = await validateScope({
    countryId: parsed.data.countryId,
    scope: parsed.data.scope,
    authorityId: parsed.data.authorityId,
    organizationId: parsed.data.organizationId,
    schoolId: parsed.data.schoolId,
  });

  if (!scopeValidation.success) {
    return scopeValidation;
  }

  try {
    await prisma.calendarEvent.create({
      data: {
        countryId: parsed.data.countryId,
        academicYearId: parsed.data.academicYearId,

        authorityId:
          parsed.data.scope === "AUTHORITY"
            ? parsed.data.authorityId || null
            : null,

        organizationId:
          parsed.data.scope === "ORGANIZATION"
            ? parsed.data.organizationId || null
            : null,

        schoolId:
          parsed.data.scope === "SCHOOL" ? parsed.data.schoolId || null : null,

        title: parsed.data.title,
        description: parsed.data.description || null,

        eventType: parsed.data.eventType,
        scope: parsed.data.scope,

        startDate: parsed.data.startDate,
        endDate: parsed.data.endDate,
        allDay: parsed.data.allDay,

        isInstructional: parsed.data.isInstructional,
        affectsPacing: parsed.data.affectsPacing,
        affectsForecast: parsed.data.affectsForecast,
        affectsAttendance: parsed.data.affectsAttendance,
        affectsAssessments: parsed.data.affectsAssessments,
        affectsLessonPlanning: parsed.data.affectsLessonPlanning,

        color: parsed.data.color || null,
        notes: parsed.data.notes || null,

        status: "ACTIVE",
      },
    });

    revalidateCalendarEvents();

    return {
      success: true,
      message: "Calendar event created successfully.",
    };
  } catch (error) {
    console.error("Unable to create calendar event:", error);

    return {
      success: false,
      message: "The calendar event could not be created.",
    };
  }
}

export async function archiveCalendarEvent(formData: FormData): Promise<void> {
  await requireAdmin();

  const calendarEventId = formData.get("calendarEventId");

  if (typeof calendarEventId !== "string" || !calendarEventId) {
    throw new Error("A valid calendar event ID is required.");
  }

  await prisma.calendarEvent.update({
    where: {
      id: calendarEventId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  revalidateCalendarEvents();
}

export async function restoreCalendarEvent(formData: FormData): Promise<void> {
  await requireAdmin();

  const calendarEventId = formData.get("calendarEventId");

  if (typeof calendarEventId !== "string" || !calendarEventId) {
    throw new Error("A valid calendar event ID is required.");
  }

  await prisma.calendarEvent.update({
    where: {
      id: calendarEventId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  revalidateCalendarEvents();
}

type ScopeValidationInput = {
  countryId: string;
  scope: "COUNTRY" | "AUTHORITY" | "ORGANIZATION" | "SCHOOL";
  authorityId?: string;
  organizationId?: string;
  schoolId?: string;
};

async function validateScope({
  countryId,
  scope,
  authorityId,
  organizationId,
  schoolId,
}: ScopeValidationInput): Promise<CalendarEventActionState> {
  if (scope === "COUNTRY") {
    return {
      success: true,
      message: "",
    };
  }

  if (scope === "AUTHORITY") {
    const authority = await prisma.educationAuthority.findFirst({
      where: {
        id: authorityId,
        countryId,
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    if (!authority) {
      return {
        success: false,
        message: "The selected authority does not belong to this country.",
        errors: {
          authorityId: [
            "Select an authority belonging to the selected country.",
          ],
        },
      };
    }
  }

  if (scope === "ORGANIZATION") {
    const organization = await prisma.organization.findFirst({
      where: {
        id: organizationId,
        countryId,
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    if (!organization) {
      return {
        success: false,
        message: "The selected organization does not belong to this country.",
        errors: {
          organizationId: [
            "Select an organization belonging to the selected country.",
          ],
        },
      };
    }
  }

  if (scope === "SCHOOL") {
    const school = await prisma.school.findFirst({
      where: {
        id: schoolId,
        countryId,
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    if (!school) {
      return {
        success: false,
        message: "The selected school does not belong to this country.",
        errors: {
          schoolId: ["Select a school belonging to the selected country."],
        },
      };
    }
  }

  return {
    success: true,
    message: "",
  };
}
