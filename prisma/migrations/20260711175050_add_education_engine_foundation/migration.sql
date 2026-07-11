-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AuthorityType" AS ENUM ('MINISTRY', 'DEPARTMENT', 'BOARD', 'DISTRICT', 'REGION', 'OTHER');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('GOVERNMENT', 'PRIVATE_NETWORK', 'SCHOOL_BOARD', 'DISTRICT', 'RELIGIOUS_NETWORK', 'CHARTER_NETWORK', 'HOMESCHOOL_NETWORK', 'INDEPENDENT', 'OTHER');

-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('PRESCHOOL', 'PRIMARY', 'JUNIOR_HIGH', 'SENIOR_HIGH', 'ALL_AGE', 'SPECIALIZED', 'VOCATIONAL', 'PRIVATE', 'OTHER');

-- CreateEnum
CREATE TYPE "EducationLevelCode" AS ENUM ('PRESCHOOL', 'PRIMARY', 'HIGH_SCHOOL');

-- CreateEnum
CREATE TYPE "AcademicPeriodType" AS ENUM ('TERM', 'SEMESTER', 'QUARTER', 'TRIMESTER', 'OTHER');

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "officialName" TEXT,
    "iso2Code" TEXT NOT NULL,
    "iso3Code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "defaultLocale" TEXT NOT NULL DEFAULT 'en-BS',
    "defaultTimeZone" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationAuthority" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "AuthorityType" NOT NULL,
    "description" TEXT,
    "websiteUrl" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationAuthority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "authorityId" TEXT,
    "parentOrganizationId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL,
    "description" TEXT,
    "websiteUrl" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "authorityId" TEXT,
    "organizationId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "schoolCode" TEXT,
    "type" "SchoolType" NOT NULL,
    "description" TEXT,
    "islandOrRegion" TEXT,
    "city" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "postalCode" TEXT,
    "websiteUrl" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationLevel" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" "EducationLevelCode" NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sequence" INTEGER NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeLevel" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "educationLevelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "numericGrade" INTEGER,
    "sequence" INTEGER NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sequence" INTEGER NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeSubject" (
    "id" TEXT NOT NULL,
    "gradeLevelId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "sequence" INTEGER,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicYear" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicPeriod" (
    "id" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "AcademicPeriodType" NOT NULL DEFAULT 'TERM',
    "sequence" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicWeek" (
    "id" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "academicPeriodId" TEXT,
    "name" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isInstructional" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicWeek_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_iso2Code_key" ON "Country"("iso2Code");

-- CreateIndex
CREATE UNIQUE INDEX "Country_iso3Code_key" ON "Country"("iso3Code");

-- CreateIndex
CREATE UNIQUE INDEX "Country_slug_key" ON "Country"("slug");

-- CreateIndex
CREATE INDEX "Country_name_idx" ON "Country"("name");

-- CreateIndex
CREATE INDEX "Country_status_idx" ON "Country"("status");

-- CreateIndex
CREATE INDEX "EducationAuthority_countryId_idx" ON "EducationAuthority"("countryId");

-- CreateIndex
CREATE INDEX "EducationAuthority_type_idx" ON "EducationAuthority"("type");

-- CreateIndex
CREATE INDEX "EducationAuthority_status_idx" ON "EducationAuthority"("status");

-- CreateIndex
CREATE UNIQUE INDEX "EducationAuthority_countryId_slug_key" ON "EducationAuthority"("countryId", "slug");

-- CreateIndex
CREATE INDEX "Organization_countryId_idx" ON "Organization"("countryId");

-- CreateIndex
CREATE INDEX "Organization_authorityId_idx" ON "Organization"("authorityId");

-- CreateIndex
CREATE INDEX "Organization_parentOrganizationId_idx" ON "Organization"("parentOrganizationId");

-- CreateIndex
CREATE INDEX "Organization_type_idx" ON "Organization"("type");

-- CreateIndex
CREATE INDEX "Organization_status_idx" ON "Organization"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_countryId_slug_key" ON "Organization"("countryId", "slug");

-- CreateIndex
CREATE INDEX "School_countryId_idx" ON "School"("countryId");

-- CreateIndex
CREATE INDEX "School_authorityId_idx" ON "School"("authorityId");

-- CreateIndex
CREATE INDEX "School_organizationId_idx" ON "School"("organizationId");

-- CreateIndex
CREATE INDEX "School_type_idx" ON "School"("type");

-- CreateIndex
CREATE INDEX "School_status_idx" ON "School"("status");

-- CreateIndex
CREATE UNIQUE INDEX "School_countryId_slug_key" ON "School"("countryId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "School_countryId_schoolCode_key" ON "School"("countryId", "schoolCode");

-- CreateIndex
CREATE INDEX "EducationLevel_countryId_idx" ON "EducationLevel"("countryId");

-- CreateIndex
CREATE INDEX "EducationLevel_status_idx" ON "EducationLevel"("status");

-- CreateIndex
CREATE UNIQUE INDEX "EducationLevel_countryId_code_key" ON "EducationLevel"("countryId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "EducationLevel_countryId_slug_key" ON "EducationLevel"("countryId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "EducationLevel_countryId_sequence_key" ON "EducationLevel"("countryId", "sequence");

-- CreateIndex
CREATE INDEX "GradeLevel_countryId_idx" ON "GradeLevel"("countryId");

-- CreateIndex
CREATE INDEX "GradeLevel_educationLevelId_idx" ON "GradeLevel"("educationLevelId");

-- CreateIndex
CREATE INDEX "GradeLevel_status_idx" ON "GradeLevel"("status");

-- CreateIndex
CREATE UNIQUE INDEX "GradeLevel_countryId_code_key" ON "GradeLevel"("countryId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "GradeLevel_countryId_slug_key" ON "GradeLevel"("countryId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "GradeLevel_countryId_sequence_key" ON "GradeLevel"("countryId", "sequence");

-- CreateIndex
CREATE INDEX "Subject_countryId_idx" ON "Subject"("countryId");

-- CreateIndex
CREATE INDEX "Subject_status_idx" ON "Subject"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_countryId_code_key" ON "Subject"("countryId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_countryId_slug_key" ON "Subject"("countryId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_countryId_sequence_key" ON "Subject"("countryId", "sequence");

-- CreateIndex
CREATE INDEX "GradeSubject_gradeLevelId_idx" ON "GradeSubject"("gradeLevelId");

-- CreateIndex
CREATE INDEX "GradeSubject_subjectId_idx" ON "GradeSubject"("subjectId");

-- CreateIndex
CREATE INDEX "GradeSubject_status_idx" ON "GradeSubject"("status");

-- CreateIndex
CREATE UNIQUE INDEX "GradeSubject_gradeLevelId_subjectId_key" ON "GradeSubject"("gradeLevelId", "subjectId");

-- CreateIndex
CREATE INDEX "AcademicYear_countryId_idx" ON "AcademicYear"("countryId");

-- CreateIndex
CREATE INDEX "AcademicYear_isCurrent_idx" ON "AcademicYear"("isCurrent");

-- CreateIndex
CREATE INDEX "AcademicYear_status_idx" ON "AcademicYear"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicYear_countryId_name_key" ON "AcademicYear"("countryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicYear_countryId_slug_key" ON "AcademicYear"("countryId", "slug");

-- CreateIndex
CREATE INDEX "AcademicPeriod_academicYearId_idx" ON "AcademicPeriod"("academicYearId");

-- CreateIndex
CREATE INDEX "AcademicPeriod_status_idx" ON "AcademicPeriod"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicPeriod_academicYearId_code_key" ON "AcademicPeriod"("academicYearId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicPeriod_academicYearId_sequence_key" ON "AcademicPeriod"("academicYearId", "sequence");

-- CreateIndex
CREATE INDEX "AcademicWeek_academicYearId_idx" ON "AcademicWeek"("academicYearId");

-- CreateIndex
CREATE INDEX "AcademicWeek_academicPeriodId_idx" ON "AcademicWeek"("academicPeriodId");

-- CreateIndex
CREATE INDEX "AcademicWeek_isInstructional_idx" ON "AcademicWeek"("isInstructional");

-- CreateIndex
CREATE INDEX "AcademicWeek_status_idx" ON "AcademicWeek"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicWeek_academicYearId_weekNumber_key" ON "AcademicWeek"("academicYearId", "weekNumber");

-- AddForeignKey
ALTER TABLE "EducationAuthority" ADD CONSTRAINT "EducationAuthority_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_authorityId_fkey" FOREIGN KEY ("authorityId") REFERENCES "EducationAuthority"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_parentOrganizationId_fkey" FOREIGN KEY ("parentOrganizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_authorityId_fkey" FOREIGN KEY ("authorityId") REFERENCES "EducationAuthority"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationLevel" ADD CONSTRAINT "EducationLevel_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeLevel" ADD CONSTRAINT "GradeLevel_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeLevel" ADD CONSTRAINT "GradeLevel_educationLevelId_fkey" FOREIGN KEY ("educationLevelId") REFERENCES "EducationLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeSubject" ADD CONSTRAINT "GradeSubject_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "GradeLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeSubject" ADD CONSTRAINT "GradeSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicYear" ADD CONSTRAINT "AcademicYear_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicPeriod" ADD CONSTRAINT "AcademicPeriod_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicWeek" ADD CONSTRAINT "AcademicWeek_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicWeek" ADD CONSTRAINT "AcademicWeek_academicPeriodId_fkey" FOREIGN KEY ("academicPeriodId") REFERENCES "AcademicPeriod"("id") ON DELETE SET NULL ON UPDATE CASCADE;
