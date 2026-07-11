import { Archive, Globe2, RotateCcw } from "lucide-react";

import { archiveCountry, restoreCountry } from "./actions";

import CreateCountryForm from "@/components/admin/education-engine/countries/CreateCountryForm";
import AdminEmptyState from "@/components/admin/shared/AdminEmptyState";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import AdminSearchBar from "@/components/admin/shared/AdminSearchBar";
import AdminStatusBadge from "@/components/admin/shared/AdminStatusBadge";
import AdminTableShell from "@/components/admin/shared/AdminTableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

type CountriesPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function CountriesPage({
  searchParams,
}: CountriesPageProps) {
  const { q = "" } = await searchParams;
  const search = q.trim();

  const countries = await prisma.country.findMany({
    where: search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              officialName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              iso2Code: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              iso3Code: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,

    include: {
      _count: {
        select: {
          authorities: true,
          organizations: true,
          schools: true,
          educationLevels: true,
          gradeLevels: true,
          subjects: true,
          academicYears: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <AdminPageHeader
        eyebrow="Education Engine"
        title="Countries"
        description="Countries are the top-level boundary for education structures, curricula, calendars, organizations, and governance."
        backHref="/admin/education-engine"
        actions={<CreateCountryForm />}
      />

      <AdminTableShell
        toolbar={
          <AdminSearchBar
            defaultValue={search}
            placeholder="Search countries..."
          />
        }>
        {countries.length === 0 ? (
          <AdminEmptyState
            icon={Globe2}
            title="No countries found"
            description="Add a country or change your search criteria."
          />
        ) : (
          <table className="w-full min-w-[1050px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeading>Country</TableHeading>
                <TableHeading>Codes</TableHeading>
                <TableHeading>Locale</TableHeading>
                <TableHeading>Education data</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading className="text-right">Actions</TableHeading>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {countries.map((country) => (
                <tr
                  key={country.id}
                  className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <Globe2 className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-black text-[#071d4e]">
                          {country.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {country.officialName || country.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      <Badge variant="secondary">{country.iso2Code}</Badge>

                      <Badge variant="secondary">{country.iso3Code}</Badge>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {country.defaultLocale}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {country.defaultTimeZone || "No time zone"}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {country._count.gradeLevels} grades ·{" "}
                      {country._count.subjects} subjects
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {country._count.schools} schools ·{" "}
                      {country._count.academicYears} academic years
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <AdminStatusBadge status={country.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    {country.status === "ARCHIVED" ? (
                      <form action={restoreCountry}>
                        <input
                          type="hidden"
                          name="countryId"
                          value={country.id}
                        />

                        <Button type="submit" size="sm" variant="outline">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                      </form>
                    ) : (
                      <form action={archiveCountry}>
                        <input
                          type="hidden"
                          name="countryId"
                          value={country.id}
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
