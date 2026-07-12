import { Archive, Building2, RotateCcw } from "lucide-react";

import { archiveOrganization, restoreOrganization } from "./actions";

import CreateOrganizationForm from "@/components/admin/education-engine/organizations/CreateOrganizationForm";
import AdminEmptyState from "@/components/admin/shared/AdminEmptyState";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminSearchBar from "@/components/admin/shared/AdminSearchBar";
import AdminStatusBadge from "@/components/admin/shared/AdminStatusBadge";
import AdminTableShell from "@/components/admin/shared/AdminTableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { organizationTypeSchema } from "@/lib/validations/organization";

type OrganizationsPageProps = {
  searchParams: Promise<{
    q?: string;
    country?: string;
    authority?: string;
    division?: string;
    locality?: string;
    type?: string;
  }>;
};

export default async function OrganizationsPage({
  searchParams,
}: OrganizationsPageProps) {
  const {
    q = "",
    country = "",
    authority = "",
    division = "",
    locality = "",
    type = "",
  } = await searchParams;

  const search = q.trim();
  const countryId = country.trim();
  const authorityId = authority.trim();
  const divisionId = division.trim();
  const localityId = locality.trim();

  const parsedType = organizationTypeSchema.safeParse(type);
  const organizationType = parsedType.success ? parsedType.data : undefined;

  const [
    countries,
    authorities,
    divisions,
    localities,
    organizationOptions,
    organizations,
  ] = await Promise.all([
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

    prisma.educationAuthority.findMany({
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
      orderBy: [
        {
          country: {
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

    prisma.locality.findMany({
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
      orderBy: [
        {
          administrativeDivision: {
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

    prisma.organization.findMany({
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

    prisma.organization.findMany({
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
                {
                  email: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),

        ...(countryId ? { countryId } : {}),

        ...(authorityId ? { authorityId } : {}),

        ...(divisionId
          ? {
              administrativeDivisionId: divisionId,
            }
          : {}),

        ...(localityId ? { localityId } : {}),

        ...(organizationType
          ? {
              type: organizationType,
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

        authority: {
          select: {
            name: true,
            type: true,
          },
        },

        parentOrganization: {
          select: {
            name: true,
          },
        },

        administrativeDivision: {
          select: {
            name: true,
            type: true,
          },
        },

        locality: {
          select: {
            name: true,
            type: true,
          },
        },

        _count: {
          select: {
            childOrganizations: true,
            schools: true,
            calendarEvents: true,
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
          name: "asc",
        },
      ],
    }),
  ]);

  const authorityOptions = countryId
    ? authorities.filter(
        (authorityOption) => authorityOption.countryId === countryId,
      )
    : authorities;

  const divisionOptions = countryId
    ? divisions.filter(
        (divisionOption) => divisionOption.countryId === countryId,
      )
    : divisions;

  const localityOptions = localities.filter(
    (localityOption) =>
      (!countryId || localityOption.countryId === countryId) &&
      (!divisionId || localityOption.administrativeDivisionId === divisionId),
  );

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <AdminPageHeader
        eyebrow="Education Engine"
        title="Organizations"
        description="Manage government entities, school boards, districts, private networks, religious networks, charter groups, and independent organizations."
        backHref="/admin/education-engine"
        actions={
          <CreateOrganizationForm
            countries={countries}
            authorities={authorities}
            divisions={divisions}
            localities={localities}
            organizations={organizationOptions}
          />
        }
      />

      <AdminTableShell
        toolbar={
          <div className="space-y-4">
            <AdminSearchBar
              defaultValue={search}
              placeholder="Search organizations..."
            />

            <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
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
                name="authority"
                defaultValue={authorityId}
                className={filterClassName}>
                <option value="">All authorities</option>

                {authorityOptions.map((authorityOption) => (
                  <option key={authorityOption.id} value={authorityOption.id}>
                    {authorityOption.name}
                  </option>
                ))}
              </select>

              <select
                name="division"
                defaultValue={divisionId}
                className={filterClassName}>
                <option value="">All divisions</option>

                {divisionOptions.map((divisionOption) => (
                  <option key={divisionOption.id} value={divisionOption.id}>
                    {divisionOption.name}
                  </option>
                ))}
              </select>

              <select
                name="locality"
                defaultValue={localityId}
                className={filterClassName}>
                <option value="">All localities</option>

                {localityOptions.map((localityOption) => (
                  <option key={localityOption.id} value={localityOption.id}>
                    {localityOption.name}
                  </option>
                ))}
              </select>

              <select
                name="type"
                defaultValue={organizationType ?? ""}
                className={filterClassName}>
                <option value="">All organization types</option>
                <option value="GOVERNMENT">Government</option>
                <option value="PRIVATE_NETWORK">Private Network</option>
                <option value="SCHOOL_BOARD">School Board</option>
                <option value="DISTRICT">District</option>
                <option value="RELIGIOUS_NETWORK">Religious Network</option>
                <option value="CHARTER_NETWORK">Charter Network</option>
                <option value="HOMESCHOOL_NETWORK">Homeschool Network</option>
                <option value="INDEPENDENT">Independent</option>
                <option value="OTHER">Other</option>
              </select>

              <Button type="submit" variant="outline">
                Apply Filters
              </Button>
            </form>
          </div>
        }>
        {organizations.length === 0 ? (
          <AdminEmptyState
            icon={Building2}
            title="No organizations found"
            description="Add an organization or adjust the current filters."
          />
        ) : (
          <table className="w-full min-w-[1400px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeading>Organization</TableHeading>
                <TableHeading>Country</TableHeading>
                <TableHeading>Authority</TableHeading>
                <TableHeading>Location</TableHeading>
                <TableHeading>Parent</TableHeading>
                <TableHeading>Education links</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading className="text-right">Actions</TableHeading>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {organizations.map((organization) => (
                <tr
                  key={organization.id}
                  className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <Building2 className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-black text-[#071d4e]">
                          {organization.name}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">
                            {formatLabel(organization.type)}
                          </Badge>

                          <span className="text-xs text-slate-500">
                            {organization.slug}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {organization.country.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {organization.country.iso2Code}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {organization.authority?.name || "No authority"}
                    </p>

                    {organization.authority && (
                      <p className="mt-1 text-xs text-slate-500">
                        {formatLabel(organization.authority.type)}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {organization.administrativeDivision?.name || "National"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {organization.locality?.name || "No specific locality"}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {organization.parentOrganization?.name || "Top level"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {organization._count.childOrganizations} child
                      organizations
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {organization._count.schools} schools
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {organization._count.calendarEvents} events
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <AdminStatusBadge status={organization.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    {organization.status === "ARCHIVED" ? (
                      <form action={restoreOrganization}>
                        <input
                          type="hidden"
                          name="organizationId"
                          value={organization.id}
                        />

                        <Button type="submit" size="sm" variant="outline">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                      </form>
                    ) : (
                      <form action={archiveOrganization}>
                        <input
                          type="hidden"
                          name="organizationId"
                          value={organization.id}
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

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
