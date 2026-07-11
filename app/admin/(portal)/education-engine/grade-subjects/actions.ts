"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import type { GradeSubjectActionState } from "@/lib/types/grade-subject-action-state";
import { gradeSubjectMappingSchema } from "@/lib/validations/grade-subject";

const mappingPath = "/admin/education-engine/grade-subjects";

function revalidateGradeSubjects() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath("/admin/education-engine/grades");
  revalidatePath("/admin/education-engine/subjects");
  revalidatePath(mappingPath);
}

export async function saveGradeSubjectMappings(
  _previousState: GradeSubjectActionState,
  formData: FormData,
): Promise<GradeSubjectActionState> {
  await requireAdmin();

  const parsed = gradeSubjectMappingSchema.safeParse({
    countryId: formData.get("countryId"),
    gradeLevelId: formData.get("gradeLevelId"),
    subjectIds: formData.getAll("subjectIds"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { countryId, gradeLevelId, subjectIds } = parsed.data;

  const gradeLevel = await prisma.gradeLevel.findFirst({
    where: {
      id: gradeLevelId,
      countryId,
      status: "ACTIVE",
    },
    select: {
      id: true,
    },
  });

  if (!gradeLevel) {
    return {
      success: false,
      message: "The selected grade does not belong to this country.",
      errors: {
        gradeLevelId: [
          "Select a grade level belonging to the selected country.",
        ],
      },
    };
  }

  const validSubjects = await prisma.subject.findMany({
    where: {
      id: {
        in: subjectIds,
      },
      countryId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      sequence: true,
    },
  });

  if (validSubjects.length !== subjectIds.length) {
    return {
      success: false,
      message: "One or more selected subjects do not belong to this country.",
      errors: {
        subjectIds: ["Select only subjects belonging to this country."],
      },
    };
  }

  try {
    await prisma.$transaction(async (transaction) => {
      const selectedIds = validSubjects.map((subject) => subject.id);

      await transaction.gradeSubject.updateMany({
        where: {
          gradeLevelId,
          subjectId: {
            notIn: selectedIds,
          },
        },
        data: {
          status: "ARCHIVED",
        },
      });

      for (const subject of validSubjects) {
        await transaction.gradeSubject.upsert({
          where: {
            gradeLevelId_subjectId: {
              gradeLevelId,
              subjectId: subject.id,
            },
          },
          update: {
            isRequired: true,
            sequence: subject.sequence,
            status: "ACTIVE",
          },
          create: {
            gradeLevelId,
            subjectId: subject.id,
            isRequired: true,
            sequence: subject.sequence,
            status: "ACTIVE",
          },
        });
      }
    });

    revalidateGradeSubjects();

    return {
      success: true,
      message: "Grade subjects updated successfully.",
    };
  } catch (error) {
    console.error("Unable to save grade-subject mappings:", error);

    return {
      success: false,
      message: "The grade subjects could not be updated.",
    };
  }
}
