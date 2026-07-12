import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  CalendarRange,
  Globe2,
  GraduationCap,
  LibraryBig,
  Map,
  MapPin,
  School,
} from "lucide-react";

import prisma from "@/lib/prisma";

const moduleSections = [
  {
    id: "geography",
    eyebrow: "Geography",
    title: "Countries and Locations",
    description:
      "Define the geographic structure used to organize education systems, authorities, organizations, and schools.",
    modules: [
      {
        title: "Countries",
        description:
          "Manage country-level education configurations and localization.",
        href: "/admin/education-engine/countries",
        icon: Globe2,
        countKey: "countries",
      },
      {
        title: "Administrative Divisions",
        description:
          "Manage islands, states, provinces, parishes, regions, and territories.",
        href: "/admin/education-engine/administrative-divisions",
        icon: Map,
        countKey: "administrativeDivisions",
      },
      {
        title: "Localities",
        description:
          "Manage cities, towns, settlements, villages, districts, and communities.",
        href: "/admin/education-engine/localities",
        icon: MapPin,
        countKey: "localities",
      },
    ],
  },
  {
    id: "governance",
    eyebrow: "Governance",
    title: "Authorities, Organizations, and Schools",
    description:
      "Define who governs education, how institutions are grouped, and where teaching takes place.",
    modules: [
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
          "Manage school networks, districts, private groups, and governing organizations.",
        href: "/admin/education-engine/organizations",
        icon: Building2,
        countKey: "organizations",
      },
      {
        title: "Schools",
        description:
          "Manage schools and their geographic and organizational relationships.",
        href: "/admin/education-engine/schools",
        icon: School,
        countKey: "schools",
      },
    ],
  },
  {
    id: "academic-structure",
    eyebrow: "Academic Structure",
    title: "Levels, Grades, and Subjects",
    description:
      "Configure the academic structure used by curriculum, pacing guides, lessons, and assessments.",
    modules: [
      {
        title: "Education Levels",
        description:
          "Configure preschool, primary, high school, and future education levels.",
        href: "/admin/education-engine/education-levels",
        icon: GraduationCap,
        countKey: "levels",
      },
      {
        title: "Grade Levels",
        description:
          "Manage country-specific grade names, codes, and sequences.",
        href: "/admin/education-engine/grades",
        icon: GraduationCap,
        countKey: "grades",
      },
      {
        title: "Subjects",
        description:
          "Manage country-level subjects used throughout the education platform.",
        href: "/admin/education-engine/subjects",
        icon: LibraryBig,
        countKey: "subjects",
      },
      {
        title: "Grade–Subject Mapping",
        description:
          "Assign subjects to the grade levels where they are taught.",
        href: "/admin/education-engine/grade-subjects",
        icon: BookOpenCheck,
        countKey: "gradeSubjects",
      },
    ],
  },
  {
    id: "calendar",
    eyebrow: "Academic Calendar",
    title: "Years, Terms, Weeks, and Events",
    description:
      "Manage the instructional calendar and rules used by lesson planning, pacing, and forecasting.",
    modules: [
      {
        title: "Academic Years",
        description:
          "Manage school-year boundaries and current academic years.",
        href: "/admin/education-engine/academic-years",
        icon: CalendarRange,
        countKey: "academicYears",
      },
      {
        title: "Academic Calendar",
        description:
          "Manage terms, generated weeks, calendar events, and settings.",
        href: "/admin/education-engine/academic-calendar",
        icon: CalendarRange,
        countKey: "academicPeriods",
      },
    ],
  },
] as const;

export default async function EducationEnginePage() {
  const [
    countries,
    administrativeDivisions,
    localities,
    authorities,
    organizations,
    schools,
    levels,
    grades,
    subjects,
    gradeSubjects,
    academicYears,
    academicPeriods,
  ] = await prisma.$transaction([
    prisma.country.count(),
    prisma.administrativeDivision.count(),
    prisma.locality.count(),
    prisma.educationAuthority.count(),
    prisma.organization.count(),
    prisma.school.count(),
    prisma.educationLevel.count(),
    prisma.gradeLevel.count(),
    prisma.subject.count(),
    prisma.gradeSubject.count({
      where: {
        status: "ACTIVE",
      },
    }),
    prisma.academicYear.count(),
    prisma.academicPeriod.count({
      where: {
        status: "ACTIVE",
      },
    }),
  ]);

  const counts = {
    countries,
    administrativeDivisions,
    localities,
    authorities,
    organizations,
    schools,
    levels,
    grades,
    subjects,
    gradeSubjects,
    academicYears,
    academicPeriods,
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-10">
      <header className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#041334] via-[#0a3b8f] to-violet-700 px-7 py-9 text-white shadow-xl sm:px-9 lg:px-10">
        <h1 className="mt-3 text-3xl text-white font-black tracking-[-0.03em] sm:text-4xl lg:text-5xl">
          Education Engine
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-white/80">
          Configure the geographic, governance, academic, and calendar
          structures that power curriculum intelligence, lesson planning,
          assessments, and reporting.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <SummaryBadge label="Countries" value={countries} />
          <SummaryBadge label="Schools" value={schools} />
          <SummaryBadge label="Grades" value={grades} />
          <SummaryBadge label="Subjects" value={subjects} />
        </div>
      </header>

      {moduleSections.map((section) => (
        <section key={section.id} className="space-y-5">
          <div className="border-b border-slate-200 pb-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              {section.eyebrow}
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.02em] text-[#071d4e]">
              {section.title}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
              {section.description}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {section.modules.map((module) => {
              const Icon = module.icon;

              return (
                <Link
                  key={module.href}
                  href={module.href}
                  className="group flex min-h-64 flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                      <Icon className="h-6 w-6" />
                    </div>

                    <p className="text-3xl font-black text-[#071d4e]">
                      {counts[module.countKey]}
                    </p>
                  </div>

                  <h3 className="mt-5 text-lg font-black text-[#071d4e]">
                    {module.title}
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                    {module.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-700">
                    Manage
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <section className="rounded-[30px] border border-dashed border-blue-200 bg-blue-50/60 p-7 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
          Coming next
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#071d4e]">
          Curriculum Intelligence
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Curriculum versions, source documents, standards, benchmarks,
          objectives, pacing guides, resources, and governed AI generation will
          be added after the governance foundation is complete.
        </p>
      </section>
    </div>
  );
}

function SummaryBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-100">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-white">{value}</p>
    </div>
  );
}
