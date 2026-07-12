/*
  Warnings:

  - You are about to drop the column `city` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `islandOrRegion` on the `School` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AdministrativeDivisionType" AS ENUM ('ISLAND', 'STATE', 'PROVINCE', 'PARISH', 'REGION', 'COUNTY', 'TERRITORY', 'DISTRICT', 'DEPARTMENT', 'MUNICIPALITY', 'OTHER');

-- CreateEnum
CREATE TYPE "LocalityType" AS ENUM ('CITY', 'TOWN', 'SETTLEMENT', 'VILLAGE', 'DISTRICT', 'MUNICIPALITY', 'COMMUNITY', 'OTHER');

-- AlterTable
ALTER TABLE "EducationAuthority" ADD COLUMN     "administrativeDivisionId" TEXT,
ADD COLUMN     "localityId" TEXT;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "administrativeDivisionId" TEXT,
ADD COLUMN     "localityId" TEXT;

-- AlterTable
ALTER TABLE "School" DROP COLUMN "city",
DROP COLUMN "islandOrRegion",
ADD COLUMN     "administrativeDivisionId" TEXT,
ADD COLUMN     "localityId" TEXT;

-- CreateTable
CREATE TABLE "AdministrativeDivision" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "parentDivisionId" TEXT,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "slug" TEXT NOT NULL,
    "type" "AdministrativeDivisionType" NOT NULL,
    "description" TEXT,
    "sequence" INTEGER,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdministrativeDivision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locality" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "administrativeDivisionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "slug" TEXT NOT NULL,
    "type" "LocalityType" NOT NULL,
    "description" TEXT,
    "postalCode" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "sequence" INTEGER,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Locality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdministrativeDivision_countryId_idx" ON "AdministrativeDivision"("countryId");

-- CreateIndex
CREATE INDEX "AdministrativeDivision_parentDivisionId_idx" ON "AdministrativeDivision"("parentDivisionId");

-- CreateIndex
CREATE INDEX "AdministrativeDivision_type_idx" ON "AdministrativeDivision"("type");

-- CreateIndex
CREATE INDEX "AdministrativeDivision_status_idx" ON "AdministrativeDivision"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AdministrativeDivision_countryId_slug_key" ON "AdministrativeDivision"("countryId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "AdministrativeDivision_countryId_code_key" ON "AdministrativeDivision"("countryId", "code");

-- CreateIndex
CREATE INDEX "Locality_countryId_idx" ON "Locality"("countryId");

-- CreateIndex
CREATE INDEX "Locality_administrativeDivisionId_idx" ON "Locality"("administrativeDivisionId");

-- CreateIndex
CREATE INDEX "Locality_type_idx" ON "Locality"("type");

-- CreateIndex
CREATE INDEX "Locality_status_idx" ON "Locality"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Locality_countryId_slug_key" ON "Locality"("countryId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Locality_administrativeDivisionId_name_key" ON "Locality"("administrativeDivisionId", "name");

-- CreateIndex
CREATE INDEX "EducationAuthority_administrativeDivisionId_idx" ON "EducationAuthority"("administrativeDivisionId");

-- CreateIndex
CREATE INDEX "EducationAuthority_localityId_idx" ON "EducationAuthority"("localityId");

-- CreateIndex
CREATE INDEX "Organization_administrativeDivisionId_idx" ON "Organization"("administrativeDivisionId");

-- CreateIndex
CREATE INDEX "Organization_localityId_idx" ON "Organization"("localityId");

-- CreateIndex
CREATE INDEX "School_administrativeDivisionId_idx" ON "School"("administrativeDivisionId");

-- CreateIndex
CREATE INDEX "School_localityId_idx" ON "School"("localityId");

-- AddForeignKey
ALTER TABLE "EducationAuthority" ADD CONSTRAINT "EducationAuthority_administrativeDivisionId_fkey" FOREIGN KEY ("administrativeDivisionId") REFERENCES "AdministrativeDivision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationAuthority" ADD CONSTRAINT "EducationAuthority_localityId_fkey" FOREIGN KEY ("localityId") REFERENCES "Locality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_administrativeDivisionId_fkey" FOREIGN KEY ("administrativeDivisionId") REFERENCES "AdministrativeDivision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_localityId_fkey" FOREIGN KEY ("localityId") REFERENCES "Locality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_administrativeDivisionId_fkey" FOREIGN KEY ("administrativeDivisionId") REFERENCES "AdministrativeDivision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_localityId_fkey" FOREIGN KEY ("localityId") REFERENCES "Locality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdministrativeDivision" ADD CONSTRAINT "AdministrativeDivision_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdministrativeDivision" ADD CONSTRAINT "AdministrativeDivision_parentDivisionId_fkey" FOREIGN KEY ("parentDivisionId") REFERENCES "AdministrativeDivision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locality" ADD CONSTRAINT "Locality_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locality" ADD CONSTRAINT "Locality_administrativeDivisionId_fkey" FOREIGN KEY ("administrativeDivisionId") REFERENCES "AdministrativeDivision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
