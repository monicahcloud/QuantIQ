"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import type { CurriculumVersionActionState } from "@/lib/types/curriculum-version-action-state";
import {
  curriculumVersionIdSchema,
  curriculumVersionSchema,
} from "@/lib/validations/curriculum-version";

const curriculumPath = "/admin/curriculum-engine";
const versionsPath = `${curriculumPath}/versions`;

function revalidateCurriculumVersions() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath(curriculumPath);
  revalidatePath(versionsPath);
}

function optionalFormValue(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "" || value === "NONE") {
    return undefined;
  }

  return value.trim();
}

export async function createCurriculumVersion(
  _previousState: CurriculumVersionActionState,
  formData: FormData,
): Promise<CurriculumVersionActionState> {
  await requireAdmin();

  const parsed = curriculumVersionSchema.safeParse({
    countryId: formData.get("countryId"),

    administrativeDivisionId: optionalFormValue(
      formData.get("administrativeDivisionId"),
    ),

    authorityId: optionalFormValue(formData.get("authorityId")),

    organizationId: optionalFormValue(formData.get("organizationId")),

    schoolId: optionalFormValue(formData.get("schoolId")),

    name: formData.get("name"),
    code: formData.get("code"),
    slug: formData.get("slug"),
    versionLabel: optionalFormValue(formData.get("versionLabel")),

    languageCode: formData.get("languageCode"),
    scope: formData.get("scope"),

    description: optionalFormValue(formData.get("description")),
    notes: optionalFormValue(formData.get("notes")),

    effectiveFrom: formData.get("effectiveFrom"),
    effectiveTo: formData.get("effectiveTo"),
    publishedAt: formData.get("publishedAt"),

    isCurrent: formData.get("isCurrent") === "on",
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const scopeValidation = await validateCurriculumScope({
    countryId: parsed.data.countryId,
    administrativeDivisionId: parsed.data.administrativeDivisionId,
    authorityId: parsed.data.authorityId,
    organizationId: parsed.data.organizationId,
    schoolId: parsed.data.schoolId,
    scope: parsed.data.scope,
  });

  if (!scopeValidation.success) {
    return scopeValidation;
  }

  const scopedValues = resolveScopedValues(parsed.data);

  try {
    await prisma.$transaction(async (transaction) => {
      if (parsed.data.isCurrent) {
        await transaction.curriculumVersion.updateMany({
          where: {
            countryId: parsed.data.countryId,
            scope: parsed.data.scope,

            administrativeDivisionId: scopedValues.administrativeDivisionId,

            authorityId: scopedValues.authorityId,
            organizationId: scopedValues.organizationId,
            schoolId: scopedValues.schoolId,

            isCurrent: true,
          },

          data: {
            isCurrent: false,
          },
        });
      }

      await transaction.curriculumVersion.create({
        data: {
          countryId: parsed.data.countryId,

          administrativeDivisionId: scopedValues.administrativeDivisionId,

          authorityId: scopedValues.authorityId,
          organizationId: scopedValues.organizationId,
          schoolId: scopedValues.schoolId,

          name: parsed.data.name,
          code: parsed.data.code.toUpperCase(),
          slug: parsed.data.slug,
          versionLabel: parsed.data.versionLabel ?? null,

          languageCode: parsed.data.languageCode,
          scope: parsed.data.scope,

          description: parsed.data.description ?? null,
          notes: parsed.data.notes ?? null,

          effectiveFrom: parsed.data.effectiveFrom,
          effectiveTo: parsed.data.effectiveTo,
          publishedAt: parsed.data.publishedAt,

          isCurrent: parsed.data.isCurrent,
          status: parsed.data.status,
        },
      });
    });

    revalidateCurriculumVersions();

    return {
      success: true,
      message: "Curriculum version created successfully.",
    };
  } catch (error) {
    console.error("Unable to create curriculum version:", error);

    return {
      success: false,
      message:
        "The curriculum version could not be created. Check that the code and slug are unique for the selected country.",
    };
  }
}

export async function archiveCurriculumVersion(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const parsed = curriculumVersionIdSchema.safeParse({
    curriculumVersionId: formData.get("curriculumVersionId"),
  });

  if (!parsed.success) {
    throw new Error("A valid curriculum version ID is required.");
  }

  await prisma.curriculumVersion.update({
    where: {
      id: parsed.data.curriculumVersionId,
    },

    data: {
      status: "ARCHIVED",
      isCurrent: false,
    },
  });

  revalidateCurriculumVersions();
}

export async function restoreCurriculumVersion(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const parsed = curriculumVersionIdSchema.safeParse({
    curriculumVersionId: formData.get("curriculumVersionId"),
  });

  if (!parsed.success) {
    throw new Error("A valid curriculum version ID is required.");
  }

  await prisma.curriculumVersion.update({
    where: {
      id: parsed.data.curriculumVersionId,
    },

    data: {
      status: "DRAFT",
      isCurrent: false,
    },
  });

  revalidateCurriculumVersions();
}

export async function markCurriculumVersionCurrent(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const parsed = curriculumVersionIdSchema.safeParse({
    curriculumVersionId: formData.get("curriculumVersionId"),
  });

  if (!parsed.success) {
    throw new Error("A valid curriculum version ID is required.");
  }

  const version = await prisma.curriculumVersion.findUnique({
    where: {
      id: parsed.data.curriculumVersionId,
    },

    select: {
      id: true,
      countryId: true,
      administrativeDivisionId: true,
      authorityId: true,
      organizationId: true,
      schoolId: true,
      scope: true,
      status: true,
    },
  });

  if (!version) {
    throw new Error("The selected curriculum version does not exist.");
  }

  if (!["APPROVED", "PUBLISHED"].includes(version.status)) {
    throw new Error(
      "Only approved or published curriculum versions may be current.",
    );
  }

  await prisma.$transaction([
    prisma.curriculumVersion.updateMany({
      where: {
        countryId: version.countryId,
        scope: version.scope,

        administrativeDivisionId: version.administrativeDivisionId,

        authorityId: version.authorityId,
        organizationId: version.organizationId,
        schoolId: version.schoolId,

        isCurrent: true,
      },

      data: {
        isCurrent: false,
      },
    }),

    prisma.curriculumVersion.update({
      where: {
        id: version.id,
      },

      data: {
        isCurrent: true,
      },
    }),
  ]);

  revalidateCurriculumVersions();
}

type ScopeValidationInput = {
  countryId: string;
  administrativeDivisionId?: string;
  authorityId?: string;
  organizationId?: string;
  schoolId?: string;
  scope:
    | "COUNTRY"
    | "ADMINISTRATIVE_DIVISION"
    | "AUTHORITY"
    | "ORGANIZATION"
    | "SCHOOL";
};

async function validateCurriculumScope({
  countryId,
  administrativeDivisionId,
  authorityId,
  organizationId,
  schoolId,
  scope,
}: ScopeValidationInput): Promise<CurriculumVersionActionState> {
  const country = await prisma.country.findFirst({
    where: {
      id: countryId,
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

  if (scope === "COUNTRY") {
    return {
      success: true,
      message: "",
    };
  }

  if (scope === "ADMINISTRATIVE_DIVISION") {
    const division = await prisma.administrativeDivision.findFirst({
      where: {
        id: administrativeDivisionId,
        countryId,
        status: "ACTIVE",
      },

      select: {
        id: true,
      },
    });

    if (!division) {
      return {
        success: false,
        message:
          "The selected administrative division does not belong to this country.",
        errors: {
          administrativeDivisionId: [
            "Select a division belonging to the selected country.",
          ],
        },
      };
    }
  }

  if (scope === "AUTHORITY") {
    const authority = await prisma.educationAuthority.findFirst({
      where: {
        id: authorityId,
        countryId,
        status: "ACTIVE",

        ...(administrativeDivisionId
          ? {
              OR: [
                {
                  administrativeDivisionId,
                },
                {
                  administrativeDivisionId: null,
                },
              ],
            }
          : {}),
      },

      select: {
        id: true,
      },
    });

    if (!authority) {
      return {
        success: false,
        message:
          "The selected authority does not match the selected country and division.",
        errors: {
          authorityId: ["Select an authority matching the selected geography."],
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

        ...(administrativeDivisionId
          ? {
              OR: [
                {
                  administrativeDivisionId,
                },
                {
                  administrativeDivisionId: null,
                },
              ],
            }
          : {}),

        ...(authorityId
          ? {
              OR: [
                {
                  authorityId,
                },
                {
                  authorityId: null,
                },
              ],
            }
          : {}),
      },

      select: {
        id: true,
      },
    });

    if (!organization) {
      return {
        success: false,
        message:
          "The selected organization does not match the selected curriculum scope.",
        errors: {
          organizationId: [
            "Select an organization matching the selected hierarchy.",
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

        ...(administrativeDivisionId
          ? {
              OR: [
                {
                  administrativeDivisionId,
                },
                {
                  administrativeDivisionId: null,
                },
              ],
            }
          : {}),

        ...(authorityId
          ? {
              OR: [
                {
                  authorityId,
                },
                {
                  authorityId: null,
                },
              ],
            }
          : {}),

        ...(organizationId
          ? {
              OR: [
                {
                  organizationId,
                },
                {
                  organizationId: null,
                },
              ],
            }
          : {}),
      },

      select: {
        id: true,
      },
    });

    if (!school) {
      return {
        success: false,
        message:
          "The selected school does not match the selected curriculum scope.",
        errors: {
          schoolId: ["Select a school matching the selected hierarchy."],
        },
      };
    }
  }

  return {
    success: true,
    message: "",
  };
}

function resolveScopedValues(data: {
  scope:
    | "COUNTRY"
    | "ADMINISTRATIVE_DIVISION"
    | "AUTHORITY"
    | "ORGANIZATION"
    | "SCHOOL";
  administrativeDivisionId?: string;
  authorityId?: string;
  organizationId?: string;
  schoolId?: string;
}) {
  return {
    administrativeDivisionId:
      data.scope === "COUNTRY" ? null : (data.administrativeDivisionId ?? null),

    authorityId: ["AUTHORITY", "ORGANIZATION", "SCHOOL"].includes(data.scope)
      ? (data.authorityId ?? null)
      : null,

    organizationId: ["ORGANIZATION", "SCHOOL"].includes(data.scope)
      ? (data.organizationId ?? null)
      : null,

    schoolId: data.scope === "SCHOOL" ? (data.schoolId ?? null) : null,
  };
}
