"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import type { CurriculumFrameworkActionState } from "@/lib/types/curriculum-framework-action-state";
import {
  curriculumFrameworkIdSchema,
  curriculumFrameworkSchema,
} from "@/lib/validations/curriculum-framework";

const curriculumPath = "/admin/curriculum-engine";
const versionsPath = `${curriculumPath}/versions`;
const frameworksPath = `${curriculumPath}/frameworks`;

function revalidateCurriculumFrameworks() {
  revalidatePath("/admin/dashboard");
  revalidatePath(curriculumPath);
  revalidatePath(versionsPath);
  revalidatePath(frameworksPath);
}

function optionalFormValue(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  return value.trim();
}

export async function createCurriculumFramework(
  _previousState: CurriculumFrameworkActionState,
  formData: FormData,
): Promise<CurriculumFrameworkActionState> {
  await requireAdmin();

  const parsed = curriculumFrameworkSchema.safeParse({
    curriculumVersionId: formData.get("curriculumVersionId"),
    name: formData.get("name"),
    code: optionalFormValue(formData.get("code")),
    slug: formData.get("slug"),
    description: optionalFormValue(formData.get("description")),
    sequence: formData.get("sequence"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const version = await prisma.curriculumVersion.findFirst({
    where: {
      id: parsed.data.curriculumVersionId,
      status: {
        not: "ARCHIVED",
      },
    },
    select: {
      id: true,
      name: true,
      status: true,
    },
  });

  if (!version) {
    return {
      success: false,
      message: "The selected curriculum version is unavailable.",
      errors: {
        curriculumVersionId: ["Please select an active curriculum version."],
      },
    };
  }

  try {
    await prisma.curriculumFramework.create({
      data: {
        curriculumVersionId: parsed.data.curriculumVersionId,
        name: parsed.data.name,
        code: parsed.data.code?.toUpperCase() ?? null,
        slug: parsed.data.slug,
        description: parsed.data.description ?? null,
        sequence: parsed.data.sequence,
        status: "ACTIVE",
      },
    });

    revalidateCurriculumFrameworks();

    return {
      success: true,
      message: "Curriculum framework created successfully.",
    };
  } catch (error) {
    console.error("Unable to create curriculum framework:", error);

    return {
      success: false,
      message:
        "The curriculum framework could not be created. Check that its slug is unique within the selected curriculum version.",
    };
  }
}

export async function archiveCurriculumFramework(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const parsed = curriculumFrameworkIdSchema.safeParse({
    curriculumFrameworkId: formData.get("curriculumFrameworkId"),
  });

  if (!parsed.success) {
    throw new Error("A valid curriculum framework ID is required.");
  }

  await prisma.curriculumFramework.update({
    where: {
      id: parsed.data.curriculumFrameworkId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  revalidateCurriculumFrameworks();
}

export async function restoreCurriculumFramework(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const parsed = curriculumFrameworkIdSchema.safeParse({
    curriculumFrameworkId: formData.get("curriculumFrameworkId"),
  });

  if (!parsed.success) {
    throw new Error("A valid curriculum framework ID is required.");
  }

  await prisma.curriculumFramework.update({
    where: {
      id: parsed.data.curriculumFrameworkId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  revalidateCurriculumFrameworks();
}
