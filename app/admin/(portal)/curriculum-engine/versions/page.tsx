import Link from "next/link";
import { BookOpen, FileText, FileUp, Layers3 } from "lucide-react";

import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

export default async function CurriculumVersionsPage() {
  const versions = await prisma.curriculumVersion.findMany({
    where: {
      status: {
        not: "ARCHIVED",
      },
    },
    include: {
      country: {
        select: {
          name: true,
        },
      },
      administrativeDivision: {
        select: {
          name: true,
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
        createdAt: "desc",
      },
    ],
  });

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <AdminPageHeader
        eyebrow="Curriculum Engine"
        title="Curriculum Versions"
        description="Manage curriculum versions, source documents, frameworks, packages, and Nova imports."
        actions={
          <Button asChild className="mt-6 bg-blue-700 hover:bg-blue-800">
            <Link href="/admin/curriculum-engine/versions/new">
              <BookOpen className="h-4 w-4" />
              Create Curriculum Version
            </Link>
          </Button>
        }
      />

      {versions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <BookOpen className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-xl font-black text-[#071d4e]">
            No curriculum versions found
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Create a curriculum version first. After that, you can upload
            official curriculum documents for Nova to analyze.
          </p>

          <Button asChild className="mt-6 bg-blue-700 hover:bg-blue-800">
            <Link href="/admin/curriculum-engine/versions/new">
              <BookOpen className="h-4 w-4" />
              Create Curriculum Version
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5">
          {versions.map((version) => {
            const jurisdiction = getJurisdictionName(version);

            return (
              <article
                key={version.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#071d4e] text-white">
                      <BookOpen className="h-6 w-6" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-black text-[#071d4e]">
                          {version.name}
                        </h2>

                        {version.isCurrent && (
                          <Badge className="bg-emerald-600 text-white">
                            Current
                          </Badge>
                        )}

                        <Badge variant="secondary">
                          {formatLabel(version.status)}
                        </Badge>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {[
                          version.versionLabel,
                          version.country.name,
                          jurisdiction,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>

                      {version.description && (
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                          {version.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
                        <Stat
                          icon={Layers3}
                          value={version._count.frameworks}
                          label="Frameworks"
                        />

                        <Stat
                          icon={FileText}
                          value={version._count.documents}
                          label="Documents"
                        />

                        <Stat
                          icon={BookOpen}
                          value={version._count.importRuns}
                          label="AI Imports"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

type StatProps = {
  icon: React.ComponentType<{
    className?: string;
  }>;
  value: number;
  label: string;
};

function Stat({ icon: Icon, value, label }: StatProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
      <Icon className="h-3.5 w-3.5" />
      {value} {label}
    </span>
  );
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

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
