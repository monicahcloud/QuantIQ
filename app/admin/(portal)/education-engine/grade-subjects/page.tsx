import GradeSubjectManager from "@/components/admin/education-engine/grade-subjects/GradeSubjectManager";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import prisma from "@/lib/prisma";

export default async function GradeSubjectsPage() {
  const [countries, educationLevels, grades, subjects, mappings] =
    await Promise.all([
      prisma.country.findMany({
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
      }),

      prisma.educationLevel.findMany({
        where: {
          status: "ACTIVE",
        },
        select: {
          id: true,
          countryId: true,
          name: true,
        },
        orderBy: [
          {
            country: {
              name: "asc",
            },
          },
          {
            sequence: "asc",
          },
        ],
      }),

      prisma.gradeLevel.findMany({
        where: {
          status: "ACTIVE",
        },
        select: {
          id: true,
          countryId: true,
          educationLevelId: true,
          name: true,
          sequence: true,
        },
        orderBy: [
          {
            country: {
              name: "asc",
            },
          },
          {
            sequence: "asc",
          },
        ],
      }),

      prisma.subject.findMany({
        where: {
          status: "ACTIVE",
        },
        select: {
          id: true,
          countryId: true,
          name: true,
          code: true,
          sequence: true,
        },
        orderBy: [
          {
            country: {
              name: "asc",
            },
          },
          {
            sequence: "asc",
          },
        ],
      }),

      prisma.gradeSubject.findMany({
        select: {
          gradeLevelId: true,
          subjectId: true,
          status: true,
          isRequired: true,
        },
      }),
    ]);

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <AdminPageHeader
        eyebrow="Education Engine"
        title="Grade–Subject Mapping"
        description="Assign country-level subjects to the grades where they are taught. These mappings control the subject options shown throughout the Lesson Planner, Curriculum Engine, and Pacing Guide tools."
        backHref="/admin/education-engine"
      />

      <GradeSubjectManager
        countries={countries}
        educationLevels={educationLevels}
        grades={grades}
        subjects={subjects}
        mappings={mappings}
      />
    </div>
  );
}
