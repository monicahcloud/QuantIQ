import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileSearch,
  Loader2,
} from "lucide-react";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      name: true,
      importRuns: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          curriculumDocument: {
            select: {
              id: true,
              title: true,
              originalFileName: true,
            },
          },
          extraction: {
            select: {
              id: true,
              status: true,
              confidence: true,
              warnings: true,
              aiProvider: true,
              aiModel: true,
              processingTimeMs: true,
            },
          },
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
          Curriculum Imports
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Review Nova extraction runs before publishing curriculum frameworks,
          packages, and nodes.
        </p>
      </div>

      {version.importRuns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <FileSearch className="mx-auto h-10 w-10 text-slate-300" />

          <h3 className="mt-4 text-lg font-black text-[#071d4e]">
            No curriculum imports
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Upload a curriculum document and select Analyze with Nova to begin
            an import.
          </p>

          <Button asChild className="mt-6 bg-blue-700 hover:bg-blue-800">
            <Link
              href={`/admin/curriculum-engine/versions/${version.id}/documents`}>
              View Documents
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {version.importRuns.map((importRun) => {
            const warningCount = getWarningCount(
              importRun.extraction?.warnings,
            );

            return (
              <article
                key={importRun.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-[#071d4e]">
                        {importRun.curriculumDocument.title}
                      </h3>

                      <ImportStatusBadge status={importRun.status} />
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {importRun.curriculumDocument.originalFileName}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
                      <span>Created {formatDate(importRun.createdAt)}</span>

                      {importRun.extraction?.confidence != null && (
                        <span>
                          Confidence{" "}
                          {Math.round(importRun.extraction.confidence * 100)}%
                        </span>
                      )}

                      {warningCount > 0 && (
                        <span className="text-amber-700">
                          {warningCount} warning
                          {warningCount === 1 ? "" : "s"}
                        </span>
                      )}

                      {importRun.extraction?.aiModel && (
                        <span>Model: {importRun.extraction.aiModel}</span>
                      )}
                    </div>

                    {importRun.errorMessage && (
                      <p className="mt-3 text-sm text-red-600">
                        {importRun.errorMessage}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Button asChild variant="outline">
                      <Link
                        href={`/admin/curriculum-engine/versions/${version.id}/documents`}>
                        Document
                      </Link>
                    </Button>

                    <Button
                      asChild
                      className="bg-violet-700 hover:bg-violet-800">
                      <Link
                        href={`/admin/curriculum-engine/versions/${version.id}/imports/${importRun.id}`}>
                        Review Extraction
                      </Link>
                    </Button>
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

function ImportStatusBadge({
  status,
}: {
  status:
    | "PENDING"
    | "PROCESSING"
    | "REVIEW_REQUIRED"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED";
}) {
  const config = {
    PENDING: {
      label: "Queued",
      className: "bg-amber-100 text-amber-800",
      icon: Clock3,
    },
    PROCESSING: {
      label: "Nova Analyzing",
      className: "bg-blue-100 text-blue-800",
      icon: Loader2,
    },
    REVIEW_REQUIRED: {
      label: "Ready for Review",
      className: "bg-violet-100 text-violet-800",
      icon: AlertCircle,
    },
    COMPLETED: {
      label: "Published",
      className: "bg-emerald-100 text-emerald-800",
      icon: CheckCircle2,
    },
    FAILED: {
      label: "Failed",
      className: "bg-red-100 text-red-800",
      icon: AlertCircle,
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-slate-100 text-slate-700",
      icon: AlertCircle,
    },
  };

  const item = config[status];
  const Icon = item.icon;

  return (
    <Badge className={item.className}>
      <Icon
        className={
          status === "PROCESSING"
            ? "mr-1 h-3.5 w-3.5 animate-spin"
            : "mr-1 h-3.5 w-3.5"
        }
      />
      {item.label}
    </Badge>
  );
}

function getWarningCount(value: unknown) {
  return Array.isArray(value) ? value.length : 0;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-BS", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}
