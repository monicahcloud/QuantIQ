import { notFound } from "next/navigation";

import CurriculumVersionTabs from "@/components/admin/curriculum-engine/version-detail/CurriculumVersionTabs";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";

type CurriculumVersionLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    versionId: string;
  }>;
};

export default async function CurriculumVersionLayout({
  children,
  params,
}: CurriculumVersionLayoutProps) {
  const { versionId } = await params;

  const version = await prisma.curriculumVersion.findUnique({
    where: {
      id: versionId,
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
    },
  });

  if (!version) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <AdminPageHeader
        eyebrow="Curriculum Version"
        title={version.name}
        description={[
          version.versionLabel,
          version.country.name,
          getJurisdictionName(version),
        ]
          .filter(Boolean)
          .join(" · ")}
        backHref="/admin/curriculum-engine/versions"
        actions={
          <div className="flex items-center gap-2">
            {version.isCurrent && (
              <Badge className="bg-emerald-600 text-white">Current</Badge>
            )}

            <Badge variant="secondary">{formatLabel(version.status)}</Badge>
          </div>
        }
      />

      <CurriculumVersionTabs versionId={version.id} />

      {children}
    </div>
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
