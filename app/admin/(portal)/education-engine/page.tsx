import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CalendarRange,
  Clock3,
  Globe2,
  GraduationCap,
  LibraryBig,
  School,
} from "lucide-react";

import prisma from "@/lib/prisma";

const modules = [
  {
    title: "Countries",
    description:
      "Manage countries and country-specific education configurations.",
    href: "/admin/education-engine/countries",
    icon: Globe2,
    countKey: "countries",
  },
  {
    title: "Education Authorities",
    description:
      "Manage ministries, departments, boards, districts, and regions.",
    href: "/admin/education-engine/authorities",
    icon: Building2,
    countKey: "authorities",
  },
  {
    title: "Organizations",
    description:
      "Manage school networks, districts, private organizations, and governing groups.",
    href: "/admin/education-engine/organizations",
    icon: Building2,
    countKey: "organizations",
  },
  {
    title: "Schools",
    description: "Manage schools and their organizational relationships.",
    href: "/admin/education-engine/schools",
    icon: School,
    countKey: "schools",
  },
  {
    title: "Education Levels",
    description:
      "Configure preschool, primary, high school, and future levels.",
    href: "/admin/education-engine/education-levels",
    icon: GraduationCap,
    countKey: "levels",
  },
  {
    title: "Grade Levels",
    description: "Manage country-specific grade names and sequences.",
    href: "/admin/education-engine/grades",
    icon: GraduationCap,
    countKey: "grades",
  },
  {
    title: "Subjects",
    description: "Manage subjects and their grade-level availability.",
    href: "/admin/education-engine/subjects",
    icon: LibraryBig,
    countKey: "subjects",
  },
  {
    title: "Academic Years",
    description: "Manage school years, active years, and calendar boundaries.",
    href: "/admin/education-engine/academic-years",
    icon: CalendarRange,
    countKey: "academicYears",
  },
  {
    title: "Terms",
    description: "Manage terms, semesters, quarters, and other periods.",
    href: "/admin/education-engine/terms",
    icon: CalendarDays,
    countKey: "terms",
  },
  {
    title: "Weeks",
    description: "Manage instructional and non-instructional academic weeks.",
    href: "/admin/education-engine/weeks",
    icon: Clock3,
    countKey: "weeks",
  },
] as const;

export default async function EducationEnginePage() {
  const [
    countries,
    authorities,
    organizations,
    schools,
    levels,
    grades,
    subjects,
    academicYears,
    terms,
    weeks,
  ] = await prisma.$transaction([
    prisma.country.count(),
    prisma.educationAuthority.count(),
    prisma.organization.count(),
    prisma.school.count(),
    prisma.educationLevel.count(),
    prisma.gradeLevel.count(),
    prisma.subject.count(),
    prisma.academicYear.count(),
    prisma.academicPeriod.count(),
    prisma.academicWeek.count(),
  ]);

  const counts = {
    countries,
    authorities,
    organizations,
    schools,
    levels,
    grades,
    subjects,
    academicYears,
    terms,
    weeks,
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      <header>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
          QuantIQ Administration
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#071d4e] sm:text-4xl">
          Education Engine
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
          Manage the country-specific education structure used by curricula,
          pacing guides, lesson plans, assessments, and reporting.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <Link
              key={module.href}
              href={module.href}
              className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
              <div className="flex items-start justify-between gap-5">
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Icon className="h-6 w-6" />
                </div>

                <p className="text-3xl font-black text-[#071d4e]">
                  {counts[module.countKey]}
                </p>
              </div>

              <h2 className="mt-5 text-lg font-black text-[#071d4e]">
                {module.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {module.description}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-700">
                Manage
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
