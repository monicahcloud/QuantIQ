import { GitBranch } from "lucide-react";

import CreateCurriculumFrameworkForm from "@/components/admin/curriculum-engine/frameworks/CreateCurriculumFrameworkForm";
import CurriculumFrameworkActions from "@/components/admin/curriculum-engine/frameworks/CurriculumFrameworkActions";
import AdminEmptyState from "@/components/admin/shared/AdminEmptyState";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminSearchBar from "@/components/admin/shared/AdminSearchBar";
import AdminStatusBadge from "@/components/admin/shared/AdminStatusBadge";
import AdminTableShell from "@/components/admin/shared/AdminTableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

type CurriculumFrameworksPageProps = {
  searchParams: Promise<{
    q?: string;
    country?: string;
    version?: string;
    status?: string;
  }>;
};

export default async function CurriculumFrameworksPage({
  searchParams,
}: CurriculumFrameworksPageProps) {
  const {
    q = "",
    country = "",
    version = "",
    status = "",
  } = await searchParams;

  const search = q.trim();
  const countryId = country.trim();
  const curriculumVersionId = version.trim();

  const selectedStatus =
    status === "ACTIVE" || status === "INACTIVE" || status === "ARCHIVED"
      ? status
      : undefined;

  const [countries, versions, frameworks] = await Promise.all([
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

    prisma.curriculumVersion.findMany({
      where: {
        status: {
          not: "ARCHIVED",
        },
      },
      select: {
        id: true,
        countryId: true,
        name: true,
        code: true,
        versionLabel: true,
        status: true,
      },
      orderBy: [
        {
          country: {
            name: "asc",
          },
        },
        {
          name: "asc",
        },
      ],
    }),

    prisma.curriculumFramework.findMany({
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

        ...(curriculumVersionId
          ? {
              curriculumVersionId,
            }
          : {}),

        ...(countryId
          ? {
              curriculumVersion: {
                countryId,
              },
            }
          : {}),

        ...(selectedStatus
          ? {
              status: selectedStatus,
            }
          : {}),
      },

      include: {
        curriculumVersion: {
          select: {
            name: true,
            code: true,
            versionLabel: true,
            status: true,
            isCurrent: true,

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
            packages: true,
          },
        },
      },

      orderBy: [
        {
          curriculumVersion: {
            country: {
              name: "asc",
            },
          },
        },
        {
          curriculumVersion: {
            name: "asc",
          },
        },
        {
          sequence: "asc",
        },
        {
          name: "asc",
        },
      ],
    }),
  ]);

  const versionOptions = countryId
    ? versions.filter((versionOption) => versionOption.countryId === countryId)
    : versions;

  return (
    <div className="mx-auto max-w-[1450px] space-y-7">
      <AdminPageHeader
        eyebrow="Curriculum Engine"
        title="Curriculum Frameworks"
        description="Organize curriculum versions into structures such as Preschool, Primary, Secondary, IGCSE, PYP, MYP, and other instructional stages."
        backHref="/admin/curriculum-engine"
        actions={
          <CreateCurriculumFrameworkForm
            countries={countries}
            versions={versions}
          />
        }
      />

      <AdminTableShell
        toolbar={
          <div className="space-y-4">
            <AdminSearchBar
              defaultValue={search}
              placeholder="Search curriculum frameworks..."
            />

            <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {search && <input type="hidden" name="q" value={search} />}

              <select
                name="country"
                defaultValue={countryId}
                className={filterClassName}>
                <option value="">All countries</option>

                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>

              <select
                name="version"
                defaultValue={curriculumVersionId}
                className={filterClassName}>
                <option value="">All curriculum versions</option>

                {versionOptions.map((versionOption) => (
                  <option key={versionOption.id} value={versionOption.id}>
                    {versionOption.name}
                    {versionOption.versionLabel
                      ? ` · ${versionOption.versionLabel}`
                      : ""}
                  </option>
                ))}
              </select>

              <select
                name="status"
                defaultValue={selectedStatus ?? ""}
                className={filterClassName}>
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              <Button type="submit" variant="outline">
                Apply Filters
              </Button>
            </form>
          </div>
        }>
        {frameworks.length === 0 ? (
          <AdminEmptyState
            icon={GitBranch}
            title="No curriculum frameworks found"
            description="Add a framework or adjust the current filters."
          />
        ) : (
          <table className="w-full min-w-[1200px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeading>Framework</TableHeading>
                <TableHeading>Curriculum Version</TableHeading>
                <TableHeading>Country</TableHeading>
                <TableHeading>Sequence</TableHeading>
                <TableHeading>Packages</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading className="text-right">Actions</TableHeading>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {frameworks.map((framework) => (
                <tr
                  key={framework.id}
                  className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <GitBranch className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-black text-[#071d4e]">
                          {framework.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {framework.code || framework.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-slate-700">
                        {framework.curriculumVersion.name}
                      </p>

                      {framework.curriculumVersion.isCurrent && (
                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                          Current
                        </Badge>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {framework.curriculumVersion.code}
                      {framework.curriculumVersion.versionLabel
                        ? ` · ${framework.curriculumVersion.versionLabel}`
                        : ""}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {framework.curriculumVersion.country.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {framework.curriculumVersion.country.iso2Code}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-slate-700">
                      {framework.sequence ?? "—"}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-slate-700">
                      {framework._count.packages}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      curriculum packages
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <AdminStatusBadge status={framework.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    <CurriculumFrameworkActions
                      curriculumFrameworkId={framework.id}
                      status={framework.status}
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
