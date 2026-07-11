"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import { AcademicCalendarSettingActionState } from "@/lib/types/academic-calendar-settings";
import { academicCalendarSettingSchema } from "@/lib/validations/academic-calendar-settings";
const calendarPath = "/admin/education-engine/academic-calendar";
const settingsPath = `${calendarPath}/settings`;

function revalidateCalendarSettings() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/education-engine");
  revalidatePath(calendarPath);
  revalidatePath(`${calendarPath}/weeks`);
  revalidatePath(settingsPath);
}

export async function saveAcademicCalendarSettings(
  _previousState: AcademicCalendarSettingActionState,
  formData: FormData,
): Promise<AcademicCalendarSettingActionState> {
  await requireAdmin();

  const parsed = academicCalendarSettingSchema.safeParse({
    countryId: formData.get("countryId"),

    weekStartsOn: formData.get("weekStartsOn"),

    instructionalDays: formData.getAll("instructionalDays"),

    defaultPeriodType: formData.get("defaultPeriodType"),

    defaultLocale: formData.get("defaultLocale"),

    defaultTimeZone: formData.get("defaultTimeZone"),

    autoAssignWeeksToTerms: formData.get("autoAssignWeeksToTerms") === "on",

    outsideTermsNonInstructional:
      formData.get("outsideTermsNonInstructional") === "on",
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
    await prisma.academicCalendarSetting.upsert({
      where: {
        countryId: parsed.data.countryId,
      },

      update: {
        weekStartsOn: parsed.data.weekStartsOn,
        instructionalDays: parsed.data.instructionalDays,
        defaultPeriodType: parsed.data.defaultPeriodType,
        defaultLocale: parsed.data.defaultLocale,
        defaultTimeZone: parsed.data.defaultTimeZone,
        autoAssignWeeksToTerms: parsed.data.autoAssignWeeksToTerms,
        outsideTermsNonInstructional: parsed.data.outsideTermsNonInstructional,
      },

      create: {
        countryId: parsed.data.countryId,
        weekStartsOn: parsed.data.weekStartsOn,
        instructionalDays: parsed.data.instructionalDays,
        defaultPeriodType: parsed.data.defaultPeriodType,
        defaultLocale: parsed.data.defaultLocale,
        defaultTimeZone: parsed.data.defaultTimeZone,
        autoAssignWeeksToTerms: parsed.data.autoAssignWeeksToTerms,
        outsideTermsNonInstructional: parsed.data.outsideTermsNonInstructional,
      },
    });

    revalidateCalendarSettings();

    return {
      success: true,
      message: "Academic calendar settings saved successfully.",
    };
  } catch (error) {
    console.error("Unable to save academic calendar settings:", error);

    return {
      success: false,
      message: "The academic calendar settings could not be saved.",
    };
  }
}
