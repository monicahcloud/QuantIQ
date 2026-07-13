import CurriculumVersionForm from "@/components/admin/curriculum-engine/version-detail/CurriculumVersionForm";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import prisma from "@/lib/prisma";

export default async function NewCurriculumVersionPage() {
  const countries = await prisma.country.findMany({
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
  });

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <AdminPageHeader
        eyebrow="Curriculum Engine"
        title="Create Curriculum Version"
        description="Create the curriculum record before uploading official source documents."
        backHref="/admin/curriculum-engine/versions"
      />

      <CurriculumVersionForm countries={countries} />
    </div>
  );
}
