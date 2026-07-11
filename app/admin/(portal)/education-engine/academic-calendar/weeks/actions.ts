"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import type { AcademicWeekActionState } from "@/lib/types/academic-week-action-state";
import {
  academicWeekIdSchema,
  generateAcademicWeeksSchema,
} from "@/lib/validations/academic-week";
import { WeekStartDay } from "@/lib/generated/prisma/client";

const calendarPath = "/admin/education-engine/academic-calendar";
const weeksPath = `${calendarPath}/weeks`;

function revalidateAcademicWeeks() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath(calendarPath);
  revalidatePath(weeksPath);
  revalidatePath("/admin/education-engine/academic-years");
}

export async function generateAcademicWeeks(
  _previousState: AcademicWeekActionState,
  formData: FormData,
): Promise<AcademicWeekActionState> {
  await requireAdmin();

  const parsed = generateAcademicWeeksSchema.safeParse({
    academicYearId: formData.get("academicYearId"),
    weekStartsOn: formData.get("weekStartsOn"),
    replaceExisting: formData.get("replaceExisting") === "on",
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
      status: "ACTIVE",
    },
    include: {
      country: {
        select: {
          calendarSetting: true,
        },
      },
      periods: {
        where: {
          status: "ACTIVE",
        },
        orderBy: {
          sequence: "asc",
        },
      },
      _count: {
        select: {
          weeks: true,
        },
      },
    },
  });

  if (!academicYear) {
    return {
      success: false,
      message: "The selected academic year is unavailable.",
      errors: {
        academicYearId: ["Please select an active academic year."],
      },
    };
  }

  if (academicYear.periods.length === 0) {
    return {
      success: false,
      message: "Create at least one academic term before generating weeks.",
      errors: {
        academicYearId: ["This academic year does not have any active terms."],
      },
    };
  }

  if (academicYear._count.weeks > 0 && !parsed.data.replaceExisting) {
    return {
      success: false,
      message:
        "This academic year already has weeks. Select Replace Existing Weeks to regenerate them.",
      errors: {
        replaceExisting: ["Confirm that existing weeks may be replaced."],
      },
    };
  }
  const resolvedWeekStartsOn: WeekStartDay =
    academicYear.country.calendarSetting?.weekStartsOn ??
    parsed.data.weekStartsOn;

  const generatedWeeks = buildAcademicWeeks({
    academicYearStart: academicYear.startDate,
    academicYearEnd: academicYear.endDate,

    weekStartsOn: resolvedWeekStartsOn,

    autoAssignWeeksToTerms:
      academicYear.country.calendarSetting?.autoAssignWeeksToTerms ?? true,

    outsideTermsNonInstructional:
      academicYear.country.calendarSetting?.outsideTermsNonInstructional ??
      true,

    periods: academicYear.periods.map((period) => ({
      id: period.id,
      startDate: period.startDate,
      endDate: period.endDate,
    })),
  });

  if (generatedWeeks.length === 0) {
    return {
      success: false,
      message:
        "No weeks could be generated from the selected academic-year dates.",
    };
  }

  try {
    await prisma.$transaction(async (transaction) => {
      if (parsed.data.replaceExisting) {
        await transaction.academicWeek.deleteMany({
          where: {
            academicYearId: academicYear.id,
          },
        });
      }

      await transaction.academicWeek.createMany({
        data: generatedWeeks.map((week) => ({
          academicYearId: academicYear.id,
          academicPeriodId: week.academicPeriodId,
          name: week.name,
          weekNumber: week.weekNumber,
          startDate: week.startDate,
          endDate: week.endDate,
          isInstructional: week.isInstructional,
          notes: week.notes,
          status: "ACTIVE",
        })),
      });
    });

    revalidateAcademicWeeks();

    return {
      success: true,
      message: `${generatedWeeks.length} academic weeks generated successfully.`,
      generatedCount: generatedWeeks.length,
    };
  } catch (error) {
    console.error("Unable to generate academic weeks:", error);

    return {
      success: false,
      message:
        "The academic weeks could not be generated. Please review the calendar dates and try again.",
    };
  }
}

export async function toggleAcademicWeekInstructionalStatus(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const parsed = academicWeekIdSchema.safeParse({
    academicWeekId: formData.get("academicWeekId"),
  });

  if (!parsed.success) {
    throw new Error("A valid academic week ID is required.");
  }

  const week = await prisma.academicWeek.findUnique({
    where: {
      id: parsed.data.academicWeekId,
    },
    select: {
      id: true,
      isInstructional: true,
    },
  });

  if (!week) {
    throw new Error("The selected academic week does not exist.");
  }

  await prisma.academicWeek.update({
    where: {
      id: week.id,
    },
    data: {
      isInstructional: !week.isInstructional,
    },
  });

  revalidateAcademicWeeks();
}

export async function archiveAcademicWeek(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = academicWeekIdSchema.safeParse({
    academicWeekId: formData.get("academicWeekId"),
  });

  if (!parsed.success) {
    throw new Error("A valid academic week ID is required.");
  }

  await prisma.academicWeek.update({
    where: {
      id: parsed.data.academicWeekId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  revalidateAcademicWeeks();
}

export async function restoreAcademicWeek(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = academicWeekIdSchema.safeParse({
    academicWeekId: formData.get("academicWeekId"),
  });

  if (!parsed.success) {
    throw new Error("A valid academic week ID is required.");
  }

  await prisma.academicWeek.update({
    where: {
      id: parsed.data.academicWeekId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  revalidateAcademicWeeks();
}

type PeriodRange = {
  id: string;
  startDate: Date;
  endDate: Date;
};

type BuildAcademicWeeksInput = {
  academicYearStart: Date;
  academicYearEnd: Date;
  weekStartsOn: WeekStartDay;
  autoAssignWeeksToTerms: boolean;
  outsideTermsNonInstructional: boolean;
  periods: PeriodRange[];
};

type GeneratedAcademicWeek = {
  name: string;
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  academicPeriodId: string | null;
  isInstructional: boolean;
  notes: string | null;
};

function buildAcademicWeeks({
  academicYearStart,
  academicYearEnd,
  weekStartsOn,
  autoAssignWeeksToTerms,
  outsideTermsNonInstructional,
  periods,
}: BuildAcademicWeeksInput): GeneratedAcademicWeek[] {
  const yearStart = startOfUtcDay(academicYearStart);
  const yearEnd = endOfUtcDay(academicYearEnd);

  const firstWeekStart = alignToWeekStart(yearStart, weekStartsOn);

  const weeks: GeneratedAcademicWeek[] = [];
  let cursor = firstWeekStart;
  let weekNumber = 1;

  while (cursor <= yearEnd) {
    const calculatedWeekEnd = addUtcDays(cursor, 6);

    const startDate = cursor < yearStart ? yearStart : startOfUtcDay(cursor);

    const endDate =
      calculatedWeekEnd > yearEnd ? yearEnd : endOfUtcDay(calculatedWeekEnd);

    const matchingPeriod = autoAssignWeeksToTerms
      ? findBestPeriod(startDate, endDate, periods)
      : undefined;

    const hasTerm = Boolean(matchingPeriod);

    weeks.push({
      name: `Week ${weekNumber}`,
      weekNumber,
      startDate,
      endDate,

      academicPeriodId: matchingPeriod?.id ?? null,

      isInstructional: hasTerm || !outsideTermsNonInstructional,

      notes:
        !hasTerm && outsideTermsNonInstructional
          ? "Generated outside an active academic term."
          : null,
    });

    cursor = addUtcDays(cursor, 7);
    weekNumber += 1;
  }

  return weeks;
}

function findBestPeriod(
  weekStart: Date,
  weekEnd: Date,
  periods: PeriodRange[],
) {
  const overlappingPeriods = periods
    .map((period) => {
      const overlapStart = Math.max(
        weekStart.getTime(),
        startOfUtcDay(period.startDate).getTime(),
      );

      const overlapEnd = Math.min(
        weekEnd.getTime(),
        endOfUtcDay(period.endDate).getTime(),
      );

      return {
        period,
        overlap: overlapEnd >= overlapStart ? overlapEnd - overlapStart : -1,
      };
    })
    .filter((item) => item.overlap >= 0)
    .sort((a, b) => b.overlap - a.overlap);

  return overlappingPeriods[0]?.period;
}

function alignToWeekStart(value: Date, weekStartsOn: WeekStartDay) {
  const date = startOfUtcDay(value);
  const day = date.getUTCDay();

  const targetDay = weekStartsOn === "MONDAY" ? 1 : 0;
  const difference = (day - targetDay + 7) % 7;

  return addUtcDays(date, -difference);
}

function addUtcDays(value: Date, days: number) {
  const date = new Date(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
}

function startOfUtcDay(value: Date) {
  const date = new Date(value);

  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );
}

function endOfUtcDay(value: Date) {
  const date = new Date(value);

  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23,
      59,
      59,
      999,
    ),
  );
}
