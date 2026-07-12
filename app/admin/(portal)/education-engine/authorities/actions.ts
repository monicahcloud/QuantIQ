"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import type { EducationAuthorityActionState } from "@/lib/types/education-authority-action-state";
import { educationAuthoritySchema } from "@/lib/validations/education-authority";

const authoritiesPath = "/admin/education-engine/authorities";

function revalidateAuthorities() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath("/admin/education-engine/administrative-divisions");
  revalidatePath("/admin/education-engine/localities");
  revalidatePath(authoritiesPath);
}

export async function createEducationAuthority(
  _previousState: EducationAuthorityActionState,
  formData: FormData,
): Promise<EducationAuthorityActionState> {
  await requireAdmin();

  const parsed = educationAuthoritySchema.safeParse({
    countryId: formData.get("countryId"),

    administrativeDivisionId:
      formData.get("administrativeDivisionId") || undefined,

    localityId: formData.get("localityId") || undefined,

    name: formData.get("name"),
    slug: formData.get("slug"),
    type: formData.get("type"),

    description: formData.get("description") || undefined,
    websiteUrl: formData.get("websiteUrl") || undefined,
    email: formData.get("email") || undefined,
    phone: formData.get("phone") || undefined,
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

  if (parsed.data.administrativeDivisionId) {
    const division = await prisma.administrativeDivision.findFirst({
      where: {
        id: parsed.data.administrativeDivisionId,
        countryId: parsed.data.countryId,
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

  if (parsed.data.localityId) {
    const locality = await prisma.locality.findFirst({
      where: {
        id: parsed.data.localityId,
        countryId: parsed.data.countryId,
        status: "ACTIVE",

        ...(parsed.data.administrativeDivisionId
          ? {
              administrativeDivisionId: parsed.data.administrativeDivisionId,
            }
          : {}),
      },
      select: {
        id: true,
        administrativeDivisionId: true,
      },
    });

    if (!locality) {
      return {
        success: false,
        message:
          "The selected locality does not belong to the selected country and division.",
        errors: {
          localityId: [
            "Select a locality matching the selected geographic structure.",
          ],
        },
      };
    }
  }

  try {
    await prisma.educationAuthority.create({
      data: {
        countryId: parsed.data.countryId,

        administrativeDivisionId: parsed.data.administrativeDivisionId || null,

        localityId: parsed.data.localityId || null,

        name: parsed.data.name,
        slug: parsed.data.slug,
        type: parsed.data.type,

        description: parsed.data.description || null,
        websiteUrl: parsed.data.websiteUrl || null,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,

        status: "ACTIVE",
      },
    });

    revalidateAuthorities();

    return {
      success: true,
      message: "Education authority created successfully.",
    };
  } catch (error) {
    console.error("Unable to create education authority:", error);

    return {
      success: false,
      message:
        "The education authority could not be created. Check that its slug is unique for the selected country.",
    };
  }
}

export async function archiveEducationAuthority(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const authorityId = formData.get("authorityId");

  if (typeof authorityId !== "string" || !authorityId) {
    throw new Error("A valid education authority ID is required.");
  }

  await prisma.educationAuthority.update({
    where: {
      id: authorityId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  revalidateAuthorities();
}

export async function restoreEducationAuthority(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const authorityId = formData.get("authorityId");

  if (typeof authorityId !== "string" || !authorityId) {
    throw new Error("A valid education authority ID is required.");
  }

  await prisma.educationAuthority.update({
    where: {
      id: authorityId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  revalidateAuthorities();
}
