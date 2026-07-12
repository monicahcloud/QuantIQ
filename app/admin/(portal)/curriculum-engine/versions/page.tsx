import { BookOpenCheck, Sparkles } from "lucide-react";

import AdminEmptyState from "@/components/admin/shared/AdminEmptyState";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminSearchBar from "@/components/admin/shared/AdminSearchBar";
import AdminTableShell from "@/components/admin/shared/AdminTableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import {
  curriculumScopeSchema,
  curriculumVersionStatusSchema,
} from "@/lib/validations/curriculum-version";
import CreateCurriculumVersionForm from "@/components/admin/curriculum-engine/CreateCurriculumVersionForm";
import CurriculumVersionActions from "@/components/admin/curriculum-engine/CurriculumVersionActions";

type CurriculumVersionsPageProps = {
  searchParams: Promise<{
    q?: string;
    country?: string;
    scope?: string;
    status?: string;
    current?: string;
  }>;
};

export default async function CurriculumVersionsPage({
  searchParams,
}: CurriculumVersionsPageProps) {
  const {
    q = "",
    country = "",
    scope = "",
    status = "",
    current = "",
  } = await searchParams;

  const search = q.trim();
  const countryId = country.trim();

  const parsedScope = curriculumScopeSchema.safeParse(scope);
  const selectedScope = parsedScope.success ? parsedScope.data : undefined;

  const parsedStatus = curriculumVersionStatusSchema.safeParse(status);

  const selectedStatus = parsedStatus.success ? parsedStatus.data : undefined;

  const isCurrent =
    current === "true" ? true : current === "false" ? false : undefined;

  const [countries, divisions, authorities, organizations, schools, versions] =
    await Promise.all([
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

      prisma.administrativeDivision.findMany({
        where: {
          status: "ACTIVE",
        },
        select: {
          id: true,
          countryId: true,
          name: true,
          type: true,
        },
        orderBy: {
          name: "asc",
        },
      }),

      prisma.educationAuthority.findMany({
        where: {
          status: "ACTIVE",
        },
        select: {
          id: true,
          countryId: true,
          administrativeDivisionId: true,
          name: true,
          type: true,
        },
        orderBy: {
          name: "asc",
        },
      }),

      prisma.organization.findMany({
        where: {
          status: "ACTIVE",
        },
        select: {
          id: true,
          countryId: true,
          authorityId: true,
          administrativeDivisionId: true,
          name: true,
          type: true,
        },
        orderBy: {
          name: "asc",
        },
      }),

      prisma.school.findMany({
        where: {
          status: "ACTIVE",
        },
        select: {
          id: true,
          countryId: true,
          authorityId: true,
          organizationId: true,
          administrativeDivisionId: true,
          name: true,
          type: true,
        },
        orderBy: {
          name: "asc",
        },
      }),

      prisma.curriculumVersion.findMany({
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
                  {
                    versionLabel: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {}),

          ...(countryId ? { countryId } : {}),
          ...(selectedScope ? { scope: selectedScope } : {}),
          ...(selectedStatus ? { status: selectedStatus } : {}),

          ...(typeof isCurrent === "boolean"
            ? {
                isCurrent,
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

          administrativeDivision: {
            select: {
              name: true,
              type: true,
            },
          },

          authority: {
            select: {
              name: true,
            },
          },

          organization: {
            select: {
              name: true,
            },
          },

          school: {
            select: {
              name: true,
            },
          },

          _count: {
            select: {
              frameworks: true,
              documents: true,
              importRuns: true,
            },
          },
        },

        orderBy: [
          {
            isCurrent: "desc",
          },
          {
            effectiveFrom: "desc",
          },
          {
            name: "asc",
          },
        ],
      }),
    ]);

  return (
    <div className="mx-auto max-w-[1550px] space-y-7">
      <AdminPageHeader
        eyebrow="Curriculum Engine"
        title="Curriculum Versions"
        description="Manage national, state, authority, organization, and school-level curriculum versions with effective dates, publication status, and version governance."
        backHref="/admin/curriculum-engine"
        actions={
          <CreateCurriculumVersionForm
            countries={countries}
            divisions={divisions}
            authorities={authorities}
            organizations={organizations}
            schools={schools}
          />
        }
      />

      <AdminTableShell
        toolbar={
          <div className="space-y-4">
            <AdminSearchBar
              defaultValue={search}
              placeholder="Search curriculum versions..."
            />

            <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
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
                name="scope"
                defaultValue={selectedScope ?? ""}
                className={filterClassName}>
                <option value="">All scopes</option>
                <option value="COUNTRY">Country</option>
                <option value="ADMINISTRATIVE_DIVISION">
                  Administrative Division
                </option>
                <option value="AUTHORITY">Authority</option>
                <option value="ORGANIZATION">Organization</option>
                <option value="SCHOOL">School</option>
              </select>

              <select
                name="status"
                defaultValue={selectedStatus ?? ""}
                className={filterClassName}>
                <option value="">All statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="PUBLISHED">Published</option>
                <option value="RETIRED">Retired</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              <select
                name="current"
                defaultValue={
                  typeof isCurrent === "boolean" ? String(isCurrent) : ""
                }
                className={filterClassName}>
                <option value="">Current and historical</option>
                <option value="true">Current only</option>
                <option value="false">Historical only</option>
              </select>

              <Button type="submit" variant="outline">
                Apply Filters
              </Button>
            </form>
          </div>
        }>
        {versions.length === 0 ? (
          <AdminEmptyState
            icon={Sparkles}
            title="No curriculum versions found"
            description="Add a curriculum version or adjust the current filters."
          />
        ) : (
          <table className="w-full min-w-[1500px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeading>Curriculum</TableHeading>
                <TableHeading>Jurisdiction</TableHeading>
                <TableHeading>Scope</TableHeading>
                <TableHeading>Effective dates</TableHeading>
                <TableHeading>Language</TableHeading>
                <TableHeading>Content</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading className="text-right">Actions</TableHeading>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {versions.map((version) => (
                <tr
                  key={version.id}
                  className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <BookOpenCheck className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-black text-[#071d4e]">
                            {version.name}
                          </p>

                          {version.isCurrent && (
                            <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                              Current
                            </Badge>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          {version.code}
                          {version.versionLabel
                            ? ` · ${version.versionLabel}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {version.country.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {getJurisdictionName(version)}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <Badge variant="secondary">
                      {formatLabel(version.scope)}
                    </Badge>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {version.effectiveFrom
                        ? formatDate(version.effectiveFrom)
                        : "No start date"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {version.effectiveTo
                        ? `through ${formatDate(version.effectiveTo)}`
                        : "No expiration date"}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold uppercase text-slate-700">
                      {version.languageCode}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {version._count.frameworks} frameworks
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {version._count.documents} documents ·{" "}
                      {version._count.importRuns} imports
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <CurriculumStatusBadge status={version.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    <CurriculumVersionActions
                      curriculumVersionId={version.id}
                      status={version.status}
                      isCurrent={version.isCurrent}
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

function CurriculumStatusBadge({ status }: { status: string }) {
  const classes: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    UNDER_REVIEW: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    APPROVED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    PUBLISHED: "bg-emerald-600 text-white hover:bg-emerald-600",
    RETIRED: "bg-violet-100 text-violet-800 hover:bg-violet-100",
    ARCHIVED: "bg-red-100 text-red-700 hover:bg-red-100",
  };

  return (
    <Badge className={classes[status] ?? classes.DRAFT}>
      {formatLabel(status)}
    </Badge>
  );
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-BS", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(value);
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getJurisdictionName(version: {
  administrativeDivision: { name: string } | null;
  authority: { name: string } | null;
  organization: { name: string } | null;
  school: { name: string } | null;
}) {
  return (
    version.school?.name ??
    version.organization?.name ??
    version.authority?.name ??
    version.administrativeDivision?.name ??
    "National"
  );
}
