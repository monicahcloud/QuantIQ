import { Archive, Building2, RotateCcw } from "lucide-react";

import {
  archiveEducationAuthority,
  restoreEducationAuthority,
} from "./actions";

import CreateEducationAuthorityForm from "@/components/admin/education-engine/authorities/CreateEducationAuthorityForm";
import AdminEmptyState from "@/components/admin/shared/AdminEmptyState";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminSearchBar from "@/components/admin/shared/AdminSearchBar";
import AdminStatusBadge from "@/components/admin/shared/AdminStatusBadge";
import AdminTableShell from "@/components/admin/shared/AdminTableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

type AuthoritiesPageProps = {
  searchParams: Promise<{
    q?: string;
    country?: string;
    division?: string;
    locality?: string;
    type?: string;
  }>;
};

export default async function AuthoritiesPage({
  searchParams,
}: AuthoritiesPageProps) {
  const {
    q = "",
    country = "",
    division = "",
    locality = "",
    type = "",
  } = await searchParams;

  const search = q.trim();
  const countryId = country.trim();
  const divisionId = division.trim();
  const localityId = locality.trim();
  const authorityType = type.trim();

  const [countries, divisions, localities, authorities] = await Promise.all([
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

    prisma.educationAuthority.findMany({
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

        ...(divisionId
          ? {
              administrativeDivisionId: divisionId,
            }
          : {}),

        ...(localityId
          ? {
              localityId,
            }
          : {}),

        ...(authorityType
          ? {
              type: authorityType as never,
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

        locality: {
          select: {
            name: true,
            type: true,
          },
        },

        _count: {
          select: {
            organizations: true,
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
        title="Education Authorities"
        description="Manage ministries, departments, boards, districts, regions, and other bodies responsible for education governance."
        backHref="/admin/education-engine"
        actions={
          <CreateEducationAuthorityForm
            countries={countries}
            divisions={divisions}
            localities={localities}
          />
        }
      />

      <AdminTableShell
        toolbar={
          <div className="space-y-4">
            <AdminSearchBar
              defaultValue={search}
              placeholder="Search education authorities..."
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
                defaultValue={authorityType}
                className={filterClassName}>
                <option value="">All authority types</option>
                <option value="MINISTRY">Ministry</option>
                <option value="DEPARTMENT">Department</option>
                <option value="BOARD">Board</option>
                <option value="DISTRICT">District</option>
                <option value="REGION">Region</option>
                <option value="OTHER">Other</option>
              </select>

              <Button type="submit" variant="outline">
                Apply Filters
              </Button>
            </form>
          </div>
        }>
        {authorities.length === 0 ? (
          <AdminEmptyState
            icon={Building2}
            title="No education authorities found"
            description="Add an education authority or adjust the current filters."
          />
        ) : (
          <table className="w-full min-w-[1300px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeading>Authority</TableHeading>
                <TableHeading>Country</TableHeading>
                <TableHeading>Location</TableHeading>
                <TableHeading>Type</TableHeading>
                <TableHeading>Contact</TableHeading>
                <TableHeading>Education links</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading className="text-right">Actions</TableHeading>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {authorities.map((authority) => (
                <tr
                  key={authority.id}
                  className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <Building2 className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-black text-[#071d4e]">
                          {authority.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {authority.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {authority.country.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {authority.country.iso2Code}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {authority.administrativeDivision?.name || "National"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {authority.locality?.name || "No specific locality"}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <Badge variant="secondary">
                      {formatLabel(authority.type)}
                    </Badge>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {authority.email || "No email"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {authority.phone ||
                        authority.websiteUrl ||
                        "No contact details"}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {authority._count.schools} schools
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {authority._count.organizations} organizations ·{" "}
                      {authority._count.calendarEvents} events
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <AdminStatusBadge status={authority.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    {authority.status === "ARCHIVED" ? (
                      <form action={restoreEducationAuthority}>
                        <input
                          type="hidden"
                          name="authorityId"
                          value={authority.id}
                        />

                        <Button type="submit" size="sm" variant="outline">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                      </form>
                    ) : (
                      <form action={archiveEducationAuthority}>
                        <input
                          type="hidden"
                          name="authorityId"
                          value={authority.id}
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
