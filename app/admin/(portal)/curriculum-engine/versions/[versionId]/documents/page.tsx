import Link from "next/link";
import { FileText, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";

import AnalyzeWithNovaButton from "@/components/admin/curriculum-engine/version-detail/AnalyzeWithNovaButton";
import CurriculumDocumentUploadForm from "@/components/admin/curriculum-engine/version-detail/CurriculumDocumentUploadForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

type CurriculumDocumentsPageProps = {
  params: Promise<{
    versionId: string;
  }>;
};

export default async function CurriculumDocumentsPage({
  params,
}: CurriculumDocumentsPageProps) {
  const { versionId } = await params;

  const version = await prisma.curriculumVersion.findUnique({
    where: {
      id: versionId,
    },
    include: {
      frameworks: {
        include: {
          packages: {
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
          },
        },
      },

      documents: {
        where: {
          status: "ACTIVE",
        },
        include: {
          curriculumPackage: {
            select: {
              name: true,
            },
          },
          importRuns: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              id: true,
              status: true,
              errorMessage: true,
              createdAt: true,
              completedAt: true,
              extraction: {
                select: {
                  id: true,
                  status: true,
                  confidence: true,
                  warnings: true,
                },
              },
            },
          },
          _count: {
            select: {
              importRuns: true,
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

  const packages = version.frameworks.flatMap(
    (framework) => framework.packages,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-[#071d4e]">
            Curriculum Documents
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Upload official source documents before Nova analyzes and converts
            them into structured curriculum data.
          </p>
        </div>

        <CurriculumDocumentUploadForm
          curriculumVersionId={version.id}
          packages={packages}
        />
      </div>

      {version.documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-slate-300" />

          <h3 className="mt-4 text-lg font-black text-[#071d4e]">
            No curriculum documents uploaded
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Upload the official curriculum or pacing guide that Nova should use
            as the source of truth.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {version.documents.map((document) => {
            const latestImport = document.importRuns[0];

            const isPending = latestImport?.status === "PENDING";
            const isProcessing = latestImport?.status === "PROCESSING";
            const isReviewRequired = latestImport?.status === "REVIEW_REQUIRED";

            return (
              <article
                key={document.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-[#071d4e]">
                          {document.title}
                        </h3>

                        {document.isPrimarySource && (
                          <Badge className="bg-emerald-600 text-white">
                            Primary Source
                          </Badge>
                        )}

                        <Badge variant="secondary">
                          {formatLabel(document.documentType)}
                        </Badge>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {document.originalFileName}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {document.curriculumPackage?.name ??
                          "Entire curriculum version"}
                        {" · "}
                        {formatFileSize(document.sizeBytes)}
                        {" · "}
                        {document._count.importRuns} AI imports
                      </p>

                      {latestImport && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <ImportStatusBadge status={latestImport.status} />

                          {latestImport.extraction?.confidence != null && (
                            <span className="text-xs font-semibold text-slate-500">
                              Confidence:{" "}
                              {Math.round(
                                latestImport.extraction.confidence * 100,
                              )}
                              %
                            </span>
                          )}
                        </div>
                      )}

                      {latestImport?.errorMessage && (
                        <p className="mt-3 text-sm text-red-600">
                          {latestImport.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button asChild variant="outline">
                      <a
                        href={document.fileUrl}
                        target="_blank"
                        rel="noreferrer">
                        View File
                      </a>
                    </Button>

                    {isReviewRequired ? (
                      <Button
                        asChild
                        className="bg-violet-700 hover:bg-violet-800">
                        <Link
                          href={`/admin/curriculum-engine/versions/${version.id}/imports/${latestImport.id}`}>
                          Review Extraction
                        </Link>
                      </Button>
                    ) : isPending || isProcessing ? (
                      <Button disabled>
                        <Loader2 className="h-4 w-4 animate-spin" />

                        {isPending ? "Queued..." : "Nova Analyzing..."}
                      </Button>
                    ) : (
                      <AnalyzeWithNovaButton
                        curriculumDocumentId={document.id}
                        curriculumVersionId={version.id}
                        hasActiveImport={false}
                      />
                    )}
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

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatFileSize(sizeBytes: number | null) {
  if (!sizeBytes) {
    return "Unknown size";
  }

  const megabytes = sizeBytes / 1024 / 1024;

  return `${megabytes.toFixed(megabytes >= 10 ? 0 : 1)} MB`;
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
  const styles = {
    PENDING: "bg-amber-100 text-amber-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    REVIEW_REQUIRED: "bg-violet-100 text-violet-800",
    COMPLETED: "bg-emerald-100 text-emerald-800",
    FAILED: "bg-red-100 text-red-800",
    CANCELLED: "bg-slate-100 text-slate-700",
  };

  const labels = {
    PENDING: "Queued",
    PROCESSING: "Nova Analyzing",
    REVIEW_REQUIRED: "Ready for Review",
    COMPLETED: "Published",
    FAILED: "Analysis Failed",
    CANCELLED: "Cancelled",
  };

  return <Badge className={styles[status]}>{labels[status]}</Badge>;
}
