import { auth, currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

import DashboardWelcome from "@/components/educator-studio/dashboard/DashboardWelcome";
import DashboardStats from "@/components/educator-studio/dashboard/DashboardStats";
import DashboardQuickActions from "@/components/educator-studio/dashboard/DashboardQuickActions";
import ClassPerformanceCard from "@/components/educator-studio/dashboard/ClassPerformanceCard";
import ForecastedWeakAreasCard from "@/components/educator-studio/dashboard/ForecastedWeakAreasCard";
import UpcomingLessonsCard from "@/components/educator-studio/dashboard/UpcomingLessonsCard";
import RecentResourcesCard from "@/components/educator-studio/dashboard/RecentResourcesCard";
import AiAssistantBanner from "@/components/educator-studio/dashboard/AiAssistantBanner";

export default async function EducatorDashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [user, profile] = await Promise.all([
    currentUser(),

    prisma.educatorProfile.findUnique({
      where: {
        clerkUserId: userId,
      },
    }),
  ]);

  const firstName = user?.firstName ?? profile?.firstName ?? "Educator";

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <DashboardWelcome firstName={firstName} />

      <DashboardStats />

      <DashboardQuickActions />

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr_0.95fr]">
        <ClassPerformanceCard />

        <ForecastedWeakAreasCard />

        <div className="grid gap-5">
          <UpcomingLessonsCard />
          <RecentResourcesCard />
        </div>
      </section>

      <AiAssistantBanner />
    </div>
  );
}
