import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  Sparkles,
} from "lucide-react";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";

type CurriculumImportsPageProps = {
  params: Promise<{
    versionId: string;
  }>;
};

export default async function CurriculumImportsPage({
  params,
}: CurriculumImportsPageProps) {
  const { versionId } = await params;

  const version = await prisma.curriculumVersion.findUnique({
    where: {
      id: versionId,
    },
    select: {
      id: true,
      importRuns: {
        include: {
          curriculumDocument: {
            select: {
              title: true,
              originalFileName: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!version) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-black text-[#071d4e]">
          Nova Curriculum Imports
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Track document analysis, extraction results, warnings, and items
          waiting for review.
        </p>
      </div>

      {version.importRuns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-slate-300" />

          <h3 className="mt-4 text-lg font-black text-[#071d4e]">
            No Nova imports yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Upload a curriculum document and select Analyze with Nova.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {version.importRuns.map((run) => {
            const summary = readSummary(run.importSummary);

            return (
              <article
                key={run.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                      <StatusIcon status={run.status} />
                    </div>

                    <div>
                      <h3 className="font-black text-[#071d4e]">
                        {run.curriculumDocument.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {run.curriculumDocument.originalFileName}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <ImportStatusBadge status={run.status} />

                        {run.extractionModel && (
                          <Badge variant="secondary">
                            {run.extractionModel}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid min-w-72 grid-cols-3 gap-3">
                    <SummaryValue
                      label="Frameworks"
                      value={summary.frameworkCount}
                    />

                    <SummaryValue
                      label="Packages"
                      value={summary.packageCount}
                    />

                    <SummaryValue label="Nodes" value={summary.nodeCount} />
                  </div>
                </div>

                {run.errorMessage && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {run.errorMessage}
                  </div>
                )}

                {run.status === "REVIEW_REQUIRED" && (
                  <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="font-bold text-amber-900">
                      Nova completed the extraction.
                    </p>

                    <p className="mt-1 text-sm text-amber-800">
                      Review the proposed frameworks, packages, and curriculum
                      nodes before importing them.
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "PROCESSING") {
    return <Loader2 className="h-5 w-5 animate-spin" />;
  }

  if (status === "REVIEW_REQUIRED") {
    return <CheckCircle2 className="h-5 w-5" />;
  }

  if (status === "FAILED") {
    return <AlertCircle className="h-5 w-5" />;
  }

  return <Clock3 className="h-5 w-5" />;
}

function ImportStatusBadge({ status }: { status: string }) {
  const className: Record<string, string> = {
    PENDING: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    PROCESSING: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    REVIEW_REQUIRED: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    COMPLETED: "bg-emerald-600 text-white hover:bg-emerald-600",
    FAILED: "bg-red-100 text-red-700 hover:bg-red-100",
    CANCELLED: "bg-slate-100 text-slate-500 hover:bg-slate-100",
  };

  return <Badge className={className[status]}>{formatLabel(status)}</Badge>;
}

function SummaryValue({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <p className="text-xl font-black text-[#071d4e]">{value}</p>

      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function readSummary(value: unknown) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {
      frameworkCount: 0,
      packageCount: 0,
      nodeCount: 0,
    };
  }

  const record = value as Record<string, unknown>;

  return {
    frameworkCount:
      typeof record.frameworkCount === "number" ? record.frameworkCount : 0,

    packageCount:
      typeof record.packageCount === "number" ? record.packageCount : 0,

    nodeCount: typeof record.nodeCount === "number" ? record.nodeCount : 0,
  };
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
