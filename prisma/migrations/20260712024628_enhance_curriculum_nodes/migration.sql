/*
  Warnings:

  - You are about to drop the column `path` on the `CurriculumNode` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BloomsLevel" AS ENUM ('REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('FOUNDATIONAL', 'DEVELOPING', 'PROFICIENT', 'ADVANCED');

-- CreateEnum
CREATE TYPE "CurriculumRelationshipType" AS ENUM ('PREREQUISITE', 'RELATED', 'REINFORCES', 'SPIRALS_TO', 'CROSS_CURRICULAR', 'SUPPORTS', 'EXTENDS', 'ASSESSES_WITH', 'EQUIVALENT_TO', 'REPLACES', 'OTHER');

-- DropIndex
DROP INDEX "CurriculumNode_curriculumPackageId_code_key";

-- AlterTable
ALTER TABLE "CurriculumNode" DROP COLUMN "path",
ADD COLUMN     "bloomsLevel" "BloomsLevel",
ADD COLUMN     "difficulty" "DifficultyLevel",
ADD COLUMN     "estimatedMinutes" INTEGER,
ADD COLUMN     "materializedPath" TEXT,
ADD COLUMN     "officialText" TEXT,
ADD COLUMN     "sourceDocumentId" TEXT,
ADD COLUMN     "sourcePage" INTEGER,
ADD COLUMN     "sourceSection" TEXT;

-- CreateTable
CREATE TABLE "CurriculumRelationship" (
    "id" TEXT NOT NULL,
    "fromNodeId" TEXT NOT NULL,
    "toNodeId" TEXT NOT NULL,
    "relationshipType" "CurriculumRelationshipType" NOT NULL,
    "description" TEXT,
    "weight" DECIMAL(5,2),
    "metadata" JSONB,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CurriculumRelationship_fromNodeId_idx" ON "CurriculumRelationship"("fromNodeId");

-- CreateIndex
CREATE INDEX "CurriculumRelationship_toNodeId_idx" ON "CurriculumRelationship"("toNodeId");

-- CreateIndex
CREATE INDEX "CurriculumRelationship_relationshipType_idx" ON "CurriculumRelationship"("relationshipType");

-- CreateIndex
CREATE INDEX "CurriculumRelationship_status_idx" ON "CurriculumRelationship"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumRelationship_fromNodeId_toNodeId_relationshipType_key" ON "CurriculumRelationship"("fromNodeId", "toNodeId", "relationshipType");

-- CreateIndex
CREATE INDEX "CurriculumNode_sourceDocumentId_idx" ON "CurriculumNode"("sourceDocumentId");

-- CreateIndex
CREATE INDEX "CurriculumNode_code_idx" ON "CurriculumNode"("code");

-- CreateIndex
CREATE INDEX "CurriculumNode_bloomsLevel_idx" ON "CurriculumNode"("bloomsLevel");

-- CreateIndex
CREATE INDEX "CurriculumNode_difficulty_idx" ON "CurriculumNode"("difficulty");

-- CreateIndex
CREATE INDEX "CurriculumNode_isAssessable_idx" ON "CurriculumNode"("isAssessable");

-- AddForeignKey
ALTER TABLE "CurriculumNode" ADD CONSTRAINT "CurriculumNode_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "CurriculumDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumRelationship" ADD CONSTRAINT "CurriculumRelationship_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "CurriculumNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumRelationship" ADD CONSTRAINT "CurriculumRelationship_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "CurriculumNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
