"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import type { SubjectActionState } from "@/lib/types/subject-action-state";
import { subjectSchema } from "@/lib/validations/subject";

const subjectsPath = "/admin/education-engine/subjects";

function revalidateSubjects() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath(subjectsPath);
}

export async function createSubject(
  _previousState: SubjectActionState,
  formData: FormData,
): Promise<SubjectActionState> {
  await requireAdmin();

  const parsed = subjectSchema.safeParse({
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
    await prisma.subject.create({
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

    revalidateSubjects();

    return {
      success: true,
      message: "Subject created successfully.",
    };
  } catch (error) {
    console.error("Unable to create subject:", error);

    return {
      success: false,
      message:
        "The subject could not be created. Check that its code, slug, and sequence are unique for this country.",
    };
  }
}

export async function archiveSubject(formData: FormData): Promise<void> {
  await requireAdmin();

  const subjectId = formData.get("subjectId");

  if (typeof subjectId !== "string" || !subjectId) {
    throw new Error("A valid subject ID is required.");
  }

  await prisma.subject.update({
    where: {
      id: subjectId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  revalidateSubjects();
}

export async function restoreSubject(formData: FormData): Promise<void> {
  await requireAdmin();

  const subjectId = formData.get("subjectId");

  if (typeof subjectId !== "string" || !subjectId) {
    throw new Error("A valid subject ID is required.");
  }

  await prisma.subject.update({
    where: {
      id: subjectId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  revalidateSubjects();
}
