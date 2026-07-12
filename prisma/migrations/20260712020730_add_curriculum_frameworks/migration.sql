/*
  Warnings:

  - You are about to drop the column `curriculumVersionId` on the `CurriculumPackage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[curriculumFrameworkId,gradeLevelId,subjectId]` on the table `CurriculumPackage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `curriculumFrameworkId` to the `CurriculumPackage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CurriculumPackage" DROP CONSTRAINT "CurriculumPackage_curriculumVersionId_fkey";

-- DropIndex
DROP INDEX "CurriculumPackage_curriculumVersionId_gradeLevelId_subjectI_key";

-- DropIndex
DROP INDEX "CurriculumPackage_curriculumVersionId_idx";

-- AlterTable
ALTER TABLE "CurriculumPackage" DROP COLUMN "curriculumVersionId",
ADD COLUMN     "curriculumFrameworkId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CurriculumFramework" (
    "id" TEXT NOT NULL,
    "curriculumVersionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sequence" INTEGER,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumFramework_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CurriculumFramework_curriculumVersionId_idx" ON "CurriculumFramework"("curriculumVersionId");

-- CreateIndex
CREATE INDEX "CurriculumFramework_status_idx" ON "CurriculumFramework"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumFramework_curriculumVersionId_slug_key" ON "CurriculumFramework"("curriculumVersionId", "slug");

-- CreateIndex
CREATE INDEX "CurriculumPackage_curriculumFrameworkId_idx" ON "CurriculumPackage"("curriculumFrameworkId");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumPackage_curriculumFrameworkId_gradeLevelId_subjec_key" ON "CurriculumPackage"("curriculumFrameworkId", "gradeLevelId", "subjectId");

-- AddForeignKey
ALTER TABLE "CurriculumFramework" ADD CONSTRAINT "CurriculumFramework_curriculumVersionId_fkey" FOREIGN KEY ("curriculumVersionId") REFERENCES "CurriculumVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPackage" ADD CONSTRAINT "CurriculumPackage_curriculumFrameworkId_fkey" FOREIGN KEY ("curriculumFrameworkId") REFERENCES "CurriculumFramework"("id") ON DELETE CASCADE ON UPDATE CASCADE;
