import { CalendarCheck2, CalendarX2, Clock3 } from "lucide-react";

import GenerateAcademicWeeksForm from "@/components/admin/education-engine/academic-calendar/weeks/GenerateAcademicWeeksForm";
import WeekStatusActions from "@/components/admin/education-engine/academic-calendar/weeks/WeekStatusActions";
import AdminEmptyState from "@/components/admin/shared/AdminEmptyState";
import AdminSearchBar from "@/components/admin/shared/AdminSearchBar";
import AdminStatusBadge from "@/components/admin/shared/AdminStatusBadge";
import AdminTableShell from "@/components/admin/shared/AdminTableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

type AcademicWeeksPageProps = {
  searchParams: Promise<{
    q?: string;
    country?: string;
    year?: string;
    term?: string;
    type?: string;
  }>;
};

export default async function AcademicWeeksPage({
  searchParams,
}: AcademicWeeksPageProps) {
  const {
    q = "",
    country = "",
    year = "",
    term = "",
    type = "",
  } = await searchParams;

  const search = q.trim();
  const countryId = country.trim();
  const academicYearId = year.trim();
  const academicPeriodId = term.trim();
  const weekType = type.trim();

  const [countries, academicYears, academicPeriods, weeks] = await Promise.all([
    prisma.country.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.academicYear.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        countryId: true,
        name: true,
        startDate: true,
        endDate: true,
        country: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            periods: {
              where: {
                status: "ACTIVE",
              },
            },
            weeks: true,
          },
        },
      },
      orderBy: [
        {
          country: {
            name: "asc",
          },
        },
        {
          startDate: "desc",
        },
      ],
    }),

    prisma.academicPeriod.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        academicYearId: true,
        name: true,
        sequence: true,
      },
      orderBy: {
        sequence: "asc",
      },
    }),

    prisma.academicWeek.findMany({
      where: {
        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  notes: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),

        ...(academicYearId
          ? {
              academicYearId,
            }
          : countryId
            ? {
                academicYear: {
                  countryId,
                },
              }
            : {}),

        ...(academicPeriodId
          ? {
              academicPeriodId,
            }
          : {}),

        ...(weekType === "instructional"
          ? {
              isInstructional: true,
            }
          : weekType === "break"
            ? {
                isInstructional: false,
              }
            : {}),
      },

      include: {
        academicYear: {
          select: {
            name: true,
            country: {
              select: {
                name: true,
                iso2Code: true,
              },
            },
          },
        },

        academicPeriod: {
          select: {
            name: true,
            code: true,
          },
        },
      },

      orderBy: [
        {
          academicYear: {
            country: {
              name: "asc",
            },
          },
        },
        {
          academicYear: {
            startDate: "desc",
          },
        },
        {
          weekNumber: "asc",
        },
      ],
    }),
  ]);

  const yearOptions = countryId
    ? academicYears.filter(
        (academicYear) => academicYear.countryId === countryId,
      )
    : academicYears;

  const termOptions = academicYearId
    ? academicPeriods.filter(
        (period) => period.academicYearId === academicYearId,
      )
    : academicPeriods;

  const generatorYears = academicYears.map((academicYear) => ({
    id: academicYear.id,
    countryId: academicYear.countryId,
    countryName: academicYear.country.name,
    name: academicYear.name,
    startDate: toDateInput(academicYear.startDate),
    endDate: toDateInput(academicYear.endDate),
    termCount: academicYear._count.periods,
    weekCount: academicYear._count.weeks,
  }));

  const instructionalCount = weeks.filter(
    (week) => week.isInstructional,
  ).length;

  const breakCount = weeks.length - instructionalCount;

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
            Academic Calendar
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#071d4e]">
            Academic Weeks
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Generate and manage instructional weeks, break weeks, term
            assignments, and calendar sequencing.
          </p>
        </div>

        <GenerateAcademicWeeksForm
          countries={countries}
          academicYears={generatorYears}
        />
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <WeekMetric
          label="Displayed Weeks"
          value={weeks.length}
          icon={Clock3}
        />

        <WeekMetric
          label="Instructional"
          value={instructionalCount}
          icon={CalendarCheck2}
        />

        <WeekMetric label="Breaks" value={breakCount} icon={CalendarX2} />
      </section>

      <AdminTableShell
        toolbar={
          <div className="space-y-4">
            <AdminSearchBar
              defaultValue={search}
              placeholder="Search academic weeks..."
            />

            <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {search && <input type="hidden" name="q" value={search} />}

              <select
                name="country"
                defaultValue={countryId}
                className={filterClassName}>
                <option value="">All countries</option>

                {countries.map((countryOption) => (
                  <option key={countryOption.id} value={countryOption.id}>
                    {countryOption.name}
                  </option>
                ))}
              </select>

              <select
                name="year"
                defaultValue={academicYearId}
                className={filterClassName}>
                <option value="">All academic years</option>

                {yearOptions.map((academicYear) => (
                  <option key={academicYear.id} value={academicYear.id}>
                    {academicYear.name}
                  </option>
                ))}
              </select>

              <select
                name="term"
                defaultValue={academicPeriodId}
                className={filterClassName}>
                <option value="">All terms</option>

                {termOptions.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.name}
                  </option>
                ))}
              </select>

              <select
                name="type"
                defaultValue={weekType}
                className={filterClassName}>
                <option value="">All week types</option>
                <option value="instructional">Instructional</option>
                <option value="break">Non-instructional</option>
              </select>

              <Button type="submit" variant="outline">
                Apply Filters
              </Button>
            </form>
          </div>
        }>
        {weeks.length === 0 ? (
          <AdminEmptyState
            icon={Clock3}
            title="No academic weeks found"
            description="Generate weeks for an academic year or adjust the current filters."
          />
        ) : (
          <table className="w-full min-w-[1250px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeading>Week</TableHeading>
                <TableHeading>Country</TableHeading>
                <TableHeading>Academic year</TableHeading>
                <TableHeading>Term</TableHeading>
                <TableHeading>Date range</TableHeading>
                <TableHeading>Type</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading className="text-right">Actions</TableHeading>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {weeks.map((week) => (
                <tr key={week.id} className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                          week.isInstructional
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                        {week.isInstructional ? (
                          <CalendarCheck2 className="h-5 w-5" />
                        ) : (
                          <CalendarX2 className="h-5 w-5" />
                        )}
                      </div>

                      <div>
                        <p className="font-black text-[#071d4e]">{week.name}</p>

                        <p className="mt-1 text-xs text-slate-500">
                          Number {week.weekNumber}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {week.academicYear.country.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {week.academicYear.country.iso2Code}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {week.academicYear.name}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    {week.academicPeriod ? (
                      <Badge variant="secondary">
                        {week.academicPeriod.name}
                      </Badge>
                    ) : (
                      <span className="text-sm text-slate-400">
                        No active term
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {formatDate(week.startDate)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      through {formatDate(week.endDate)}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <Badge
                      className={
                        week.isInstructional
                          ? "bg-emerald-600 text-white hover:bg-emerald-600"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                      }>
                      {week.isInstructional ? "Instructional" : "Break"}
                    </Badge>

                    {week.notes && (
                      <p className="mt-2 max-w-48 text-xs leading-5 text-slate-500">
                        {week.notes}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <AdminStatusBadge status={week.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    <WeekStatusActions
                      weekId={week.id}
                      status={week.status}
                      isInstructional={week.isInstructional}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminTableShell>
    </div>
  );
}

const filterClassName =
  "h-12 min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function WeekMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-black text-[#071d4e]">{value}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function TableHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-6 py-4 text-left text-xs font-black uppercase tracking-[0.14em] text-slate-500 ${className}`}>
      {children}
    </th>
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

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}
