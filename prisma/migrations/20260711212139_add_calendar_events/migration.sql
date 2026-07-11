-- CreateEnum
CREATE TYPE "CalendarEventType" AS ENUM ('PUBLIC_HOLIDAY', 'SCHOOL_HOLIDAY', 'SCHOOL_BREAK', 'PROFESSIONAL_DEVELOPMENT', 'TEACHER_WORKDAY', 'EXAM_PERIOD', 'NATIONAL_ASSESSMENT', 'PARENT_CONFERENCE', 'ORIENTATION', 'SPORTS_DAY', 'CULTURAL_EVENT', 'GRADUATION', 'MINISTRY_EVENT', 'SCHOOL_CLOSURE', 'EMERGENCY_CLOSURE', 'WEATHER_EVENT', 'OTHER');

-- CreateEnum
CREATE TYPE "CalendarEventScope" AS ENUM ('COUNTRY', 'AUTHORITY', 'ORGANIZATION', 'SCHOOL');

-- CreateTable
CREATE TABLE "CalendarEvent" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "authorityId" TEXT,
    "organizationId" TEXT,
    "schoolId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventType" "CalendarEventType" NOT NULL,
    "scope" "CalendarEventScope" NOT NULL DEFAULT 'COUNTRY',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "allDay" BOOLEAN NOT NULL DEFAULT true,
    "isInstructional" BOOLEAN NOT NULL DEFAULT false,
    "affectsPacing" BOOLEAN NOT NULL DEFAULT true,
    "affectsForecast" BOOLEAN NOT NULL DEFAULT true,
    "affectsAttendance" BOOLEAN NOT NULL DEFAULT false,
    "affectsAssessments" BOOLEAN NOT NULL DEFAULT false,
    "affectsLessonPlanning" BOOLEAN NOT NULL DEFAULT true,
    "color" TEXT,
    "notes" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CalendarEvent_countryId_idx" ON "CalendarEvent"("countryId");

-- CreateIndex
CREATE INDEX "CalendarEvent_academicYearId_idx" ON "CalendarEvent"("academicYearId");

-- CreateIndex
CREATE INDEX "CalendarEvent_authorityId_idx" ON "CalendarEvent"("authorityId");

-- CreateIndex
CREATE INDEX "CalendarEvent_organizationId_idx" ON "CalendarEvent"("organizationId");

-- CreateIndex
CREATE INDEX "CalendarEvent_schoolId_idx" ON "CalendarEvent"("schoolId");

-- CreateIndex
CREATE INDEX "CalendarEvent_eventType_idx" ON "CalendarEvent"("eventType");

-- CreateIndex
CREATE INDEX "CalendarEvent_scope_idx" ON "CalendarEvent"("scope");

-- CreateIndex
CREATE INDEX "CalendarEvent_startDate_endDate_idx" ON "CalendarEvent"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "CalendarEvent_status_idx" ON "CalendarEvent"("status");

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_authorityId_fkey" FOREIGN KEY ("authorityId") REFERENCES "EducationAuthority"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
