import { Archive, MapPin, RotateCcw } from "lucide-react";

import { archiveLocality, restoreLocality } from "./actions";

import CreateLocalityForm from "@/components/admin/education-engine/localities/CreateLocalityForm";
import AdminEmptyState from "@/components/admin/shared/AdminEmptyState";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminSearchBar from "@/components/admin/shared/AdminSearchBar";
import AdminStatusBadge from "@/components/admin/shared/AdminStatusBadge";
import AdminTableShell from "@/components/admin/shared/AdminTableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

type LocalitiesPageProps = {
  searchParams: Promise<{
    q?: string;
    country?: string;
    division?: string;
    type?: string;
  }>;
};

export default async function LocalitiesPage({
  searchParams,
}: LocalitiesPageProps) {
  const { q = "", country = "", division = "", type = "" } = await searchParams;

  const search = q.trim();
  const countryId = country.trim();
  const divisionId = division.trim();
  const localityType = type.trim();

  const [countries, divisions, localities] = await Promise.all([
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

        ...(divisionId
          ? {
              administrativeDivisionId: divisionId,
            }
          : {}),

        ...(localityType
          ? {
              type: localityType as never,
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

        _count: {
          select: {
            authorities: true,
            organizations: true,
            schools: true,
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
  ]);

  const divisionOptions = countryId
    ? divisions.filter(
        (divisionOption) => divisionOption.countryId === countryId,
      )
    : divisions;

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <AdminPageHeader
        eyebrow="Education Engine"
        title="Localities"
        description="Manage cities, towns, settlements, villages, districts, municipalities, and communities within administrative divisions."
        backHref="/admin/education-engine"
        actions={
          <CreateLocalityForm countries={countries} divisions={divisions} />
        }
      />

      <AdminTableShell
        toolbar={
          <div className="space-y-4">
            <AdminSearchBar
              defaultValue={search}
              placeholder="Search localities..."
            />

            <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
                name="type"
                defaultValue={localityType}
                className={filterClassName}>
                <option value="">All locality types</option>
                <option value="CITY">City</option>
                <option value="TOWN">Town</option>
                <option value="SETTLEMENT">Settlement</option>
                <option value="VILLAGE">Village</option>
                <option value="DISTRICT">District</option>
                <option value="MUNICIPALITY">Municipality</option>
                <option value="COMMUNITY">Community</option>
                <option value="OTHER">Other</option>
              </select>

              <Button type="submit" variant="outline">
                Apply Filters
              </Button>
            </form>
          </div>
        }>
        {localities.length === 0 ? (
          <AdminEmptyState
            icon={MapPin}
            title="No localities found"
            description="Add a locality or adjust the current filters."
          />
        ) : (
          <table className="w-full min-w-[1200px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeading>Locality</TableHeading>
                <TableHeading>Country</TableHeading>
                <TableHeading>Division</TableHeading>
                <TableHeading>Type</TableHeading>
                <TableHeading>Coordinates</TableHeading>
                <TableHeading>Education links</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading className="text-right">Actions</TableHeading>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {localities.map((locality) => (
                <tr
                  key={locality.id}
                  className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <MapPin className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-black text-[#071d4e]">
                          {locality.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {locality.code || locality.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {locality.country.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {locality.country.iso2Code}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {locality.administrativeDivision.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatLabel(locality.administrativeDivision.type)}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <Badge variant="secondary">
                      {formatLabel(locality.type)}
                    </Badge>
                  </td>

                  <td className="px-6 py-5">
                    {locality.latitude !== null &&
                    locality.longitude !== null ? (
                      <>
                        <p className="text-sm font-bold text-slate-700">
                          {locality.latitude.toString()}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {locality.longitude.toString()}
                        </p>
                      </>
                    ) : (
                      <span className="text-sm text-slate-400">Not added</span>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {locality._count.schools} schools
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {locality._count.authorities} authorities ·{" "}
                      {locality._count.organizations} organizations
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <AdminStatusBadge status={locality.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    {locality.status === "ARCHIVED" ? (
                      <form action={restoreLocality}>
                        <input
                          type="hidden"
                          name="localityId"
                          value={locality.id}
                        />

                        <Button type="submit" size="sm" variant="outline">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                      </form>
                    ) : (
                      <form action={archiveLocality}>
                        <input
                          type="hidden"
                          name="localityId"
                          value={locality.id}
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
