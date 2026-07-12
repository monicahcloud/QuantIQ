import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Boxes,
  FileStack,
  GitBranch,
  Import,
  Network,
} from "lucide-react";

import prisma from "@/lib/prisma";

const modules = [
  {
    title: "Curriculum Versions",
    description:
      "Manage national, regional, authority, organization, and school curriculum versions.",
    href: "/admin/curriculum-engine/versions",
    icon: BookOpenCheck,
    countKey: "versions",
  },
  {
    title: "Frameworks",
    description:
      "Organize curriculum into structures such as Primary, Secondary, IGCSE, PYP, and MYP.",
    href: "/admin/curriculum-engine/frameworks",
    icon: GitBranch,
    countKey: "frameworks",
  },
  {
    title: "Packages",
    description:
      "Connect frameworks to education levels, grade levels, and subjects.",
    href: "/admin/curriculum-engine/packages",
    icon: Boxes,
    countKey: "packages",
  },
  {
    title: "Curriculum Nodes",
    description:
      "Manage strands, standards, benchmarks, objectives, outcomes, vocabulary, and related curriculum content.",
    href: "/admin/curriculum-engine/nodes",
    icon: Network,
    countKey: "nodes",
  },
  {
    title: "Documents",
    description:
      "Manage official curriculum, pacing-guide, framework, assessment, and teacher-guide source files.",
    href: "/admin/curriculum-engine/documents",
    icon: FileStack,
    countKey: "documents",
  },
  {
    title: "Imports",
    description:
      "Review curriculum extraction, validation, approval, and import runs.",
    href: "/admin/curriculum-engine/imports",
    icon: Import,
    countKey: "imports",
  },
] as const;

export default async function CurriculumEnginePage() {
  const [versions, frameworks, packages, nodes, documents, imports] =
    await prisma.$transaction([
      prisma.curriculumVersion.count(),
      prisma.curriculumFramework.count(),
      prisma.curriculumPackage.count(),
      prisma.curriculumNode.count(),
      prisma.curriculumDocument.count(),
      prisma.curriculumImportRun.count(),
    ]);

  const counts = {
    versions,
    frameworks,
    packages,
    nodes,
    documents,
    imports,
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-9">
      <header className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#041334] via-[#0a3b8f] to-violet-700 px-7 py-9 text-white shadow-xl sm:px-9 lg:px-10">
        <h1 className="mt-3 text-3xl text-white font-black tracking-[-0.03em] sm:text-4xl lg:text-5xl">
          Curriculum Engine
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-white/80">
          Govern curriculum versions, source documents, frameworks,
          grade-and-subject packages, curriculum trees, and AI-assisted imports
          from one structured system.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <SummaryBadge label="Versions" value={versions} />
          <SummaryBadge label="Frameworks" value={frameworks} />
          <SummaryBadge label="Packages" value={packages} />
          <SummaryBadge label="Nodes" value={nodes} />
        </div>
      </header>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <Link
              key={module.href}
              href={module.href}
              className="group flex min-h-64 flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
              <div className="flex items-start justify-between gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Icon className="h-6 w-6" />
                </div>

                <p className="text-3xl font-black text-[#071d4e]">
                  {counts[module.countKey]}
                </p>
              </div>

              <h2 className="mt-5 text-lg font-black text-[#071d4e]">
                {module.title}
              </h2>

              <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                {module.description}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-700">
                Manage
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}

function SummaryBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-100">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-white">{value}</p>
    </div>
  );
}
