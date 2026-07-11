import { Archive, BookOpen, RotateCcw } from "lucide-react";

import { archiveSubject, restoreSubject } from "./actions";

import CreateSubjectForm from "@/components/admin/education-engine/subjects/CreateSubjectForm";
import AdminEmptyState from "@/components/admin/shared/AdminEmptyState";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminSearchBar from "@/components/admin/shared/AdminSearchBar";
import AdminStatusBadge from "@/components/admin/shared/AdminStatusBadge";
import AdminTableShell from "@/components/admin/shared/AdminTableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

type SubjectsPageProps = {
  searchParams: Promise<{
    q?: string;
    country?: string;
  }>;
};

export default async function SubjectsPage({
  searchParams,
}: SubjectsPageProps) {
  const { q = "", country = "" } = await searchParams;

  const search = q.trim();
  const countryId = country.trim();

  const [countries, subjects] = await Promise.all([
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

    prisma.subject.findMany({
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
            gradeMappings: true,
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
        title="Subjects"
        description="Manage country-level subjects and prepare them for assignment across grade levels."
        backHref="/admin/education-engine"
        actions={<CreateSubjectForm countries={countries} />}
      />

      <AdminTableShell
        toolbar={
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <AdminSearchBar
              defaultValue={search}
              placeholder="Search subjects..."
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
        {subjects.length === 0 ? (
          <AdminEmptyState
            icon={BookOpen}
            title="No subjects found"
            description="Add a subject or adjust the current search and country filter."
          />
        ) : (
          <table className="w-full min-w-[950px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeading>Subject</TableHeading>
                <TableHeading>Country</TableHeading>
                <TableHeading>Code</TableHeading>
                <TableHeading>Sequence</TableHeading>
                <TableHeading>Assigned grades</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading className="text-right">Actions</TableHeading>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {subjects.map((subject) => (
                <tr
                  key={subject.id}
                  className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <BookOpen className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-black text-[#071d4e]">
                          {subject.name}
                        </p>

                        <p className="mt-1 max-w-sm text-xs text-slate-500">
                          {subject.description || subject.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {subject.country.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {subject.country.iso2Code}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <Badge variant="outline">{subject.code}</Badge>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-slate-700">
                      {subject.sequence}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {subject._count.gradeMappings}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      grade mappings
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <AdminStatusBadge status={subject.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    {subject.status === "ARCHIVED" ? (
                      <form action={restoreSubject}>
                        <input
                          type="hidden"
                          name="subjectId"
                          value={subject.id}
                        />

                        <Button type="submit" size="sm" variant="outline">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                      </form>
                    ) : (
                      <form action={archiveSubject}>
                        <input
                          type="hidden"
                          name="subjectId"
                          value={subject.id}
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
