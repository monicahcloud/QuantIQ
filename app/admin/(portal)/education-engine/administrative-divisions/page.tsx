import { Archive, Map, RotateCcw } from "lucide-react";

import {
  archiveAdministrativeDivision,
  restoreAdministrativeDivision,
} from "./actions";

import AdminEmptyState from "@/components/admin/shared/AdminEmptyState";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminSearchBar from "@/components/admin/shared/AdminSearchBar";
import AdminStatusBadge from "@/components/admin/shared/AdminStatusBadge";
import AdminTableShell from "@/components/admin/shared/AdminTableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import CreateAdministrativeDivisionForm from "@/components/admin/education-engine/administrative-divisons/CreateAdministrativeDivisionForm";

type AdministrativeDivisionsPageProps = {
  searchParams: Promise<{
    q?: string;
    country?: string;
    type?: string;
  }>;
};

export default async function AdministrativeDivisionsPage({
  searchParams,
}: AdministrativeDivisionsPageProps) {
  const { q = "", country = "", type = "" } = await searchParams;

  const search = q.trim();
  const countryId = country.trim();
  const divisionType = type.trim();

  const [countries, divisions] = await Promise.all([
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

        ...(divisionType
          ? {
              type: divisionType as never,
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

        parentDivision: {
          select: {
            name: true,
          },
        },

        _count: {
          select: {
            childDivisions: true,
            localities: true,
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
          sequence: "asc",
        },
        {
          name: "asc",
        },
      ],
    }),
  ]);

  const formDivisions = divisions.map((division) => ({
    id: division.id,
    countryId: division.countryId,
    name: division.name,
    type: division.type,
  }));

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <AdminPageHeader
        eyebrow="Education Engine"
        title="Administrative Divisions"
        description="Manage islands, states, provinces, parishes, regions, counties, territories, and other country-specific geographic divisions."
        backHref="/admin/education-engine"
        actions={
          <CreateAdministrativeDivisionForm
            countries={countries}
            divisions={formDivisions}
          />
        }
      />

      <AdminTableShell
        toolbar={
          <div className="space-y-4">
            <AdminSearchBar
              defaultValue={search}
              placeholder="Search administrative divisions..."
            />

            <form className="grid gap-3 md:grid-cols-3">
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
                name="type"
                defaultValue={divisionType}
                className={filterClassName}>
                <option value="">All division types</option>
                <option value="ISLAND">Island</option>
                <option value="STATE">State</option>
                <option value="PROVINCE">Province</option>
                <option value="PARISH">Parish</option>
                <option value="REGION">Region</option>
                <option value="COUNTY">County</option>
                <option value="TERRITORY">Territory</option>
                <option value="DISTRICT">District</option>
                <option value="DEPARTMENT">Department</option>
                <option value="MUNICIPALITY">Municipality</option>
                <option value="OTHER">Other</option>
              </select>

              <Button type="submit" variant="outline">
                Apply Filters
              </Button>
            </form>
          </div>
        }>
        {divisions.length === 0 ? (
          <AdminEmptyState
            icon={Map}
            title="No administrative divisions found"
            description="Add a division or adjust the current search and filters."
          />
        ) : (
          <table className="w-full min-w-[1200px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeading>Division</TableHeading>
                <TableHeading>Country</TableHeading>
                <TableHeading>Type</TableHeading>
                <TableHeading>Parent</TableHeading>
                <TableHeading>Geography</TableHeading>
                <TableHeading>Education links</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading className="text-right">Actions</TableHeading>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {divisions.map((division) => (
                <tr
                  key={division.id}
                  className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <Map className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-black text-[#071d4e]">
                          {division.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {division.code || division.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {division.country.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {division.country.iso2Code}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <Badge variant="secondary">
                      {formatLabel(division.type)}
                    </Badge>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {division.parentDivision?.name || "Top level"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {division._count.childDivisions} child divisions
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {division._count.localities} localities
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {division._count.schools} schools
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {division._count.authorities} authorities ·{" "}
                      {division._count.organizations} organizations
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <AdminStatusBadge status={division.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    {division.status === "ARCHIVED" ? (
                      <form action={restoreAdministrativeDivision}>
                        <input
                          type="hidden"
                          name="divisionId"
                          value={division.id}
                        />

                        <Button type="submit" size="sm" variant="outline">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                      </form>
                    ) : (
                      <form action={archiveAdministrativeDivision}>
                        <input
                          type="hidden"
                          name="divisionId"
                          value={division.id}
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
