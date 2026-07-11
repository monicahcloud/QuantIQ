import { Archive, GraduationCap, RotateCcw } from "lucide-react";

import { archiveEducationLevel, restoreEducationLevel } from "./actions";

import AdminEmptyState from "@/components/admin/shared/AdminEmptyState";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminSearchBar from "@/components/admin/shared/AdminSearchBar";
import AdminStatusBadge from "@/components/admin/shared/AdminStatusBadge";
import AdminTableShell from "@/components/admin/shared/AdminTableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import CreateEducationLevelForm from "@/components/admin/education-levels/CreateEducationLevelForm";

type EducationLevelsPageProps = {
  searchParams: Promise<{
    q?: string;
    country?: string;
  }>;
};

export default async function EducationLevelsPage({
  searchParams,
}: EducationLevelsPageProps) {
  const { q = "", country = "" } = await searchParams;

  const search = q.trim();
  const countryId = country.trim();

  const [countries, educationLevels] = await Promise.all([
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

        ...(countryId
          ? {
              countryId,
            }
          : {}),
      },

      include: {
        country: {
          select: {
            id: true,
            name: true,
            iso2Code: true,
          },
        },

        _count: {
          select: {
            gradeLevels: true,
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

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <AdminPageHeader
        eyebrow="Education Engine"
        title="Education Levels"
        description="Manage country-specific education stages such as Preschool, Primary, and High School."
        backHref="/admin/education-engine"
        actions={<CreateEducationLevelForm countries={countries} />}
      />

      <AdminTableShell
        toolbar={
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <AdminSearchBar
              defaultValue={search}
              placeholder="Search education levels..."
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
        {educationLevels.length === 0 ? (
          <AdminEmptyState
            icon={GraduationCap}
            title="No education levels found"
            description="Add an education level or change the current search and filter criteria."
          />
        ) : (
          <table className="w-full min-w-[950px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeading>Education level</TableHeading>
                <TableHeading>Country</TableHeading>
                <TableHeading>Code</TableHeading>
                <TableHeading>Sequence</TableHeading>
                <TableHeading>Grades</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading className="text-right">Actions</TableHeading>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {educationLevels.map((level) => (
                <tr key={level.id} className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <GraduationCap className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-black text-[#071d4e]">
                          {level.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {level.description || level.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {level.country.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {level.country.iso2Code}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <Badge variant="secondary">{formatCode(level.code)}</Badge>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-sm font-black text-slate-700">
                      {level.sequence}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {level._count.gradeLevels}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <AdminStatusBadge status={level.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    {level.status === "ARCHIVED" ? (
                      <form action={restoreEducationLevel}>
                        <input
                          type="hidden"
                          name="educationLevelId"
                          value={level.id}
                        />

                        <Button type="submit" size="sm" variant="outline">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                      </form>
                    ) : (
                      <form action={archiveEducationLevel}>
                        <input
                          type="hidden"
                          name="educationLevelId"
                          value={level.id}
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

function formatCode(code: string) {
  return code
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
