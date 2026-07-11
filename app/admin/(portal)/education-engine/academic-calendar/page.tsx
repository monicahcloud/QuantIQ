import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";

export default async function AcademicCalendarPage() {
  const currentYears = await prisma.academicYear.findMany({
    where: {
      status: "ACTIVE",
      isCurrent: true,
    },
    include: {
      country: {
        select: {
          name: true,
          iso2Code: true,
        },
      },
      periods: {
        where: {
          status: "ACTIVE",
        },
        orderBy: {
          sequence: "asc",
        },
      },
      weeks: {
        where: {
          status: "ACTIVE",
        },
        orderBy: {
          weekNumber: "asc",
        },
      },
    },
    orderBy: {
      country: {
        name: "asc",
      },
    },
  });

  return (
    <div className="space-y-7">
      {currentYears.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
          <CalendarRange className="mx-auto h-10 w-10 text-slate-300" />

          <h2 className="mt-4 text-xl font-black text-[#071d4e]">
            No current academic year
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Create an academic year and mark it as current before configuring
            terms and instructional weeks.
          </p>

          <Link
            href="/admin/education-engine/academic-years"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white">
            Manage Academic Years
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {currentYears.map((academicYear) => {
            const instructionalWeeks = academicYear.weeks.filter(
              (week) => week.isInstructional,
            ).length;

            const nonInstructionalWeeks =
              academicYear.weeks.length - instructionalWeeks;

            return (
              <section
                key={academicYear.id}
                className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
                <div className="bg-gradient-to-r from-[#071d4e] via-blue-800 to-violet-700 px-6 py-7 text-white sm:px-8">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className="bg-white/15 text-white hover:bg-white/15">
                          {academicYear.country.iso2Code}
                        </Badge>

                        <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                          Current
                        </Badge>
                      </div>

                      <h2 className="mt-4 text-3xl font-black text-white">
                        {academicYear.country.name}
                      </h2>

                      <p className="mt-2 text-lg font-bold text-blue-100">
                        Academic Year {academicYear.name}
                      </p>

                      <p className="mt-2 text-sm text-blue-100/80">
                        {formatDate(academicYear.startDate)} –{" "}
                        {formatDate(academicYear.endDate)}
                      </p>
                    </div>

                    <Link
                      href="/admin/education-engine/academic-years"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#071d4e]">
                      Manage Year
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-4 sm:p-8">
                  <CalendarMetric
                    label="Terms"
                    value={academicYear.periods.length}
                    description="Configured academic periods"
                    icon={CalendarDays}
                    href="/admin/education-engine/academic-calendar/terms"
                  />

                  <CalendarMetric
                    label="Total Weeks"
                    value={academicYear.weeks.length}
                    description="Weeks currently generated"
                    icon={Clock3}
                    href="/admin/education-engine/academic-calendar/weeks"
                  />

                  <CalendarMetric
                    label="Instructional"
                    value={instructionalWeeks}
                    description="Active teaching weeks"
                    icon={CheckCircle2}
                    href="/admin/education-engine/academic-calendar/weeks"
                  />

                  <CalendarMetric
                    label="Breaks"
                    value={nonInstructionalWeeks}
                    description="Non-instructional weeks"
                    icon={Sparkles}
                    href="/admin/education-engine/academic-calendar/holidays"
                  />
                </div>

                <div className="border-t border-slate-200 px-6 py-6 sm:px-8">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                    Academic periods
                  </p>

                  {academicYear.periods.length ? (
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      {academicYear.periods.map((period) => (
                        <div
                          key={period.id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                          <p className="font-black text-[#071d4e]">
                            {period.name}
                          </p>

                          <p className="mt-2 text-sm text-slate-500">
                            {formatDate(period.startDate)}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            through {formatDate(period.endDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">
                      No terms have been configured for this academic year.
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CalendarMetric({
  label,
  value,
  description,
  icon: Icon,
  href,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-black text-[#071d4e]">{value}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">{description}</p>

      <span className="mt-4 inline-flex items-center gap-2 text-xs font-black text-blue-700">
        Manage
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-BS", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
