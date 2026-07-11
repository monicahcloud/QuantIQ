-- CreateTable
CREATE TABLE "AcademicCalendarSetting" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "weekStartsOn" TEXT NOT NULL DEFAULT 'MONDAY',
    "instructionalDays" INTEGER[] DEFAULT ARRAY[1, 2, 3, 4, 5]::INTEGER[],
    "defaultPeriodType" "AcademicPeriodType" NOT NULL DEFAULT 'TERM',
    "defaultLocale" TEXT NOT NULL DEFAULT 'en-BS',
    "defaultTimeZone" TEXT NOT NULL DEFAULT 'America/Nassau',
    "autoAssignWeeksToTerms" BOOLEAN NOT NULL DEFAULT true,
    "outsideTermsNonInstructional" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicCalendarSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AcademicCalendarSetting_countryId_key" ON "AcademicCalendarSetting"("countryId");

-- AddForeignKey
ALTER TABLE "AcademicCalendarSetting" ADD CONSTRAINT "AcademicCalendarSetting_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
