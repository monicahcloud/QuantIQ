-- CreateEnum
CREATE TYPE "CurriculumScope" AS ENUM ('COUNTRY', 'ADMINISTRATIVE_DIVISION', 'AUTHORITY', 'ORGANIZATION', 'SCHOOL');

-- CreateEnum
CREATE TYPE "CurriculumVersionStatus" AS ENUM ('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'PUBLISHED', 'RETIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CurriculumDocumentType" AS ENUM ('CURRICULUM', 'PACING_GUIDE', 'SCOPE_AND_SEQUENCE', 'STANDARDS', 'FRAMEWORK', 'ASSESSMENT_GUIDE', 'TEACHER_GUIDE', 'RESOURCE_GUIDE', 'OTHER');

-- CreateEnum
CREATE TYPE "CurriculumImportStatus" AS ENUM ('PENDING', 'PROCESSING', 'REVIEW_REQUIRED', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "CurriculumVersion" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "administrativeDivisionId" TEXT,
    "authorityId" TEXT,
    "organizationId" TEXT,
    "schoolId" TEXT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "versionLabel" TEXT,
    "scope" "CurriculumScope" NOT NULL DEFAULT 'COUNTRY',
    "description" TEXT,
    "notes" TEXT,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "status" "CurriculumVersionStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumPackage" (
    "id" TEXT NOT NULL,
    "curriculumVersionId" TEXT NOT NULL,
    "gradeLevelId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "sequence" INTEGER,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumDocument" (
    "id" TEXT NOT NULL,
    "curriculumVersionId" TEXT NOT NULL,
    "curriculumPackageId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "documentType" "CurriculumDocumentType" NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "storedFileName" TEXT,
    "fileUrl" TEXT NOT NULL,
    "storageKey" TEXT,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "checksum" TEXT,
    "issuedDate" TIMESTAMP(3),
    "effectiveDate" TIMESTAMP(3),
    "expirationDate" TIMESTAMP(3),
    "isPrimarySource" BOOLEAN NOT NULL DEFAULT false,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumImportRun" (
    "id" TEXT NOT NULL,
    "curriculumVersionId" TEXT NOT NULL,
    "curriculumPackageId" TEXT,
    "curriculumDocumentId" TEXT NOT NULL,
    "initiatedByClerkUserId" TEXT,
    "status" "CurriculumImportStatus" NOT NULL DEFAULT 'PENDING',
    "extractionProvider" TEXT,
    "extractionModel" TEXT,
    "totalPages" INTEGER,
    "processedPages" INTEGER DEFAULT 0,
    "extractedData" JSONB,
    "validationData" JSONB,
    "importSummary" JSONB,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumImportRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CurriculumVersion_countryId_idx" ON "CurriculumVersion"("countryId");

-- CreateIndex
CREATE INDEX "CurriculumVersion_administrativeDivisionId_idx" ON "CurriculumVersion"("administrativeDivisionId");

-- CreateIndex
CREATE INDEX "CurriculumVersion_authorityId_idx" ON "CurriculumVersion"("authorityId");

-- CreateIndex
CREATE INDEX "CurriculumVersion_organizationId_idx" ON "CurriculumVersion"("organizationId");

-- CreateIndex
CREATE INDEX "CurriculumVersion_schoolId_idx" ON "CurriculumVersion"("schoolId");

-- CreateIndex
CREATE INDEX "CurriculumVersion_scope_idx" ON "CurriculumVersion"("scope");

-- CreateIndex
CREATE INDEX "CurriculumVersion_status_idx" ON "CurriculumVersion"("status");

-- CreateIndex
CREATE INDEX "CurriculumVersion_isCurrent_idx" ON "CurriculumVersion"("isCurrent");

-- CreateIndex
CREATE INDEX "CurriculumVersion_effectiveFrom_effectiveTo_idx" ON "CurriculumVersion"("effectiveFrom", "effectiveTo");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumVersion_countryId_slug_key" ON "CurriculumVersion"("countryId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumVersion_countryId_code_key" ON "CurriculumVersion"("countryId", "code");

-- CreateIndex
CREATE INDEX "CurriculumPackage_curriculumVersionId_idx" ON "CurriculumPackage"("curriculumVersionId");

-- CreateIndex
CREATE INDEX "CurriculumPackage_gradeLevelId_idx" ON "CurriculumPackage"("gradeLevelId");

-- CreateIndex
CREATE INDEX "CurriculumPackage_subjectId_idx" ON "CurriculumPackage"("subjectId");

-- CreateIndex
CREATE INDEX "CurriculumPackage_status_idx" ON "CurriculumPackage"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumPackage_curriculumVersionId_gradeLevelId_subjectI_key" ON "CurriculumPackage"("curriculumVersionId", "gradeLevelId", "subjectId");

-- CreateIndex
CREATE INDEX "CurriculumDocument_curriculumVersionId_idx" ON "CurriculumDocument"("curriculumVersionId");

-- CreateIndex
CREATE INDEX "CurriculumDocument_curriculumPackageId_idx" ON "CurriculumDocument"("curriculumPackageId");

-- CreateIndex
CREATE INDEX "CurriculumDocument_documentType_idx" ON "CurriculumDocument"("documentType");

-- CreateIndex
CREATE INDEX "CurriculumDocument_isPrimarySource_idx" ON "CurriculumDocument"("isPrimarySource");

-- CreateIndex
CREATE INDEX "CurriculumDocument_status_idx" ON "CurriculumDocument"("status");

-- CreateIndex
CREATE INDEX "CurriculumImportRun_curriculumVersionId_idx" ON "CurriculumImportRun"("curriculumVersionId");

-- CreateIndex
CREATE INDEX "CurriculumImportRun_curriculumPackageId_idx" ON "CurriculumImportRun"("curriculumPackageId");

-- CreateIndex
CREATE INDEX "CurriculumImportRun_curriculumDocumentId_idx" ON "CurriculumImportRun"("curriculumDocumentId");

-- CreateIndex
CREATE INDEX "CurriculumImportRun_status_idx" ON "CurriculumImportRun"("status");

-- CreateIndex
CREATE INDEX "CurriculumImportRun_initiatedByClerkUserId_idx" ON "CurriculumImportRun"("initiatedByClerkUserId");

-- AddForeignKey
ALTER TABLE "CurriculumVersion" ADD CONSTRAINT "CurriculumVersion_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumVersion" ADD CONSTRAINT "CurriculumVersion_administrativeDivisionId_fkey" FOREIGN KEY ("administrativeDivisionId") REFERENCES "AdministrativeDivision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumVersion" ADD CONSTRAINT "CurriculumVersion_authorityId_fkey" FOREIGN KEY ("authorityId") REFERENCES "EducationAuthority"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumVersion" ADD CONSTRAINT "CurriculumVersion_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumVersion" ADD CONSTRAINT "CurriculumVersion_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPackage" ADD CONSTRAINT "CurriculumPackage_curriculumVersionId_fkey" FOREIGN KEY ("curriculumVersionId") REFERENCES "CurriculumVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPackage" ADD CONSTRAINT "CurriculumPackage_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "GradeLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPackage" ADD CONSTRAINT "CurriculumPackage_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumDocument" ADD CONSTRAINT "CurriculumDocument_curriculumVersionId_fkey" FOREIGN KEY ("curriculumVersionId") REFERENCES "CurriculumVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumDocument" ADD CONSTRAINT "CurriculumDocument_curriculumPackageId_fkey" FOREIGN KEY ("curriculumPackageId") REFERENCES "CurriculumPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumImportRun" ADD CONSTRAINT "CurriculumImportRun_curriculumVersionId_fkey" FOREIGN KEY ("curriculumVersionId") REFERENCES "CurriculumVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumImportRun" ADD CONSTRAINT "CurriculumImportRun_curriculumPackageId_fkey" FOREIGN KEY ("curriculumPackageId") REFERENCES "CurriculumPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumImportRun" ADD CONSTRAINT "CurriculumImportRun_curriculumDocumentId_fkey" FOREIGN KEY ("curriculumDocumentId") REFERENCES "CurriculumDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
