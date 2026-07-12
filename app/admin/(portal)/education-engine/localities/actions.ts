"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import { localitySchema } from "@/lib/validations/locality";
import { LocalityActionState } from "@/lib/types/locality-action-state";

const localitiesPath = "/admin/education-engine/localities";

function revalidateLocalities() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath("/admin/education-engine/administrative-divisions");
  revalidatePath(localitiesPath);
}

export async function createLocality(
  _previousState: LocalityActionState,
  formData: FormData,
): Promise<LocalityActionState> {
  await requireAdmin();

  const parsed = localitySchema.safeParse({
    countryId: formData.get("countryId"),
    administrativeDivisionId: formData.get("administrativeDivisionId"),
    name: formData.get("name"),
    code: formData.get("code") || undefined,
    slug: formData.get("slug"),
    type: formData.get("type"),
    description: formData.get("description") || undefined,
    postalCode: formData.get("postalCode") || undefined,
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    sequence: formData.get("sequence"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

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

  try {
    await prisma.locality.create({
      data: {
        countryId: parsed.data.countryId,
        administrativeDivisionId: parsed.data.administrativeDivisionId,
        name: parsed.data.name,
        code: parsed.data.code || null,
        slug: parsed.data.slug,
        type: parsed.data.type,
        description: parsed.data.description || null,
        postalCode: parsed.data.postalCode || null,
        latitude: parsed.data.latitude,
        longitude: parsed.data.longitude,
        sequence: parsed.data.sequence,
        status: "ACTIVE",
      },
    });

    revalidateLocalities();

    return {
      success: true,
      message: "Locality created successfully.",
    };
  } catch (error) {
    console.error("Unable to create locality:", error);

    return {
      success: false,
      message:
        "The locality could not be created. Check that its slug and name are unique.",
    };
  }
}

export async function archiveLocality(formData: FormData): Promise<void> {
  await requireAdmin();

  const localityId = formData.get("localityId");

  if (typeof localityId !== "string" || !localityId) {
    throw new Error("A valid locality ID is required.");
  }

  await prisma.locality.update({
    where: {
      id: localityId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  revalidateLocalities();
}

export async function restoreLocality(formData: FormData): Promise<void> {
  await requireAdmin();

  const localityId = formData.get("localityId");

  if (typeof localityId !== "string" || !localityId) {
    throw new Error("A valid locality ID is required.");
  }

  await prisma.locality.update({
    where: {
      id: localityId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  revalidateLocalities();
}
