"use client";

import {
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { CalendarPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createCalendarEvent } from "@/app/admin/(portal)/education-engine/academic-calendar/events/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarEventActionState } from "@/lib/types/calendar-event-action";

type CountryOption = {
  id: string;
  name: string;
};

type AcademicYearOption = {
  id: string;
  countryId: string;
  name: string;
  startDate: string;
  endDate: string;
};

type AuthorityOption = {
  id: string;
  countryId: string;
  name: string;
};

type OrganizationOption = {
  id: string;
  countryId: string;
  name: string;
};

type SchoolOption = {
  id: string;
  countryId: string;
  name: string;
};

type CreateCalendarEventFormProps = {
  countries: CountryOption[];
  academicYears: AcademicYearOption[];
  authorities: AuthorityOption[];
  organizations: OrganizationOption[];
  schools: SchoolOption[];
};

type Scope = "COUNTRY" | "AUTHORITY" | "ORGANIZATION" | "SCHOOL";

const initialState: CalendarEventActionState = {
  success: false,
  message: "",
};

export default function CreateCalendarEventForm({
  countries,
  academicYears,
  authorities,
  organizations,
  schools,
}: CreateCalendarEventFormProps) {
  const [open, setOpen] = useState(false);
  const [countryId, setCountryId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [scope, setScope] = useState<Scope>("COUNTRY");
  const [state, setState] = useState<CalendarEventActionState>(initialState);
  const [pending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  const filteredAcademicYears = useMemo(
    () =>
      academicYears.filter(
        (academicYear) => academicYear.countryId === countryId,
      ),
    [academicYears, countryId],
  );

  const filteredAuthorities = useMemo(
    () => authorities.filter((authority) => authority.countryId === countryId),
    [authorities, countryId],
  );

  const filteredOrganizations = useMemo(
    () =>
      organizations.filter(
        (organization) => organization.countryId === countryId,
      ),
    [organizations, countryId],
  );

  const filteredSchools = useMemo(
    () => schools.filter((school) => school.countryId === countryId),
    [schools, countryId],
  );

  const selectedYear = academicYears.find(
    (academicYear) => academicYear.id === academicYearId,
  );

  function resetForm() {
    formRef.current?.reset();
    setCountryId("");
    setAcademicYearId("");
    setScope("COUNTRY");
    setState(initialState);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createCalendarEvent(initialState, formData);

      setState(result);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      resetForm();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-blue-700 hover:bg-blue-800">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add Calendar Event
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add a calendar event</DialogTitle>

          <DialogDescription>
            Add holidays, breaks, closures, examinations, cultural events,
            professional days, or other calendar events.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleSubmit} className="mt-4 space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Country"
              error={state.errors?.countryId?.[0]}
              required>
              <Select
                name="countryId"
                value={countryId || undefined}
                onValueChange={(value) => {
                  setCountryId(value);
                  setAcademicYearId("");
                  setState(initialState);
                }}>
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>

                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              label="Academic year"
              error={state.errors?.academicYearId?.[0]}
              required>
              <Select
                name="academicYearId"
                value={academicYearId || undefined}
                onValueChange={(value) => {
                  setAcademicYearId(value);
                  setState(initialState);
                }}
                disabled={!countryId}>
                <SelectTrigger className="h-12 w-full">
                  <SelectValue
                    placeholder={
                      countryId
                        ? "Select academic year"
                        : "Select country first"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {filteredAcademicYears.map((academicYear) => (
                    <SelectItem key={academicYear.id} value={academicYear.id}>
                      {academicYear.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          {selectedYear && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                Academic year boundaries
              </p>

              <p className="mt-2 text-sm font-black text-blue-950">
                {formatDate(selectedYear.startDate)} –{" "}
                {formatDate(selectedYear.endDate)}
              </p>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Event title"
              error={state.errors?.title?.[0]}
              required>
              <Input
                name="title"
                placeholder="National Heroes Day"
                className="h-12"
                required
              />
            </FormField>

            <FormField
              label="Event type"
              error={state.errors?.eventType?.[0]}
              required>
              <Select name="eventType" defaultValue="PUBLIC_HOLIDAY">
                <SelectTrigger className="h-12 w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {eventTypes.map((eventType) => (
                    <SelectItem key={eventType.value} value={eventType.value}>
                      {eventType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField label="Description" error={state.errors?.description?.[0]}>
            <Textarea
              name="description"
              rows={3}
              placeholder="Add details about this event..."
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Scope" error={state.errors?.scope?.[0]} required>
              <Select
                name="scope"
                value={scope}
                onValueChange={(value) => {
                  setScope(value as Scope);
                  setState(initialState);
                }}>
                <SelectTrigger className="h-12 w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="COUNTRY">Entire country</SelectItem>

                  <SelectItem value="AUTHORITY">Education authority</SelectItem>

                  <SelectItem value="ORGANIZATION">Organization</SelectItem>

                  <SelectItem value="SCHOOL">Individual school</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            {scope === "AUTHORITY" && (
              <FormField
                label="Education authority"
                error={state.errors?.authorityId?.[0]}
                required>
                <Select name="authorityId">
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Select authority" />
                  </SelectTrigger>

                  <SelectContent>
                    {filteredAuthorities.map((authority) => (
                      <SelectItem key={authority.id} value={authority.id}>
                        {authority.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )}

            {scope === "ORGANIZATION" && (
              <FormField
                label="Organization"
                error={state.errors?.organizationId?.[0]}
                required>
                <Select name="organizationId">
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>

                  <SelectContent>
                    {filteredOrganizations.map((organization) => (
                      <SelectItem key={organization.id} value={organization.id}>
                        {organization.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )}

            {scope === "SCHOOL" && (
              <FormField
                label="School"
                error={state.errors?.schoolId?.[0]}
                required>
                <Select name="schoolId">
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>

                  <SelectContent>
                    {filteredSchools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Start date"
              error={state.errors?.startDate?.[0]}
              required>
              <Input
                name="startDate"
                type="date"
                min={selectedYear?.startDate}
                max={selectedYear?.endDate}
                className="h-12"
                required
              />
            </FormField>

            <FormField
              label="End date"
              error={state.errors?.endDate?.[0]}
              required>
              <Input
                name="endDate"
                type="date"
                min={selectedYear?.startDate}
                max={selectedYear?.endDate}
                className="h-12"
                required
              />
            </FormField>
          </div>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-black text-[#071d4e]">Event behavior</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <CheckboxOption
                name="allDay"
                label="All-day event"
                defaultChecked
              />

              <CheckboxOption
                name="isInstructional"
                label="Instructional day"
              />

              <CheckboxOption
                name="affectsPacing"
                label="Affects pacing"
                defaultChecked
              />

              <CheckboxOption
                name="affectsForecast"
                label="Affects forecast"
                defaultChecked
              />

              <CheckboxOption
                name="affectsAttendance"
                label="Affects attendance"
              />

              <CheckboxOption
                name="affectsAssessments"
                label="Affects assessments"
              />

              <CheckboxOption
                name="affectsLessonPlanning"
                label="Affects lesson planning"
                defaultChecked
              />
            </div>
          </section>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Display color">
              <Input name="color" placeholder="#2563eb" className="h-12" />
            </FormField>

            <FormField label="Notes" error={state.errors?.notes?.[0]}>
              <Input
                name="notes"
                placeholder="Internal notes..."
                className="h-12"
              />
            </FormField>
          </div>

          <Button
            type="submit"
            disabled={pending || !academicYearId}
            className="w-full bg-blue-700 hover:bg-blue-800">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {pending ? "Creating..." : "Create Calendar Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </Label>

      {children}

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

function CheckboxOption({
  name,
  label,
  defaultChecked = false,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <Checkbox name={name} defaultChecked={defaultChecked} />

      <span className="text-sm font-bold text-slate-700">{label}</span>
    </label>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BS", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

const eventTypes = [
  { value: "PUBLIC_HOLIDAY", label: "Public Holiday" },
  { value: "SCHOOL_HOLIDAY", label: "School Holiday" },
  { value: "SCHOOL_BREAK", label: "School Break" },
  {
    value: "PROFESSIONAL_DEVELOPMENT",
    label: "Professional Development",
  },
  { value: "TEACHER_WORKDAY", label: "Teacher Workday" },
  { value: "EXAM_PERIOD", label: "Exam Period" },
  {
    value: "NATIONAL_ASSESSMENT",
    label: "National Assessment",
  },
  { value: "PARENT_CONFERENCE", label: "Parent Conference" },
  { value: "ORIENTATION", label: "Orientation" },
  { value: "SPORTS_DAY", label: "Sports Day" },
  { value: "CULTURAL_EVENT", label: "Cultural Event" },
  { value: "GRADUATION", label: "Graduation" },
  { value: "MINISTRY_EVENT", label: "Ministry Event" },
  { value: "SCHOOL_CLOSURE", label: "School Closure" },
  {
    value: "EMERGENCY_CLOSURE",
    label: "Emergency Closure",
  },
  { value: "WEATHER_EVENT", label: "Weather Event" },
  { value: "OTHER", label: "Other" },
] as const;
