import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileJson,
  FileText,
} from "lucide-react";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

type CurriculumImportReviewPageProps = {
  params: Promise<{
    versionId: string;
    importRunId: string;
  }>;
};

export default async function CurriculumImportReviewPage({
  params,
}: CurriculumImportReviewPageProps) {
  const { versionId, importRunId } = await params;

  const importRun = await prisma.curriculumImportRun.findFirst({
    where: {
      id: importRunId,
      curriculumVersionId: versionId,
    },
    include: {
      curriculumVersion: {
        select: {
          id: true,
          name: true,
        },
      },
      curriculumDocument: {
        select: {
          id: true,
          title: true,
          originalFileName: true,
          fileUrl: true,
          documentType: true,
        },
      },
      curriculumPackage: {
        select: {
          id: true,
          name: true,
        },
      },
      extraction: true,
    },
  });

  if (!importRun) {
    notFound();
  }

  const warnings = normalizeWarnings(importRun.extraction?.warnings);

  const rawJson = importRun.extraction?.rawJson ?? {};

  const extractionSummary = getExtractionSummary(rawJson);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Button asChild variant="ghost" className="-ml-3 mb-3">
            <Link
              href={`/admin/curriculum-engine/versions/${versionId}/imports`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Imports
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-black text-[#071d4e]">
              Review Curriculum Extraction
            </h2>

            <ImportStatusBadge status={importRun.status} />
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {importRun.curriculumDocument.title}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a
              href={importRun.curriculumDocument.fileUrl}
              target="_blank"
              rel="noreferrer">
              <FileText className="h-4 w-4" />
              View Source File
            </a>
          </Button>

          <Button disabled className="bg-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            Approve Extraction
          </Button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Import Status"
          value={formatLabel(importRun.status)}
        />

        <SummaryCard
          label="Confidence"
          value={
            importRun.extraction?.confidence != null
              ? `${Math.round(importRun.extraction.confidence * 100)}%`
              : "Not available"
          }
        />

        <SummaryCard
          label="Frameworks"
          value={String(extractionSummary.frameworkCount)}
        />

        <SummaryCard
          label="Curriculum Nodes"
          value={String(extractionSummary.nodeCount)}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <FileJson className="h-5 w-5 text-blue-700" />

              <div>
                <h3 className="font-black text-[#071d4e]">
                  Extraction Overview
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Structured curriculum information identified by Nova.
                </p>
              </div>
            </div>

            {extractionSummary.frameworks.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-700">
                  No structured frameworks were found in this extraction.
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This may be a pipeline test extraction rather than a real Nova
                  curriculum analysis.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {extractionSummary.frameworks.map(
                  (framework, frameworkIndex) => (
                    <div
                      key={`${framework.name}-${frameworkIndex}`}
                      className="rounded-xl border border-slate-200 p-5">
                      <h4 className="font-black text-[#071d4e]">
                        {framework.name}
                      </h4>

                      <p className="mt-2 text-sm text-slate-500">
                        {framework.packageCount} package
                        {framework.packageCount === 1 ? "" : "s"}
                        {" · "}
                        {framework.nodeCount} node
                        {framework.nodeCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          <details className="rounded-2xl border border-slate-200 bg-white p-6">
            <summary className="cursor-pointer font-black text-[#071d4e]">
              View Raw Extraction JSON
            </summary>

            <pre className="mt-5 max-h-[700px] overflow-auto rounded-xl bg-slate-950 p-5 text-xs leading-6 text-slate-100">
              {JSON.stringify(rawJson, null, 2)}
            </pre>
          </details>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-black text-[#071d4e]">Processing Details</h3>

            <dl className="mt-5 space-y-4 text-sm">
              <DetailRow
                label="Document"
                value={importRun.curriculumDocument.originalFileName}
              />

              <DetailRow
                label="Package"
                value={
                  importRun.curriculumPackage?.name ??
                  "Entire curriculum version"
                }
              />

              <DetailRow
                label="Provider"
                value={
                  importRun.extraction?.aiProvider ??
                  importRun.extractionProvider ??
                  "Not recorded"
                }
              />

              <DetailRow
                label="Model"
                value={
                  importRun.extraction?.aiModel ??
                  importRun.extractionModel ??
                  "Not recorded"
                }
              />

              <DetailRow
                label="Processing time"
                value={formatProcessingTime(
                  importRun.extraction?.processingTimeMs,
                )}
              />

              <DetailRow
                label="Started"
                value={formatDate(importRun.startedAt)}
              />

              <DetailRow
                label="Finished"
                value={formatDate(importRun.completedAt)}
              />
            </dl>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-black">Warnings</h3>
            </div>

            {warnings.length === 0 ? (
              <p className="mt-4 text-sm text-amber-800">
                No warnings were recorded.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {warnings.map((warning, index) => (
                  <li
                    key={`${warning}-${index}`}
                    className="text-sm leading-6 text-amber-900">
                    {warning}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-[#071d4e]">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </dt>

      <dd className="mt-1 font-semibold text-slate-700">{value}</dd>
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
  const styles = {
    PENDING: "bg-amber-100 text-amber-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    REVIEW_REQUIRED: "bg-violet-100 text-violet-800",
    COMPLETED: "bg-emerald-100 text-emerald-800",
    FAILED: "bg-red-100 text-red-800",
    CANCELLED: "bg-slate-100 text-slate-700",
  };

  return <Badge className={styles[status]}>{formatLabel(status)}</Badge>;
}

function normalizeWarnings(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (warning): warning is string => typeof warning === "string",
  );
}

type ExtractionFrameworkSummary = {
  name: string;
  packageCount: number;
  nodeCount: number;
};

function getExtractionSummary(value: unknown): {
  frameworkCount: number;
  nodeCount: number;
  frameworks: ExtractionFrameworkSummary[];
} {
  if (!isRecord(value) || !Array.isArray(value.frameworks)) {
    return {
      frameworkCount: 0,
      nodeCount: 0,
      frameworks: [],
    };
  }

  const frameworks = value.frameworks
    .filter(isRecord)
    .map((framework, index) => {
      const packages = Array.isArray(framework.packages)
        ? framework.packages.filter(isRecord)
        : [];

      const nodeCount = packages.reduce((total, curriculumPackage) => {
        const nodes = Array.isArray(curriculumPackage.nodes)
          ? curriculumPackage.nodes
          : [];

        return total + countNodes(nodes);
      }, 0);

      return {
        name:
          typeof framework.name === "string"
            ? framework.name
            : `Framework ${index + 1}`,
        packageCount: packages.length,
        nodeCount,
      };
    });

  return {
    frameworkCount: frameworks.length,
    nodeCount: frameworks.reduce(
      (total, framework) => total + framework.nodeCount,
      0,
    ),
    frameworks,
  };
}

function countNodes(nodes: unknown[]): number {
  let total = 0;

  for (const node of nodes) {
    if (!isRecord(node)) {
      continue;
    }

    total += 1;

    if (Array.isArray(node.children)) {
      total += countNodes(node.children);
    }
  }

  return total;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value: Date | null) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-BS", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function formatProcessingTime(value: number | null | undefined) {
  if (value == null) {
    return "Not recorded";
  }

  if (value < 1000) {
    return `${value} ms`;
  }

  return `${(value / 1000).toFixed(1)} seconds`;
}
