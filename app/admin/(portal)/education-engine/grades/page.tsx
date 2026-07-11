import { Archive, GraduationCap, RotateCcw } from "lucide-react";

import { archiveGradeLevel, restoreGradeLevel } from "./actions";

import CreateGradeLevelForm from "@/components/admin/education-engine/grades/CreateGradeLevelForm";
import AdminEmptyState from "@/components/admin/shared/AdminEmptyState";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminSearchBar from "@/components/admin/shared/AdminSearchBar";
import AdminStatusBadge from "@/components/admin/shared/AdminStatusBadge";
import AdminTableShell from "@/components/admin/shared/AdminTableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

type GradeLevelsPageProps = {
  searchParams: Promise<{
    q?: string;
    country?: string;
    level?: string;
  }>;
};

export default async function GradeLevelsPage({
  searchParams,
}: GradeLevelsPageProps) {
  const { q = "", country = "", level = "" } = await searchParams;

  const search = q.trim();
  const countryId = country.trim();
  const educationLevelId = level.trim();

  const [countries, educationLevels, gradeLevels] = await Promise.all([
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

    prisma.educationLevel.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        countryId: true,
        name: true,
        code: true,
      },
      orderBy: [
        {
          country: {
            name: "asc",
          },
        },
        {
          sequence: "asc",
        },
      ],
    }),

    prisma.gradeLevel.findMany({
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

        ...(educationLevelId
          ? {
              educationLevelId,
            }
          : {}),
      },

      include: {
        country: {
          select: {
            name: true,
            iso2Code: true,
          },
        },

        educationLevel: {
          select: {
            name: true,
            code: true,
          },
        },

        _count: {
          select: {
            subjectMappings: true,
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
          sequence: "asc",
        },
      ],
    }),
  ]);

  const filteredLevelOptions = countryId
    ? educationLevels.filter(
        (educationLevel) => educationLevel.countryId === countryId,
      )
    : educationLevels;

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <AdminPageHeader
        eyebrow="Education Engine"
        title="Grade Levels"
        description="Manage country-specific grades and assign each grade to its correct education level."
        backHref="/admin/education-engine"
        actions={
          <CreateGradeLevelForm
            countries={countries}
            educationLevels={educationLevels}
          />
        }
      />

      <AdminTableShell
        toolbar={
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <AdminSearchBar
              defaultValue={search}
              placeholder="Search grade levels..."
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
                name="level"
                defaultValue={educationLevelId}
                className="h-12 min-w-52 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                <option value="">All education levels</option>

                {filteredLevelOptions.map((levelOption) => (
                  <option key={levelOption.id} value={levelOption.id}>
                    {levelOption.name}
                  </option>
                ))}
              </select>

              <Button type="submit" variant="outline">
                Apply Filters
              </Button>
            </form>
          </div>
        }>
        {gradeLevels.length === 0 ? (
          <AdminEmptyState
            icon={GraduationCap}
            title="No grade levels found"
            description="Add a grade level or adjust the current filters."
          />
        ) : (
          <table className="w-full min-w-[1050px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeading>Grade</TableHeading>
                <TableHeading>Country</TableHeading>
                <TableHeading>Education level</TableHeading>
                <TableHeading>Code</TableHeading>
                <TableHeading>Sequence</TableHeading>
                <TableHeading>Subjects</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading className="text-right">Actions</TableHeading>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {gradeLevels.map((grade) => (
                <tr key={grade.id} className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <GraduationCap className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-black text-[#071d4e]">
                          {grade.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {grade.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {grade.country.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {grade.country.iso2Code}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <Badge variant="secondary">
                      {grade.educationLevel.name}
                    </Badge>
                  </td>

                  <td className="px-6 py-5">
                    <Badge variant="outline">{grade.code}</Badge>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-slate-700">
                      {grade.sequence}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Numeric: {grade.numericGrade ?? "—"}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {grade._count.subjectMappings}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <AdminStatusBadge status={grade.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    {grade.status === "ARCHIVED" ? (
                      <form action={restoreGradeLevel}>
                        <input
                          type="hidden"
                          name="gradeLevelId"
                          value={grade.id}
                        />

                        <Button type="submit" size="sm" variant="outline">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                      </form>
                    ) : (
                      <form action={archiveGradeLevel}>
                        <input
                          type="hidden"
                          name="gradeLevelId"
                          value={grade.id}
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
