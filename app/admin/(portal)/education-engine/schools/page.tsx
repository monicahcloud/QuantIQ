import { Archive, RotateCcw, School } from "lucide-react";

import { archiveSchool, restoreSchool } from "./actions";

import AdminEmptyState from "@/components/admin/shared/AdminEmptyState";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminSearchBar from "@/components/admin/shared/AdminSearchBar";
import AdminStatusBadge from "@/components/admin/shared/AdminStatusBadge";
import AdminTableShell from "@/components/admin/shared/AdminTableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { schoolTypeSchema } from "@/lib/validations/school";
import CreateSchoolForm from "@/components/admin/education-engine/schools/CreateSchoolsForm";

type SchoolsPageProps = {
  searchParams: Promise<{
    q?: string;
    country?: string;
    authority?: string;
    organization?: string;
    division?: string;
    locality?: string;
    type?: string;
  }>;
};

export default async function SchoolsPage({ searchParams }: SchoolsPageProps) {
  const {
    q = "",
    country = "",
    authority = "",
    organization = "",
    division = "",
    locality = "",
    type = "",
  } = await searchParams;

  const search = q.trim();
  const countryId = country.trim();
  const authorityId = authority.trim();
  const organizationId = organization.trim();
  const divisionId = division.trim();
  const localityId = locality.trim();

  const parsedType = schoolTypeSchema.safeParse(type);

  const schoolType = parsedType.success ? parsedType.data : undefined;

  const [
    countries,
    authorities,
    organizations,
    divisions,
    localities,
    schools,
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

    prisma.organization.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        countryId: true,
        authorityId: true,
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

    prisma.school.findMany({
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
                  schoolCode: {
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

        ...(organizationId ? { organizationId } : {}),

        ...(divisionId
          ? {
              administrativeDivisionId: divisionId,
            }
          : {}),

        ...(localityId ? { localityId } : {}),

        ...(schoolType
          ? {
              type: schoolType,
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

        organization: {
          select: {
            name: true,
            type: true,
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
    ? authorities.filter((authority) => authority.countryId === countryId)
    : authorities;

  const organizationOptions = organizations.filter(
    (organization) =>
      (!countryId || organization.countryId === countryId) &&
      (!authorityId ||
        organization.authorityId === authorityId ||
        organization.authorityId === null),
  );

  const divisionOptions = countryId
    ? divisions.filter((division) => division.countryId === countryId)
    : divisions;

  const localityOptions = localities.filter(
    (locality) =>
      (!countryId || locality.countryId === countryId) &&
      (!divisionId || locality.administrativeDivisionId === divisionId),
  );

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <AdminPageHeader
        eyebrow="Education Engine"
        title="Schools"
        description="Manage schools and connect them to their country, location, authority, organization, and calendar structure."
        backHref="/admin/education-engine"
        actions={
          <CreateSchoolForm
            countries={countries}
            authorities={authorities}
            organizations={organizations}
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
              placeholder="Search schools..."
            />

            <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
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
                name="authority"
                defaultValue={authorityId}
                className={filterClassName}>
                <option value="">All authorities</option>

                {authorityOptions.map((authority) => (
                  <option key={authority.id} value={authority.id}>
                    {authority.name}
                  </option>
                ))}
              </select>

              <select
                name="organization"
                defaultValue={organizationId}
                className={filterClassName}>
                <option value="">All organizations</option>

                {organizationOptions.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                ))}
              </select>

              <select
                name="division"
                defaultValue={divisionId}
                className={filterClassName}>
                <option value="">All divisions</option>

                {divisionOptions.map((division) => (
                  <option key={division.id} value={division.id}>
                    {division.name}
                  </option>
                ))}
              </select>

              <select
                name="locality"
                defaultValue={localityId}
                className={filterClassName}>
                <option value="">All localities</option>

                {localityOptions.map((locality) => (
                  <option key={locality.id} value={locality.id}>
                    {locality.name}
                  </option>
                ))}
              </select>

              <select
                name="type"
                defaultValue={schoolType ?? ""}
                className={filterClassName}>
                <option value="">All school types</option>
                <option value="PRESCHOOL">Preschool</option>
                <option value="PRIMARY">Primary</option>
                <option value="JUNIOR_HIGH">Junior High</option>
                <option value="SENIOR_HIGH">Senior High</option>
                <option value="ALL_AGE">All-Age</option>
                <option value="SPECIALIZED">Specialized</option>
                <option value="VOCATIONAL">Vocational</option>
                <option value="PRIVATE">Private</option>
                <option value="OTHER">Other</option>
              </select>

              <Button type="submit" variant="outline">
                Apply Filters
              </Button>
            </form>
          </div>
        }>
        {schools.length === 0 ? (
          <AdminEmptyState
            icon={School}
            title="No schools found"
            description="Add a school or adjust the current search and filters."
          />
        ) : (
          <table className="w-full min-w-[1450px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeading>School</TableHeading>
                <TableHeading>Country</TableHeading>
                <TableHeading>Location</TableHeading>
                <TableHeading>Governance</TableHeading>
                <TableHeading>Address</TableHeading>
                <TableHeading>Contact</TableHeading>
                <TableHeading>Events</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading className="text-right">Actions</TableHeading>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {schools.map((school) => (
                <tr key={school.id} className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <School className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-black text-[#071d4e]">
                          {school.name}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">
                            {formatLabel(school.type)}
                          </Badge>

                          <span className="text-xs text-slate-500">
                            {school.schoolCode || school.slug}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {school.country.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {school.country.iso2Code}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {school.administrativeDivision?.name || "No division"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {school.locality?.name || "No specific locality"}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {school.organization?.name ||
                        school.authority?.name ||
                        "Independent"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {school.organization
                        ? formatLabel(school.organization.type)
                        : school.authority
                          ? formatLabel(school.authority.type)
                          : "No linked authority"}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {school.addressLine1 || "No address"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {[school.addressLine2, school.postalCode]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {school.email || "No email"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {school.phone ||
                        school.websiteUrl ||
                        "No contact details"}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-slate-700">
                      {school._count.calendarEvents}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      calendar events
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <AdminStatusBadge status={school.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    {school.status === "ARCHIVED" ? (
                      <form action={restoreSchool}>
                        <input
                          type="hidden"
                          name="schoolId"
                          value={school.id}
                        />

                        <Button type="submit" size="sm" variant="outline">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                      </form>
                    ) : (
                      <form action={archiveSchool}>
                        <input
                          type="hidden"
                          name="schoolId"
                          value={school.id}
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
