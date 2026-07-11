import AcademicCalendarSettingsForm from "@/components/admin/education-engine/academic-calendar/settings/AcademicCalendarSettingsForm";
import prisma from "@/lib/prisma";

export default async function AcademicCalendarSettingsPage() {
  const [countries, settings] = await Promise.all([
    prisma.country.findMany({
      where: {
        status: "ACTIVE",
      },

      select: {
        id: true,
        name: true,
        defaultLocale: true,
        defaultTimeZone: true,
      },

      orderBy: {
        name: "asc",
      },
    }),

    prisma.academicCalendarSetting.findMany({
      select: {
        countryId: true,
        weekStartsOn: true,
        instructionalDays: true,
        defaultPeriodType: true,
        defaultLocale: true,
        defaultTimeZone: true,
        autoAssignWeeksToTerms: true,
        outsideTermsNonInstructional: true,
      },
    }),
  ]);

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
          Academic Calendar
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#071d4e]">
          Calendar Settings
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Configure country-specific instructional days, calendar conventions,
          localization, and week-generation behavior.
        </p>
      </div>

      <AcademicCalendarSettingsForm countries={countries} settings={settings} />
    </div>
  );
}
