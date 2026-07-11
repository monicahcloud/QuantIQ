"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import type { AcademicTermActionState } from "@/lib/types/academic-term-action-state";
import { academicTermSchema } from "@/lib/validations/academic-term";

const calendarPath = "/admin/education-engine/academic-calendar";
const termsPath = `${calendarPath}/terms`;

function revalidateAcademicTerms() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath(calendarPath);
  revalidatePath(termsPath);
  revalidatePath("/admin/education-engine/academic-years");
}

export async function createAcademicTerm(
  _previousState: AcademicTermActionState,
  formData: FormData,
): Promise<AcademicTermActionState> {
  await requireAdmin();

  const parsed = academicTermSchema.safeParse({
    academicYearId: formData.get("academicYearId"),
    name: formData.get("name"),
    code: formData.get("code"),
    type: formData.get("type"),
    sequence: formData.get("sequence"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
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
    select: {
      id: true,
      startDate: true,
      endDate: true,
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

  if (
    parsed.data.startDate < academicYear.startDate ||
    parsed.data.endDate > academicYear.endDate
  ) {
    return {
      success: false,
      message: "The term dates must fall within the academic year.",
      errors: {
        startDate: ["Term dates must fall within the academic year."],
        endDate: ["Term dates must fall within the academic year."],
      },
    };
  }

  const overlappingTerm = await prisma.academicPeriod.findFirst({
    where: {
      academicYearId: parsed.data.academicYearId,
      status: "ACTIVE",
      startDate: {
        lte: parsed.data.endDate,
      },
      endDate: {
        gte: parsed.data.startDate,
      },
    },
    select: {
      name: true,
    },
  });

  if (overlappingTerm) {
    return {
      success: false,
      message: `The selected dates overlap with ${overlappingTerm.name}.`,
      errors: {
        startDate: ["These dates overlap another active academic period."],
        endDate: ["These dates overlap another active academic period."],
      },
    };
  }

  try {
    await prisma.academicPeriod.create({
      data: {
        academicYearId: parsed.data.academicYearId,
        name: parsed.data.name,
        code: parsed.data.code,
        type: parsed.data.type,
        sequence: parsed.data.sequence,
        startDate: parsed.data.startDate,
        endDate: parsed.data.endDate,
        status: "ACTIVE",
      },
    });

    revalidateAcademicTerms();

    return {
      success: true,
      message: "Academic term created successfully.",
    };
  } catch (error) {
    console.error("Unable to create academic term:", error);

    return {
      success: false,
      message:
        "The academic term could not be created. Check that its code and sequence are unique within the academic year.",
    };
  }
}

export async function archiveAcademicTerm(formData: FormData): Promise<void> {
  await requireAdmin();

  const academicTermId = formData.get("academicTermId");

  if (typeof academicTermId !== "string" || !academicTermId) {
    throw new Error("A valid academic term ID is required.");
  }

  await prisma.$transaction([
    prisma.academicWeek.updateMany({
      where: {
        academicPeriodId: academicTermId,
      },
      data: {
        academicPeriodId: null,
      },
    }),

    prisma.academicPeriod.update({
      where: {
        id: academicTermId,
      },
      data: {
        status: "ARCHIVED",
      },
    }),
  ]);

  revalidateAcademicTerms();
}

export async function restoreAcademicTerm(formData: FormData): Promise<void> {
  await requireAdmin();

  const academicTermId = formData.get("academicTermId");

  if (typeof academicTermId !== "string" || !academicTermId) {
    throw new Error("A valid academic term ID is required.");
  }

  await prisma.academicPeriod.update({
    where: {
      id: academicTermId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  revalidateAcademicTerms();
}
