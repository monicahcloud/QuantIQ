/*
  Warnings:

  - The `weekStartsOn` column on the `AcademicCalendarSetting` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WeekStartDay" AS ENUM ('MONDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "AcademicCalendarSetting" DROP COLUMN "weekStartsOn",
ADD COLUMN     "weekStartsOn" "WeekStartDay" NOT NULL DEFAULT 'MONDAY';
