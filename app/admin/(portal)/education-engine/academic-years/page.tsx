import { Archive, CalendarRange, CheckCircle2, RotateCcw } from "lucide-react";

import CreateAcademicYearForm from "@/components/admin/education-engine/academic-years/CreateAcademicYearForm";
import AdminEmptyState from "@/components/admin/shared/AdminEmptyState";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminSearchBar from "@/components/admin/shared/AdminSearchBar";
import AdminStatusBadge from "@/components/admin/shared/AdminStatusBadge";
import AdminTableShell from "@/components/admin/shared/AdminTableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import {
  archiveAcademicYear,
  restoreAcademicYear,
  setCurrentAcademicYear,
} from "./action";

type AcademicYearsPageProps = {
  searchParams: Promise<{
    q?: string;
    country?: string;
  }>;
};

export default async function AcademicYearsPage({
  searchParams,
}: AcademicYearsPageProps) {
  const { q = "", country = "" } = await searchParams;

  const search = q.trim();
  const countryId = country.trim();

  const [countries, academicYears] = await Promise.all([
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
                  slug: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),

        ...(countryId ? { countryId } : {}),
      },

      include: {
        country: {
          select: {
            name: true,
            iso2Code: true,
          },
        },

        _count: {
          select: {
            periods: true,
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
  ]);

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <AdminPageHeader
        eyebrow="Education Engine"
        title="Academic Years"
        description="Manage country-specific school years, calendar boundaries, terms, and instructional weeks."
        backHref="/admin/education-engine"
        actions={<CreateAcademicYearForm countries={countries} />}
      />

      <AdminTableShell
        toolbar={
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <AdminSearchBar
              defaultValue={search}
              placeholder="Search academic years..."
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

              <Button type="submit" variant="outline">
                Apply Filter
              </Button>
            </form>
          </div>
        }>
        {academicYears.length === 0 ? (
          <AdminEmptyState
            icon={CalendarRange}
            title="No academic years found"
            description="Add an academic year or adjust the current filters."
          />
        ) : (
          <table className="w-full min-w-[1100px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeading>Academic year</TableHeading>
                <TableHeading>Country</TableHeading>
                <TableHeading>Date range</TableHeading>
                <TableHeading>Calendar</TableHeading>
                <TableHeading>Current</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading className="text-right">Actions</TableHeading>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {academicYears.map((academicYear) => (
                <tr
                  key={academicYear.id}
                  className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <CalendarRange className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-black text-[#071d4e]">
                          {academicYear.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {academicYear.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {academicYear.country.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {academicYear.country.iso2Code}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {formatDate(academicYear.startDate)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      through {formatDate(academicYear.endDate)}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {academicYear._count.periods} periods
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {academicYear._count.weeks} weeks
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    {academicYear.isCurrent ? (
                      <Badge className="bg-blue-700 hover:bg-blue-700">
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                        Current
                      </Badge>
                    ) : academicYear.status === "ACTIVE" ? (
                      <form action={setCurrentAcademicYear}>
                        <input
                          type="hidden"
                          name="academicYearId"
                          value={academicYear.id}
                        />

                        <Button type="submit" size="sm" variant="outline">
                          Set Current
                        </Button>
                      </form>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <AdminStatusBadge status={academicYear.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    {academicYear.status === "ARCHIVED" ? (
                      <form action={restoreAcademicYear}>
                        <input
                          type="hidden"
                          name="academicYearId"
                          value={academicYear.id}
                        />

                        <Button type="submit" size="sm" variant="outline">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                      </form>
                    ) : (
                      <form action={archiveAcademicYear}>
                        <input
                          type="hidden"
                          name="academicYearId"
                          value={academicYear.id}
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
