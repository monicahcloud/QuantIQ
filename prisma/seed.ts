import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const bahamasSubjects = [
  {
    name: "Language Arts",
    code: "LANGUAGE_ARTS",
    slug: "language-arts",
    sequence: 1,
  },
  {
    name: "Mathematics",
    code: "MATHEMATICS",
    slug: "mathematics",
    sequence: 2,
  },
  {
    name: "Science",
    code: "SCIENCE",
    slug: "science",
    sequence: 3,
  },
  {
    name: "Social Studies",
    code: "SOCIAL_STUDIES",
    slug: "social-studies",
    sequence: 4,
  },
  {
    name: "Social Science",
    code: "SOCIAL_SCIENCE",
    slug: "social-science",
    sequence: 5,
  },
  {
    name: "Religious Studies",
    code: "RELIGIOUS_STUDIES",
    slug: "religious-studies",
    sequence: 6,
  },
  {
    name: "Health and Family Life",
    code: "HEALTH_AND_FAMILY_LIFE",
    slug: "health-and-family-life",
    sequence: 7,
  },
  {
    name: "Spanish",
    code: "SPANISH",
    slug: "spanish",
    sequence: 8,
  },
  {
    name: "Performing Arts",
    code: "PERFORMING_ARTS",
    slug: "performing-arts",
    sequence: 9,
  },
  {
    name: "Visual Arts",
    code: "VISUAL_ARTS",
    slug: "visual-arts",
    sequence: 10,
  },
  {
    name: "Computer Studies",
    code: "COMPUTER_STUDIES",
    slug: "computer-studies",
    sequence: 11,
  },
  {
    name: "Physical Education",
    code: "PHYSICAL_EDUCATION",
    slug: "physical-education",
    sequence: 12,
  },
  {
    name: "Handwriting",
    code: "HANDWRITING",
    slug: "handwriting",
    sequence: 13,
  },
  {
    name: "Grammar",
    code: "GRAMMAR",
    slug: "grammar",
    sequence: 14,
  },
  {
    name: "Word Study",
    code: "WORD_STUDY",
    slug: "word-study",
    sequence: 15,
  },
  {
    name: "Written Composition",
    code: "WRITTEN_COMPOSITION",
    slug: "written-composition",
    sequence: 16,
  },
  {
    name: "Reading",
    code: "READING",
    slug: "reading",
    sequence: 17,
  },
];

async function main() {
  const bahamas = await prisma.country.upsert({
    where: {
      iso2Code: "BS",
    },
    update: {
      name: "The Bahamas",
      officialName: "Commonwealth of The Bahamas",
      iso3Code: "BHS",
      slug: "the-bahamas",
      defaultLocale: "en-BS",
      defaultTimeZone: "America/Nassau",
      status: "ACTIVE",
    },
    create: {
      name: "The Bahamas",
      officialName: "Commonwealth of The Bahamas",
      iso2Code: "BS",
      iso3Code: "BHS",
      slug: "the-bahamas",
      defaultLocale: "en-BS",
      defaultTimeZone: "America/Nassau",
      status: "ACTIVE",
    },
  });

  const ministry = await prisma.educationAuthority.upsert({
    where: {
      countryId_slug: {
        countryId: bahamas.id,
        slug: "ministry-of-education",
      },
    },
    update: {
      name: "Ministry of Education and Technical and Vocational Training",
      type: "MINISTRY",
      status: "ACTIVE",
    },
    create: {
      countryId: bahamas.id,
      name: "Ministry of Education and Technical and Vocational Training",
      slug: "ministry-of-education",
      type: "MINISTRY",
      status: "ACTIVE",
    },
  });

  const governmentSchools = await prisma.organization.upsert({
    where: {
      countryId_slug: {
        countryId: bahamas.id,
        slug: "government-schools",
      },
    },
    update: {
      authorityId: ministry.id,
      name: "Government Schools",
      type: "GOVERNMENT",
      status: "ACTIVE",
    },
    create: {
      countryId: bahamas.id,
      authorityId: ministry.id,
      name: "Government Schools",
      slug: "government-schools",
      type: "GOVERNMENT",
      status: "ACTIVE",
    },
  });

  await prisma.organization.upsert({
    where: {
      countryId_slug: {
        countryId: bahamas.id,
        slug: "independent-private-schools",
      },
    },
    update: {
      name: "Independent and Private Schools",
      type: "PRIVATE_NETWORK",
      status: "ACTIVE",
    },
    create: {
      countryId: bahamas.id,
      name: "Independent and Private Schools",
      slug: "independent-private-schools",
      type: "PRIVATE_NETWORK",
      status: "ACTIVE",
    },
  });

  const preschool = await prisma.educationLevel.upsert({
    where: {
      countryId_code: {
        countryId: bahamas.id,
        code: "PRESCHOOL",
      },
    },
    update: {
      name: "Preschool",
      slug: "preschool",
      sequence: 1,
      status: "ACTIVE",
    },
    create: {
      countryId: bahamas.id,
      name: "Preschool",
      code: "PRESCHOOL",
      slug: "preschool",
      sequence: 1,
      status: "ACTIVE",
    },
  });

  const primary = await prisma.educationLevel.upsert({
    where: {
      countryId_code: {
        countryId: bahamas.id,
        code: "PRIMARY",
      },
    },
    update: {
      name: "Primary",
      slug: "primary",
      sequence: 2,
      status: "ACTIVE",
    },
    create: {
      countryId: bahamas.id,
      name: "Primary",
      code: "PRIMARY",
      slug: "primary",
      sequence: 2,
      status: "ACTIVE",
    },
  });

  const highSchool = await prisma.educationLevel.upsert({
    where: {
      countryId_code: {
        countryId: bahamas.id,
        code: "HIGH_SCHOOL",
      },
    },
    update: {
      name: "High School",
      slug: "high-school",
      sequence: 3,
      status: "ACTIVE",
    },
    create: {
      countryId: bahamas.id,
      name: "High School",
      code: "HIGH_SCHOOL",
      slug: "high-school",
      sequence: 3,
      status: "ACTIVE",
    },
  });

  const gradeDefinitions = [
    {
      name: "Preschool",
      code: "PRESCHOOL",
      slug: "preschool",
      numericGrade: null,
      sequence: 0,
      educationLevelId: preschool.id,
    },
    ...Array.from({ length: 6 }, (_, index) => {
      const grade = index + 1;

      return {
        name: `Grade ${grade}`,
        code: `GRADE_${grade}`,
        slug: `grade-${grade}`,
        numericGrade: grade,
        sequence: grade,
        educationLevelId: primary.id,
      };
    }),
    ...Array.from({ length: 6 }, (_, index) => {
      const grade = index + 7;

      return {
        name: `Grade ${grade}`,
        code: `GRADE_${grade}`,
        slug: `grade-${grade}`,
        numericGrade: grade,
        sequence: grade,
        educationLevelId: highSchool.id,
      };
    }),
  ];

  const gradeLevels = [];

  for (const grade of gradeDefinitions) {
    const savedGrade = await prisma.gradeLevel.upsert({
      where: {
        countryId_code: {
          countryId: bahamas.id,
          code: grade.code,
        },
      },
      update: {
        educationLevelId: grade.educationLevelId,
        name: grade.name,
        slug: grade.slug,
        numericGrade: grade.numericGrade,
        sequence: grade.sequence,
        status: "ACTIVE",
      },
      create: {
        countryId: bahamas.id,
        educationLevelId: grade.educationLevelId,
        name: grade.name,
        code: grade.code,
        slug: grade.slug,
        numericGrade: grade.numericGrade,
        sequence: grade.sequence,
        status: "ACTIVE",
      },
    });

    gradeLevels.push(savedGrade);
  }

  const subjects = [];

  for (const subject of bahamasSubjects) {
    const savedSubject = await prisma.subject.upsert({
      where: {
        countryId_code: {
          countryId: bahamas.id,
          code: subject.code,
        },
      },
      update: {
        name: subject.name,
        slug: subject.slug,
        sequence: subject.sequence,
        status: "ACTIVE",
      },
      create: {
        countryId: bahamas.id,
        name: subject.name,
        code: subject.code,
        slug: subject.slug,
        sequence: subject.sequence,
        status: "ACTIVE",
      },
    });

    subjects.push(savedSubject);
  }

  const primaryGrades = gradeLevels.filter(
    (grade) =>
      grade.numericGrade !== null &&
      grade.numericGrade >= 1 &&
      grade.numericGrade <= 6,
  );

  for (const grade of primaryGrades) {
    for (const subject of subjects) {
      await prisma.gradeSubject.upsert({
        where: {
          gradeLevelId_subjectId: {
            gradeLevelId: grade.id,
            subjectId: subject.id,
          },
        },
        update: {
          isRequired: true,
          sequence: subject.sequence,
          status: "ACTIVE",
        },
        create: {
          gradeLevelId: grade.id,
          subjectId: subject.id,
          isRequired: true,
          sequence: subject.sequence,
          status: "ACTIVE",
        },
      });
    }
  }

  const academicYear = await prisma.academicYear.upsert({
    where: {
      countryId_name: {
        countryId: bahamas.id,
        name: "2025-2026",
      },
    },
    update: {
      slug: "2025-2026",
      startDate: new Date("2025-09-01T00:00:00.000Z"),
      endDate: new Date("2026-06-30T23:59:59.999Z"),
      isCurrent: true,
      status: "ACTIVE",
    },
    create: {
      countryId: bahamas.id,
      name: "2025-2026",
      slug: "2025-2026",
      startDate: new Date("2025-09-01T00:00:00.000Z"),
      endDate: new Date("2026-06-30T23:59:59.999Z"),
      isCurrent: true,
      status: "ACTIVE",
    },
  });

  const periodDefinitions = [
    {
      name: "Christmas Term",
      code: "CHRISTMAS_TERM",
      sequence: 1,
      startDate: new Date("2025-09-01T00:00:00.000Z"),
      endDate: new Date("2025-12-19T23:59:59.999Z"),
    },
    {
      name: "Easter Term",
      code: "EASTER_TERM",
      sequence: 2,
      startDate: new Date("2026-01-05T00:00:00.000Z"),
      endDate: new Date("2026-04-02T23:59:59.999Z"),
    },
    {
      name: "Summer Term",
      code: "SUMMER_TERM",
      sequence: 3,
      startDate: new Date("2026-04-13T00:00:00.000Z"),
      endDate: new Date("2026-06-30T23:59:59.999Z"),
    },
  ];

  const periods = [];

  for (const period of periodDefinitions) {
    const savedPeriod = await prisma.academicPeriod.upsert({
      where: {
        academicYearId_code: {
          academicYearId: academicYear.id,
          code: period.code,
        },
      },
      update: {
        name: period.name,
        type: "TERM",
        sequence: period.sequence,
        startDate: period.startDate,
        endDate: period.endDate,
        status: "ACTIVE",
      },
      create: {
        academicYearId: academicYear.id,
        name: period.name,
        code: period.code,
        type: "TERM",
        sequence: period.sequence,
        startDate: period.startDate,
        endDate: period.endDate,
        status: "ACTIVE",
      },
    });

    periods.push(savedPeriod);
  }

  const firstMonday = new Date("2025-09-01T00:00:00.000Z");

  for (let index = 0; index < 44; index += 1) {
    const startDate = new Date(firstMonday);
    startDate.setUTCDate(firstMonday.getUTCDate() + index * 7);

    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 4);
    endDate.setUTCHours(23, 59, 59, 999);

    const period = periods.find(
      (item) => startDate >= item.startDate && startDate <= item.endDate,
    );

    await prisma.academicWeek.upsert({
      where: {
        academicYearId_weekNumber: {
          academicYearId: academicYear.id,
          weekNumber: index + 1,
        },
      },
      update: {
        academicPeriodId: period?.id ?? null,
        name: `Week ${index + 1}`,
        startDate,
        endDate,
        isInstructional: Boolean(period),
        status: "ACTIVE",
      },
      create: {
        academicYearId: academicYear.id,
        academicPeriodId: period?.id ?? null,
        name: `Week ${index + 1}`,
        weekNumber: index + 1,
        startDate,
        endDate,
        isInstructional: Boolean(period),
        status: "ACTIVE",
      },
    });
  }

  console.log({
    country: bahamas.name,
    authority: ministry.name,
    organization: governmentSchools.name,
    gradeCount: gradeLevels.length,
    subjectCount: subjects.length,
    academicYear: academicYear.name,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
