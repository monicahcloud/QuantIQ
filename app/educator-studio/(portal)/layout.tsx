import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import DashboardSidebar from "@/components/educator-studio/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/educator-studio/dashboard/DashboardHeader";

export default async function EducatorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await prisma.educatorProfile.findUnique({
    where: {
      clerkUserId: userId,
    },
    select: {
      onboardingComplete: true,
    },
  });

  if (!profile?.onboardingComplete) {
    redirect("/educator-studio/onboarding");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="min-h-screen lg:pl-72">
        <DashboardHeader />

        <main className="px-5 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
