import { FileText } from "lucide-react";
import { notFound } from "next/navigation";

import CurriculumDocumentUploadForm from "@/components/admin/curriculum-engine/version-detail/CurriculumDocumentUploadForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import AnalyzeWithNovaButton from "@/components/admin/curriculum-engine/version-detail/AnalyzeWithNovaButton";

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
            },
          },
          _count: {
            select: {
              importRuns: true,
            },
          },
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
          {version.documents.map((document) => (
            <article
              key={document.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>
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
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" disabled>
                    View File
                  </Button>

                  <AnalyzeWithNovaButton
                    curriculumDocumentId={document.id}
                    curriculumVersionId={version.id}
                    hasActiveImport={
                      document.importRuns[0]?.status === "PENDING" ||
                      document.importRuns[0]?.status === "PROCESSING"
                    }
                  />
                </div>
              </div>
            </article>
          ))}
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
