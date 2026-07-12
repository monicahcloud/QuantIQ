"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import type { SchoolActionState } from "@/lib/types/school-action-state";
import { schoolSchema } from "@/lib/validations/school";

const schoolsPath = "/admin/education-engine/schools";

function revalidateSchools() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath("/admin/education-engine/authorities");
  revalidatePath("/admin/education-engine/organizations");
  revalidatePath("/admin/education-engine/administrative-divisions");
  revalidatePath("/admin/education-engine/localities");
  revalidatePath(schoolsPath);
}

function optionalFormValue(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "" || value === "NONE") {
    return undefined;
  }

  return value.trim();
}

export async function createSchool(
  _previousState: SchoolActionState,
  formData: FormData,
): Promise<SchoolActionState> {
  await requireAdmin();

  const parsed = schoolSchema.safeParse({
    countryId: formData.get("countryId"),

    authorityId: optionalFormValue(formData.get("authorityId")),

    organizationId: optionalFormValue(formData.get("organizationId")),

    administrativeDivisionId: optionalFormValue(
      formData.get("administrativeDivisionId"),
    ),

    localityId: optionalFormValue(formData.get("localityId")),

    name: formData.get("name"),
    slug: formData.get("slug"),
    schoolCode: optionalFormValue(formData.get("schoolCode")),
    type: formData.get("type"),
    description: optionalFormValue(formData.get("description")),

    addressLine1: optionalFormValue(formData.get("addressLine1")),
    addressLine2: optionalFormValue(formData.get("addressLine2")),
    postalCode: optionalFormValue(formData.get("postalCode")),

    websiteUrl: optionalFormValue(formData.get("websiteUrl")),
    email: optionalFormValue(formData.get("email")),
    phone: optionalFormValue(formData.get("phone")),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const {
    countryId,
    authorityId,
    organizationId,
    administrativeDivisionId,
    localityId,
  } = parsed.data;

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

  if (administrativeDivisionId) {
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

  if (localityId) {
    const locality = await prisma.locality.findFirst({
      where: {
        id: localityId,
        countryId,
        status: "ACTIVE",

        ...(administrativeDivisionId
          ? {
              administrativeDivisionId,
            }
          : {}),
      },
      select: {
        id: true,
      },
    });

    if (!locality) {
      return {
        success: false,
        message:
          "The selected locality does not match the selected country and division.",
        errors: {
          localityId: [
            "Select a locality matching the selected geographic structure.",
          ],
        },
      };
    }
  }

  if (authorityId) {
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
        message:
          "The selected education authority does not belong to this country.",
        errors: {
          authorityId: [
            "Select an authority belonging to the selected country.",
          ],
        },
      };
    }
  }

  if (organizationId) {
    const organization = await prisma.organization.findFirst({
      where: {
        id: organizationId,
        countryId,
        status: "ACTIVE",

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
          "The selected organization does not match the selected country and authority.",
        errors: {
          organizationId: [
            "Select an organization matching the selected governance structure.",
          ],
        },
      };
    }
  }

  try {
    await prisma.school.create({
      data: {
        countryId,
        authorityId: authorityId ?? null,
        organizationId: organizationId ?? null,

        administrativeDivisionId: administrativeDivisionId ?? null,

        localityId: localityId ?? null,

        name: parsed.data.name,
        slug: parsed.data.slug,
        schoolCode: parsed.data.schoolCode ?? null,
        type: parsed.data.type,
        description: parsed.data.description ?? null,

        addressLine1: parsed.data.addressLine1 ?? null,
        addressLine2: parsed.data.addressLine2 ?? null,
        postalCode: parsed.data.postalCode ?? null,

        websiteUrl: parsed.data.websiteUrl ?? null,
        email: parsed.data.email ?? null,
        phone: parsed.data.phone ?? null,

        status: "ACTIVE",
      },
    });

    revalidateSchools();

    return {
      success: true,
      message: "School created successfully.",
    };
  } catch (error) {
    console.error("Unable to create school:", error);

    return {
      success: false,
      message:
        "The school could not be created. Check that its slug and school code are unique for the selected country.",
    };
  }
}

export async function archiveSchool(formData: FormData): Promise<void> {
  await requireAdmin();

  const schoolId = formData.get("schoolId");

  if (typeof schoolId !== "string" || !schoolId) {
    throw new Error("A valid school ID is required.");
  }

  await prisma.school.update({
    where: {
      id: schoolId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  revalidateSchools();
}

export async function restoreSchool(formData: FormData): Promise<void> {
  await requireAdmin();

  const schoolId = formData.get("schoolId");

  if (typeof schoolId !== "string" || !schoolId) {
    throw new Error("A valid school ID is required.");
  }

  await prisma.school.update({
    where: {
      id: schoolId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  revalidateSchools();
}
