import { Archive, CalendarDays, RotateCcw } from "lucide-react";

import { archiveAcademicTerm, restoreAcademicTerm } from "./actions";

import CreateAcademicTermForm from "@/components/admin/education-engine/academic-calendar/terms/CreateAcademicTermForm";
import AdminEmptyState from "@/components/admin/shared/AdminEmptyState";
import AdminSearchBar from "@/components/admin/shared/AdminSearchBar";
import AdminStatusBadge from "@/components/admin/shared/AdminStatusBadge";
import AdminTableShell from "@/components/admin/shared/AdminTableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

type AcademicTermsPageProps = {
  searchParams: Promise<{
    q?: string;
    country?: string;
    year?: string;
  }>;
};

export default async function AcademicTermsPage({
  searchParams,
}: AcademicTermsPageProps) {
  const { q = "", country = "", year = "" } = await searchParams;

  const search = q.trim();
  const countryId = country.trim();
  const academicYearId = year.trim();

  const [countries, academicYears, terms] = await Promise.all([
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
                  code: {
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

        _count: {
          select: {
            weeks: true,
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
          sequence: "asc",
        },
      ],
    }),
  ]);

  const yearOptions = countryId
    ? academicYears.filter(
        (academicYear) => academicYear.countryId === countryId,
      )
    : academicYears;

  const formAcademicYears = academicYears.map((academicYear) => ({
    id: academicYear.id,
    countryId: academicYear.countryId,
    name: academicYear.name,
    startDate: toDateInput(academicYear.startDate),
    endDate: toDateInput(academicYear.endDate),
  }));

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
            Academic Calendar
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#071d4e]">
            Terms and Academic Periods
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Configure terms, semesters, quarters, and other instructional
            periods within each academic year.
          </p>
        </div>

        <CreateAcademicTermForm
          countries={countries}
          academicYears={formAcademicYears}
        />
      </div>

      <AdminTableShell
        toolbar={
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <AdminSearchBar
              defaultValue={search}
              placeholder="Search terms..."
            />

            <form className="flex flex-col gap-3 sm:flex-row">
              {search && <input type="hidden" name="q" value={search} />}

              <select
                name="country"
                defaultValue={countryId}
                className="h-12 min-w-52 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
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
                className="h-12 min-w-52 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                <option value="">All academic years</option>

                {yearOptions.map((academicYear) => (
                  <option key={academicYear.id} value={academicYear.id}>
                    {academicYear.name}
                  </option>
                ))}
              </select>

              <Button type="submit" variant="outline">
                Apply Filters
              </Button>
            </form>
          </div>
        }>
        {terms.length === 0 ? (
          <AdminEmptyState
            icon={CalendarDays}
            title="No academic terms found"
            description="Add an academic term or adjust the current search and filters."
          />
        ) : (
          <table className="w-full min-w-[1100px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeading>Academic period</TableHeading>
                <TableHeading>Country</TableHeading>
                <TableHeading>Academic year</TableHeading>
                <TableHeading>Type</TableHeading>
                <TableHeading>Date range</TableHeading>
                <TableHeading>Weeks</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading className="text-right">Actions</TableHeading>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {terms.map((term) => (
                <tr key={term.id} className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <CalendarDays className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-black text-[#071d4e]">{term.name}</p>

                        <p className="mt-1 text-xs text-slate-500">
                          {term.code} · Sequence {term.sequence}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {term.academicYear.country.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {term.academicYear.country.iso2Code}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {term.academicYear.name}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <Badge variant="secondary">{formatLabel(term.type)}</Badge>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {formatDate(term.startDate)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      through {formatDate(term.endDate)}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-slate-700">
                      {term._count.weeks}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      assigned weeks
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <AdminStatusBadge status={term.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    {term.status === "ARCHIVED" ? (
                      <form action={restoreAcademicTerm}>
                        <input
                          type="hidden"
                          name="academicTermId"
                          value={term.id}
                        />

                        <Button type="submit" size="sm" variant="outline">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                      </form>
                    ) : (
                      <form action={archiveAcademicTerm}>
                        <input
                          type="hidden"
                          name="academicTermId"
                          value={term.id}
                        />

                        <Button
                          type="submit"
                          size="sm"
                          variant="ghost"
                          className="text-slate-500 hover:text-red-700">
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </Button>
                      </form>
                    )}
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

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
