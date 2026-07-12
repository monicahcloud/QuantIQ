/*
  Warnings:

  - Added the required column `educationLevelId` to the `CurriculumPackage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CurriculumNodeType" AS ENUM ('DOMAIN', 'STRAND', 'STANDARD', 'BENCHMARK', 'OBJECTIVE', 'OUTCOME', 'EXPECTATION', 'SUCCESS_CRITERIA', 'VOCABULARY', 'ESSENTIAL_QUESTION', 'BIG_IDEA', 'MISCONCEPTION', 'KEY_SKILL', 'COMPETENCY', 'CONTENT', 'TOPIC', 'SUBTOPIC', 'INDICATOR', 'LEARNING_TARGET', 'OTHER');

-- AlterTable
ALTER TABLE "CurriculumPackage" ADD COLUMN     "educationLevelId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CurriculumVersion" ADD COLUMN     "languageCode" TEXT NOT NULL DEFAULT 'en';

-- CreateTable
CREATE TABLE "CurriculumNode" (
    "id" TEXT NOT NULL,
    "curriculumPackageId" TEXT NOT NULL,
    "parentNodeId" TEXT,
    "nodeType" "CurriculumNodeType" NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "sequence" INTEGER NOT NULL DEFAULT 1,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "path" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isAssessable" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CurriculumNode_curriculumPackageId_idx" ON "CurriculumNode"("curriculumPackageId");

-- CreateIndex
CREATE INDEX "CurriculumNode_parentNodeId_idx" ON "CurriculumNode"("parentNodeId");

-- CreateIndex
CREATE INDEX "CurriculumNode_nodeType_idx" ON "CurriculumNode"("nodeType");

-- CreateIndex
CREATE INDEX "CurriculumNode_sequence_idx" ON "CurriculumNode"("sequence");

-- CreateIndex
CREATE INDEX "CurriculumNode_depth_idx" ON "CurriculumNode"("depth");

-- CreateIndex
CREATE INDEX "CurriculumNode_status_idx" ON "CurriculumNode"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumNode_curriculumPackageId_code_key" ON "CurriculumNode"("curriculumPackageId", "code");

-- CreateIndex
CREATE INDEX "CurriculumPackage_educationLevelId_idx" ON "CurriculumPackage"("educationLevelId");

-- AddForeignKey
ALTER TABLE "CurriculumPackage" ADD CONSTRAINT "CurriculumPackage_educationLevelId_fkey" FOREIGN KEY ("educationLevelId") REFERENCES "EducationLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumNode" ADD CONSTRAINT "CurriculumNode_curriculumPackageId_fkey" FOREIGN KEY ("curriculumPackageId") REFERENCES "CurriculumPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumNode" ADD CONSTRAINT "CurriculumNode_parentNodeId_fkey" FOREIGN KEY ("parentNodeId") REFERENCES "CurriculumNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
