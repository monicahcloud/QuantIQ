"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import type { CountryActionState } from "@/lib/types/country-action-state";
import { countrySchema } from "@/lib/validations/country";

export async function createCountry(
  previousState: CountryActionState,
  formData: FormData,
): Promise<CountryActionState> {
  await requireAdmin();

  const parsed = countrySchema.safeParse({
    name: formData.get("name"),
    officialName: formData.get("officialName") || undefined,
    iso2Code: formData.get("iso2Code"),
    iso3Code: formData.get("iso3Code"),
    slug: formData.get("slug"),
    defaultLocale: formData.get("defaultLocale"),
    defaultTimeZone: formData.get("defaultTimeZone") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.country.create({
      data: {
        ...parsed.data,
        officialName: parsed.data.officialName || null,
        defaultTimeZone: parsed.data.defaultTimeZone || null,
        status: "ACTIVE",
      },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/education-engine");
    revalidatePath("/admin/education-engine/countries");

    return {
      success: true,
      message: "Country created successfully.",
    };
  } catch (error) {
    console.error("Unable to create country:", error);

    return {
      success: false,
      message:
        "The country could not be created. Check that the codes and slug are unique.",
    };
  }
}

export async function archiveCountry(formData: FormData): Promise<void> {
  await requireAdmin();

  const countryId = formData.get("countryId");

  if (typeof countryId !== "string" || !countryId) {
    throw new Error("A valid country ID is required.");
  }

  await prisma.country.update({
    where: {
      id: countryId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath("/admin/education-engine/countries");
}

export async function restoreCountry(formData: FormData): Promise<void> {
  await requireAdmin();

  const countryId = formData.get("countryId");

  if (typeof countryId !== "string" || !countryId) {
    throw new Error("A valid country ID is required.");
  }

  await prisma.country.update({
    where: {
      id: countryId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath("/admin/education-engine/countries");
}
