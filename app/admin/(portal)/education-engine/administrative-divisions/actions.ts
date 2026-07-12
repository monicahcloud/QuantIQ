"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import type { AdministrativeDivisionActionState } from "@/lib/types/administrative-division-action-state";
import { administrativeDivisionSchema } from "@/lib/validations/administrative-division";

const divisionsPath = "/admin/education-engine/administrative-divisions";

function revalidateAdministrativeDivisions() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath(divisionsPath);
}

export async function createAdministrativeDivision(
  _previousState: AdministrativeDivisionActionState,
  formData: FormData,
): Promise<AdministrativeDivisionActionState> {
  await requireAdmin();

  const parsed = administrativeDivisionSchema.safeParse({
    countryId: formData.get("countryId"),
    parentDivisionId: formData.get("parentDivisionId") || undefined,
    name: formData.get("name"),
    code: formData.get("code") || undefined,
    slug: formData.get("slug"),
    type: formData.get("type"),
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

  if (parsed.data.parentDivisionId) {
    const parentDivision = await prisma.administrativeDivision.findFirst({
      where: {
        id: parsed.data.parentDivisionId,
        countryId: parsed.data.countryId,
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    if (!parentDivision) {
      return {
        success: false,
        message:
          "The selected parent division does not belong to this country.",
        errors: {
          parentDivisionId: [
            "Select a parent division from the selected country.",
          ],
        },
      };
    }
  }

  try {
    await prisma.administrativeDivision.create({
      data: {
        countryId: parsed.data.countryId,
        parentDivisionId: parsed.data.parentDivisionId || null,
        name: parsed.data.name,
        code: parsed.data.code || null,
        slug: parsed.data.slug,
        type: parsed.data.type,
        description: parsed.data.description || null,
        sequence: parsed.data.sequence,
        status: "ACTIVE",
      },
    });

    revalidateAdministrativeDivisions();

    return {
      success: true,
      message: "Administrative division created successfully.",
    };
  } catch (error) {
    console.error("Unable to create administrative division:", error);

    return {
      success: false,
      message:
        "The administrative division could not be created. Check that its slug and code are unique for this country.",
    };
  }
}

export async function archiveAdministrativeDivision(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const divisionId = formData.get("divisionId");

  if (typeof divisionId !== "string" || !divisionId) {
    throw new Error("A valid administrative division ID is required.");
  }

  await prisma.administrativeDivision.update({
    where: {
      id: divisionId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  revalidateAdministrativeDivisions();
}

export async function restoreAdministrativeDivision(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const divisionId = formData.get("divisionId");

  if (typeof divisionId !== "string" || !divisionId) {
    throw new Error("A valid administrative division ID is required.");
  }

  await prisma.administrativeDivision.update({
    where: {
      id: divisionId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  revalidateAdministrativeDivisions();
}
