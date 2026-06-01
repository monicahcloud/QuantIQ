-- CreateTable
CREATE TABLE "AcademicBoostLead" (
    "id" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "parentEmail" TEXT NOT NULL,
    "parentPhone" TEXT NOT NULL,
    "preferredContact" TEXT,
    "studentName" TEXT NOT NULL,
    "studentAge" TEXT,
    "gradeEntering" TEXT NOT NULL,
    "currentSchool" TEXT,
    "programSelection" TEXT NOT NULL,
    "academicConcerns" TEXT[],
    "academicNotes" TEXT,
    "parentGoals" TEXT,
    "medicalNotes" TEXT,
    "emergencyContactName" TEXT NOT NULL,
    "emergencyContactPhone" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'new',
    "source" TEXT NOT NULL DEFAULT 'Website Form',
    "formResponses" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicBoostLead_pkey" PRIMARY KEY ("id")
);
