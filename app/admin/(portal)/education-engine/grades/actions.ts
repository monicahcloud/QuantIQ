"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import type { GradeLevelActionState } from "@/lib/types/grade-level-action-state";
import { gradeLevelSchema } from "@/lib/validations/grade-level";

const gradeLevelsPath = "/admin/education-engine/grades";

function revalidateGradeLevels() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath(gradeLevelsPath);
}

export async function createGradeLevel(
  previousState: GradeLevelActionState,
  formData: FormData,
): Promise<GradeLevelActionState> {
  await requireAdmin();

  const parsed = gradeLevelSchema.safeParse({
    countryId: formData.get("countryId"),
    educationLevelId: formData.get("educationLevelId"),
    name: formData.get("name"),
    code: formData.get("code"),
    slug: formData.get("slug"),
    numericGrade: formData.get("numericGrade"),
    sequence: formData.get("sequence"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const educationLevel = await prisma.educationLevel.findFirst({
    where: {
      id: parsed.data.educationLevelId,
      countryId: parsed.data.countryId,
      status: "ACTIVE",
    },
    select: {
      id: true,
    },
  });

  if (!educationLevel) {
    return {
      success: false,
      message:
        "The selected education level does not belong to the selected country.",
      errors: {
        educationLevelId: [
          "Select an education level belonging to this country.",
        ],
      },
    };
  }

  try {
    await prisma.gradeLevel.create({
      data: {
        countryId: parsed.data.countryId,
        educationLevelId: parsed.data.educationLevelId,
        name: parsed.data.name,
        code: parsed.data.code,
        slug: parsed.data.slug,
        numericGrade: parsed.data.numericGrade,
        sequence: parsed.data.sequence,
        status: "ACTIVE",
      },
    });

    revalidateGradeLevels();

    return {
      success: true,
      message: "Grade level created successfully.",
    };
  } catch (error) {
    console.error("Unable to create grade level:", error);

    return {
      success: false,
      message:
        "The grade level could not be created. Check that the code, slug, and sequence are unique for the selected country.",
    };
  }
}

export async function archiveGradeLevel(formData: FormData): Promise<void> {
  await requireAdmin();

  const gradeLevelId = formData.get("gradeLevelId");

  if (typeof gradeLevelId !== "string" || !gradeLevelId) {
    throw new Error("A valid grade level ID is required.");
  }

  await prisma.gradeLevel.update({
    where: {
      id: gradeLevelId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  revalidateGradeLevels();
}

export async function restoreGradeLevel(formData: FormData): Promise<void> {
  await requireAdmin();

  const gradeLevelId = formData.get("gradeLevelId");

  if (typeof gradeLevelId !== "string" || !gradeLevelId) {
    throw new Error("A valid grade level ID is required.");
  }

  await prisma.gradeLevel.update({
    where: {
      id: gradeLevelId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  revalidateGradeLevels();
}
