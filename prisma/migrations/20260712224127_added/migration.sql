-- CreateEnum
CREATE TYPE "ExtractionStatus" AS ENUM ('PENDING', 'REVIEW_REQUIRED', 'APPROVED', 'REJECTED', 'FAILED');

-- CreateTable
CREATE TABLE "CurriculumExtraction" (
    "id" TEXT NOT NULL,
    "importRunId" TEXT NOT NULL,
    "rawJson" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION,
    "warnings" JSONB,
    "aiProvider" TEXT,
    "aiModel" TEXT,
    "processingTimeMs" INTEGER,
    "status" "ExtractionStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumExtraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumExtraction_importRunId_key" ON "CurriculumExtraction"("importRunId");

-- AddForeignKey
ALTER TABLE "CurriculumExtraction" ADD CONSTRAINT "CurriculumExtraction_importRunId_fkey" FOREIGN KEY ("importRunId") REFERENCES "CurriculumImportRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
