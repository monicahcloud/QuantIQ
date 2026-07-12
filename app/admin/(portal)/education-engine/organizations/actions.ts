"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import { OrganizationActionState } from "@/lib/types/organization-action-state";
import { organizationSchema } from "@/lib/validations/organization";

const organizationsPath = "/admin/education-engine/organizations";

function revalidateOrganizations() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath("/admin/education-engine/authorities");
  revalidatePath("/admin/education-engine/administrative-divisions");
  revalidatePath("/admin/education-engine/localities");
  revalidatePath(organizationsPath);
}

function optionalFormValue(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value === "" || value === "NONE") {
    return undefined;
  }

  return value;
}

export async function createOrganization(
  _previousState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  await requireAdmin();

  const parsed = organizationSchema.safeParse({
    countryId: formData.get("countryId"),

    authorityId: optionalFormValue(formData.get("authorityId")),

    parentOrganizationId: optionalFormValue(
      formData.get("parentOrganizationId"),
    ),

    administrativeDivisionId: optionalFormValue(
      formData.get("administrativeDivisionId"),
    ),

    localityId: optionalFormValue(formData.get("localityId")),

    name: formData.get("name"),
    slug: formData.get("slug"),
    type: formData.get("type"),

    description: optionalFormValue(formData.get("description")),
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
    parentOrganizationId,
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

  if (parentOrganizationId) {
    const parentOrganization = await prisma.organization.findFirst({
      where: {
        id: parentOrganizationId,
        countryId,
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    if (!parentOrganization) {
      return {
        success: false,
        message:
          "The selected parent organization does not belong to this country.",
        errors: {
          parentOrganizationId: [
            "Select a parent organization from the selected country.",
          ],
        },
      };
    }
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

  try {
    await prisma.organization.create({
      data: {
        countryId,
        authorityId: authorityId ?? null,
        parentOrganizationId: parentOrganizationId ?? null,
        administrativeDivisionId: administrativeDivisionId ?? null,
        localityId: localityId ?? null,

        name: parsed.data.name,
        slug: parsed.data.slug,
        type: parsed.data.type,

        description: parsed.data.description ?? null,
        websiteUrl: parsed.data.websiteUrl ?? null,
        email: parsed.data.email ?? null,
        phone: parsed.data.phone ?? null,

        status: "ACTIVE",
      },
    });

    revalidateOrganizations();

    return {
      success: true,
      message: "Organization created successfully.",
    };
  } catch (error) {
    console.error("Unable to create organization:", error);

    return {
      success: false,
      message:
        "The organization could not be created. Check that its slug is unique for the selected country.",
    };
  }
}

export async function archiveOrganization(formData: FormData): Promise<void> {
  await requireAdmin();

  const organizationId = formData.get("organizationId");

  if (typeof organizationId !== "string" || !organizationId) {
    throw new Error("A valid organization ID is required.");
  }

  await prisma.organization.update({
    where: {
      id: organizationId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  revalidateOrganizations();
}

export async function restoreOrganization(formData: FormData): Promise<void> {
  await requireAdmin();

  const organizationId = formData.get("organizationId");

  if (typeof organizationId !== "string" || !organizationId) {
    throw new Error("A valid organization ID is required.");
  }

  await prisma.organization.update({
    where: {
      id: organizationId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  revalidateOrganizations();
}
