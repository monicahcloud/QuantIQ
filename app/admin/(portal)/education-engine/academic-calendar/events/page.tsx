import { CalendarDays, Sparkles } from "lucide-react";

import CalendarEventActions from "@/components/admin/education-engine/academic-calendar/events/CalendarEventActions";
import CreateCalendarEventForm from "@/components/admin/education-engine/academic-calendar/events/CreateCalendarEventForm";
import AdminEmptyState from "@/components/admin/shared/AdminEmptyState";
import AdminSearchBar from "@/components/admin/shared/AdminSearchBar";
import AdminStatusBadge from "@/components/admin/shared/AdminStatusBadge";
import AdminTableShell from "@/components/admin/shared/AdminTableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

type CalendarEventsPageProps = {
  searchParams: Promise<{
    q?: string;
    country?: string;
    year?: string;
    type?: string;
    scope?: string;
  }>;
};

export default async function CalendarEventsPage({
  searchParams,
}: CalendarEventsPageProps) {
  const {
    q = "",
    country = "",
    year = "",
    type = "",
    scope = "",
  } = await searchParams;

  const search = q.trim();
  const countryId = country.trim();
  const academicYearId = year.trim();
  const eventType = type.trim();
  const eventScope = scope.trim();

  const [
    countries,
    academicYears,
    authorities,
    organizations,
    schools,
    events,
  ] = await Promise.all([
    prisma.country.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.academicYear.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        countryId: true,
        name: true,
        startDate: true,
        endDate: true,
      },
      orderBy: [
        {
          country: {
            name: "asc",
          },
        },
        {
          startDate: "desc",
        },
      ],
    }),

    prisma.educationAuthority.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        countryId: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.organization.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        countryId: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.school.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        countryId: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.calendarEvent.findMany({
      where: {
        ...(search
          ? {
              OR: [
                {
                  title: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),

        ...(countryId ? { countryId } : {}),
        ...(academicYearId ? { academicYearId } : {}),
        ...(eventType
          ? {
              eventType: eventType as never,
            }
          : {}),
        ...(eventScope
          ? {
              scope: eventScope as never,
            }
          : {}),
      },

      include: {
        country: {
          select: {
            name: true,
            iso2Code: true,
          },
        },

        academicYear: {
          select: {
            name: true,
          },
        },

        authority: {
          select: {
            name: true,
          },
        },

        organization: {
          select: {
            name: true,
          },
        },

        school: {
          select: {
            name: true,
          },
        },
      },

      orderBy: [
        {
          startDate: "asc",
        },
        {
          title: "asc",
        },
      ],
    }),
  ]);

  const yearOptions = countryId
    ? academicYears.filter(
        (academicYear) => academicYear.countryId === countryId,
      )
    : academicYears;

  const formAcademicYears = academicYears.map((academicYear) => ({
    id: academicYear.id,
    countryId: academicYear.countryId,
    name: academicYear.name,
    startDate: academicYear.startDate.toISOString().slice(0, 10),
    endDate: academicYear.endDate.toISOString().slice(0, 10),
  }));

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
            Academic Calendar
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#071d4e]">
            Calendar Events
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Manage holidays, school breaks, examinations, professional days,
            closures, cultural events, and other dates that affect instruction
            and pacing.
          </p>
        </div>

        <CreateCalendarEventForm
          countries={countries}
          academicYears={formAcademicYears}
          authorities={authorities}
          organizations={organizations}
          schools={schools}
        />
      </div>

      <AdminTableShell
        toolbar={
          <div className="space-y-4">
            <AdminSearchBar
              defaultValue={search}
              placeholder="Search calendar events..."
            />

            <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {search && <input type="hidden" name="q" value={search} />}

              <select
                name="country"
                defaultValue={countryId}
                className={filterClassName}>
                <option value="">All countries</option>

                {countries.map((countryOption) => (
                  <option key={countryOption.id} value={countryOption.id}>
                    {countryOption.name}
                  </option>
                ))}
              </select>

              <select
                name="year"
                defaultValue={academicYearId}
                className={filterClassName}>
                <option value="">All academic years</option>

                {yearOptions.map((academicYear) => (
                  <option key={academicYear.id} value={academicYear.id}>
                    {academicYear.name}
                  </option>
                ))}
              </select>

              <select
                name="type"
                defaultValue={eventType}
                className={filterClassName}>
                <option value="">All event types</option>
                <option value="PUBLIC_HOLIDAY">Public Holiday</option>
                <option value="SCHOOL_BREAK">School Break</option>
                <option value="PROFESSIONAL_DEVELOPMENT">
                  Professional Development
                </option>
                <option value="EXAM_PERIOD">Exam Period</option>
                <option value="SCHOOL_CLOSURE">School Closure</option>
                <option value="WEATHER_EVENT">Weather Event</option>
                <option value="OTHER">Other</option>
              </select>

              <select
                name="scope"
                defaultValue={eventScope}
                className={filterClassName}>
                <option value="">All scopes</option>
                <option value="COUNTRY">Country</option>
                <option value="AUTHORITY">Authority</option>
                <option value="ORGANIZATION">Organization</option>
                <option value="SCHOOL">School</option>
              </select>

              <Button type="submit" variant="outline">
                Apply Filters
              </Button>
            </form>
          </div>
        }>
        {events.length === 0 ? (
          <AdminEmptyState
            icon={Sparkles}
            title="No calendar events found"
            description="Add a calendar event or adjust the current filters."
          />
        ) : (
          <table className="w-full min-w-[1350px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeading>Event</TableHeading>
                <TableHeading>Country</TableHeading>
                <TableHeading>Academic year</TableHeading>
                <TableHeading>Scope</TableHeading>
                <TableHeading>Date range</TableHeading>
                <TableHeading>Instruction</TableHeading>
                <TableHeading>Impacts</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading className="text-right">Actions</TableHeading>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {events.map((event) => (
                <tr key={event.id} className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <CalendarDays className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-black text-[#071d4e]">
                          {event.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatLabel(event.eventType)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {event.country.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {event.country.iso2Code}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {event.academicYear.name}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <Badge variant="secondary">
                      {formatLabel(event.scope)}
                    </Badge>

                    <p className="mt-2 text-xs text-slate-500">
                      {getScopeName(event)}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">
                      {formatDate(event.startDate)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      through {formatDate(event.endDate)}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <Badge
                      className={
                        event.isInstructional
                          ? "bg-emerald-600 text-white hover:bg-emerald-600"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                      }>
                      {event.isInstructional
                        ? "Instructional"
                        : "Non-instructional"}
                    </Badge>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex max-w-64 flex-wrap gap-2">
                      {event.affectsPacing && (
                        <Badge variant="outline">Pacing</Badge>
                      )}

                      {event.affectsForecast && (
                        <Badge variant="outline">Forecast</Badge>
                      )}

                      {event.affectsLessonPlanning && (
                        <Badge variant="outline">Lessons</Badge>
                      )}

                      {event.affectsAssessments && (
                        <Badge variant="outline">Assessments</Badge>
                      )}

                      {event.affectsAttendance && (
                        <Badge variant="outline">Attendance</Badge>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <AdminStatusBadge status={event.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    <CalendarEventActions
                      eventId={event.id}
                      status={event.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminTableShell>
    </div>
  );
}

const filterClassName =
  "h-12 min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function TableHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-6 py-4 text-left text-xs font-black uppercase tracking-[0.14em] text-slate-500 ${className}`}>
      {children}
    </th>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-BS", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getScopeName(event: {
  scope: string;
  authority: { name: string } | null;
  organization: { name: string } | null;
  school: { name: string } | null;
}) {
  if (event.scope === "AUTHORITY") {
    return event.authority?.name || "Authority";
  }

  if (event.scope === "ORGANIZATION") {
    return event.organization?.name || "Organization";
  }

  if (event.scope === "SCHOOL") {
    return event.school?.name || "School";
  }

  return "Countrywide";
}
