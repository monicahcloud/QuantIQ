"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import type { EducationLevelActionState } from "@/lib/types/education-level-action-state";
import { educationLevelSchema } from "@/lib/validations/education-level";

const educationLevelsPath = "/admin/education-engine/education-levels";

function revalidateEducationLevels() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath(educationLevelsPath);
}

export async function createEducationLevel(
  previousState: EducationLevelActionState,
  formData: FormData,
): Promise<EducationLevelActionState> {
  await requireAdmin();

  const parsed = educationLevelSchema.safeParse({
    countryId: formData.get("countryId"),
    name: formData.get("name"),
    code: formData.get("code"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    sequence: formData.get("sequence"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.educationLevel.create({
      data: {
        countryId: parsed.data.countryId,
        name: parsed.data.name,
        code: parsed.data.code,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
        sequence: parsed.data.sequence,
        status: "ACTIVE",
      },
    });

    revalidateEducationLevels();

    return {
      success: true,
      message: "Education level created successfully.",
    };
  } catch (error) {
    console.error("Unable to create education level:", error);

    return {
      success: false,
      message:
        "The education level could not be created. Check that the code, slug, and sequence are unique for the selected country.",
    };
  }
}

export async function archiveEducationLevel(formData: FormData): Promise<void> {
  await requireAdmin();

  const educationLevelId = formData.get("educationLevelId");

  if (typeof educationLevelId !== "string" || !educationLevelId) {
    throw new Error("A valid education level ID is required.");
  }

  await prisma.educationLevel.update({
    where: {
      id: educationLevelId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  revalidateEducationLevels();
}

export async function restoreEducationLevel(formData: FormData): Promise<void> {
  await requireAdmin();

  const educationLevelId = formData.get("educationLevelId");

  if (typeof educationLevelId !== "string" || !educationLevelId) {
    throw new Error("A valid education level ID is required.");
  }

  await prisma.educationLevel.update({
    where: {
      id: educationLevelId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  revalidateEducationLevels();
}
