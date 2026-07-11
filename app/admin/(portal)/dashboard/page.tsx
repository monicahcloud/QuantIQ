import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  CalendarDays,
  Globe2,
  GraduationCap,
  LibraryBig,
  School,
} from "lucide-react";

import prisma from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [
    countryCount,
    authorityCount,
    organizationCount,
    schoolCount,
    levelCount,
    gradeCount,
    subjectCount,
    academicYearCount,
  ] = await prisma.$transaction([
    prisma.country.count(),
    prisma.educationAuthority.count(),
    prisma.organization.count(),
    prisma.school.count(),
    prisma.educationLevel.count(),
    prisma.gradeLevel.count(),
    prisma.subject.count(),
    prisma.academicYear.count(),
  ]);

  const stats = [
    {
      label: "Countries",
      value: countryCount,
      icon: Globe2,
    },
    {
      label: "Authorities",
      value: authorityCount,
      icon: Building2,
    },
    {
      label: "Organizations",
      value: organizationCount,
      icon: Building2,
    },
    {
      label: "Schools",
      value: schoolCount,
      icon: School,
    },
    {
      label: "Education Levels",
      value: levelCount,
      icon: GraduationCap,
    },
    {
      label: "Grade Levels",
      value: gradeCount,
      icon: GraduationCap,
    },
    {
      label: "Subjects",
      value: subjectCount,
      icon: LibraryBig,
    },
    {
      label: "Academic Years",
      value: academicYearCount,
      icon: CalendarDays,
    },
  ];

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      <section className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#041334] via-[#0a3b8f] to-violet-700 px-7 py-9 text-white shadow-xl sm:px-9 lg:px-10">
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
          Administration Dashboard
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-white/80">
          Manage the foundation data, curriculum intelligence, academic
          calendars, and instructional content that power the QuantIQ platform.
        </p>

        <Link
          href="/admin/education-engine"
          className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-black text-[#071d4e]">
          Open Education Engine
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-4xl font-black text-[#071d4e]">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DashboardCard
          title="Education Engine"
          description="Manage countries, levels, grades, subjects, academic years, terms, and weeks."
          href="/admin/education-engine"
          icon={BookOpenCheck}
        />

        <DashboardCard
          title="Curriculum Management"
          description="Curriculum versioning, source documents, standards, objectives, and instructional content."
          href="/admin/curriculum"
          icon={LibraryBig}
        />
      </section>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
        <Icon className="h-7 w-7" />
      </div>

      <h2 className="mt-5 text-xl font-black text-[#071d4e]">{title}</h2>

      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
        {description}
      </p>

      <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-700">
        Open module
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
