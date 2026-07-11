"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import type { AcademicYearActionState } from "@/lib/types/academic-year-action-state";
import { academicYearSchema } from "@/lib/validations/academic-year";

const academicYearsPath = "/admin/education-engine/academic-years";

function revalidateAcademicYears() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath(academicYearsPath);
}

export async function createAcademicYear(
  _previousState: AcademicYearActionState,
  formData: FormData,
): Promise<AcademicYearActionState> {
  await requireAdmin();

  const parsed = academicYearSchema.safeParse({
    countryId: formData.get("countryId"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    isCurrent: formData.get("isCurrent") === "on",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const country = await prisma.country.findFirst({
    where: {
      id: parsed.data.countryId,
      status: "ACTIVE",
    },
    select: {
      id: true,
    },
  });

  if (!country) {
    return {
      success: false,
      message: "The selected country is unavailable.",
      errors: {
        countryId: ["Please select an active country."],
      },
    };
  }

  try {
    await prisma.$transaction(async (transaction) => {
      if (parsed.data.isCurrent) {
        await transaction.academicYear.updateMany({
          where: {
            countryId: parsed.data.countryId,
            isCurrent: true,
          },
          data: {
            isCurrent: false,
          },
        });
      }

      await transaction.academicYear.create({
        data: {
          countryId: parsed.data.countryId,
          name: parsed.data.name,
          slug: parsed.data.slug,
          startDate: parsed.data.startDate,
          endDate: parsed.data.endDate,
          isCurrent: parsed.data.isCurrent,
          status: "ACTIVE",
        },
      });
    });

    revalidateAcademicYears();

    return {
      success: true,
      message: "Academic year created successfully.",
    };
  } catch (error) {
    console.error("Unable to create academic year:", error);

    return {
      success: false,
      message:
        "The academic year could not be created. Check that the name and slug are unique for this country.",
    };
  }
}

export async function setCurrentAcademicYear(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const academicYearId = formData.get("academicYearId");

  if (typeof academicYearId !== "string" || !academicYearId) {
    throw new Error("A valid academic year ID is required.");
  }

  const academicYear = await prisma.academicYear.findUnique({
    where: {
      id: academicYearId,
    },
    select: {
      id: true,
      countryId: true,
      status: true,
    },
  });

  if (!academicYear || academicYear.status !== "ACTIVE") {
    throw new Error("The selected academic year is unavailable.");
  }

  await prisma.$transaction([
    prisma.academicYear.updateMany({
      where: {
        countryId: academicYear.countryId,
        isCurrent: true,
      },
      data: {
        isCurrent: false,
      },
    }),

    prisma.academicYear.update({
      where: {
        id: academicYear.id,
      },
      data: {
        isCurrent: true,
      },
    }),
  ]);

  revalidateAcademicYears();
}

export async function archiveAcademicYear(formData: FormData): Promise<void> {
  await requireAdmin();

  const academicYearId = formData.get("academicYearId");

  if (typeof academicYearId !== "string" || !academicYearId) {
    throw new Error("A valid academic year ID is required.");
  }

  await prisma.academicYear.update({
    where: {
      id: academicYearId,
    },
    data: {
      status: "ARCHIVED",
      isCurrent: false,
    },
  });

  revalidateAcademicYears();
}

export async function restoreAcademicYear(formData: FormData): Promise<void> {
  await requireAdmin();

  const academicYearId = formData.get("academicYearId");

  if (typeof academicYearId !== "string" || !academicYearId) {
    throw new Error("A valid academic year ID is required.");
  }

  await prisma.academicYear.update({
    where: {
      id: academicYearId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  revalidateAcademicYears();
}
