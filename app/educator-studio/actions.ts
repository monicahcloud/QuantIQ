"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";

function getString(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function getStringArray(formData: FormData, name: string) {
  const value = getString(formData, name);

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function completeEducatorOnboarding(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  const schoolName = getString(formData, "schoolName");
  const teacherRole = getString(formData, "teacherRole");
  const country = getString(formData, "country");
  const curriculum = getString(formData, "curriculum");
  const examFocus = getString(formData, "examFocus");
  const teachingGoals = getString(formData, "teachingGoals");
  const classSizeValue = getString(formData, "classSize");

  const gradeLevels = getStringArray(formData, "gradeLevels");
  const subjects = getStringArray(formData, "subjects");

  if (!teacherRole) {
    throw new Error("Teacher role is required.");
  }

  if (gradeLevels.length === 0) {
    throw new Error("At least one grade level is required.");
  }

  if (subjects.length === 0) {
    throw new Error("At least one subject is required.");
  }

  const parsedClassSize = Number.parseInt(classSizeValue, 10);

  const classSize =
    classSizeValue && Number.isFinite(parsedClassSize) ? parsedClassSize : null;

  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    null;

  await prisma.educatorProfile.upsert({
    where: {
      clerkUserId: userId,
    },

    update: {
      email,
      firstName: user?.firstName ?? null,
      lastName: user?.lastName ?? null,
      schoolName: schoolName || null,
      teacherRole,
      country: country || null,
      curriculum: curriculum || null,
      examFocus: examFocus || null,
      teachingGoals: teachingGoals || null,
      gradeLevels,
      subjects,
      classSize,
      onboardingComplete: true,
    },

    create: {
      clerkUserId: userId,
      email,
      firstName: user?.firstName ?? null,
      lastName: user?.lastName ?? null,
      schoolName: schoolName || null,
      teacherRole,
      country: country || null,
      curriculum: curriculum || null,
      examFocus: examFocus || null,
      teachingGoals: teachingGoals || null,
      gradeLevels,
      subjects,
      classSize,
      onboardingComplete: true,
    },
  });

  redirect("/educator-studio/dashboard");
}
