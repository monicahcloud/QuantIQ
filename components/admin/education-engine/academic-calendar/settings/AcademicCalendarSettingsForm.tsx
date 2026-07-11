"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { CalendarCog, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { saveAcademicCalendarSettings } from "@/app/admin/(portal)/education-engine/academic-calendar/settings/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AcademicCalendarSettingActionState } from "@/lib/types/academic-calendar-settings";

type CountryOption = {
  id: string;
  name: string;
  defaultLocale: string;
  defaultTimeZone: string | null;
};

type CalendarSettingOption = {
  countryId: string;
  weekStartsOn: "MONDAY" | "SUNDAY";
  instructionalDays: number[];
  defaultPeriodType: "TERM" | "SEMESTER" | "QUARTER" | "TRIMESTER" | "OTHER";
  defaultLocale: string;
  defaultTimeZone: string;
  autoAssignWeeksToTerms: boolean;
  outsideTermsNonInstructional: boolean;
};

type AcademicCalendarSettingsFormProps = {
  countries: CountryOption[];
  settings: CalendarSettingOption[];
};

const initialState: AcademicCalendarSettingActionState = {
  success: false,
  message: "",
};

const weekdays = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
] as const;

export default function AcademicCalendarSettingsForm({
  countries,
  settings,
}: AcademicCalendarSettingsFormProps) {
  const [countryId, setCountryId] = useState(
    countries.length === 1 ? countries[0].id : "",
  );

  const [state, setState] =
    useState<AcademicCalendarSettingActionState>(initialState);

  const [pending, startTransition] = useTransition();

  const selectedCountry = useMemo(
    () => countries.find((country) => country.id === countryId),
    [countries, countryId],
  );

  const savedSetting = useMemo(
    () => settings.find((setting) => setting.countryId === countryId),
    [countryId, settings],
  );

  const formKey = `${countryId}-${savedSetting?.weekStartsOn ?? "new"}`;

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveAcademicCalendarSettings(initialState, formData);

      setState(result);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="max-w-xl space-y-2">
          <Label>Country</Label>

          <Select
            value={countryId || undefined}
            onValueChange={(value) => {
              setCountryId(value);
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

          {state.errors?.countryId?.[0] && (
            <p className="text-xs font-medium text-red-600">
              {state.errors.countryId[0]}
            </p>
          )}
        </div>
      </section>

      {!countryId ? (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
          <CalendarCog className="mx-auto h-10 w-10 text-slate-300" />

          <h2 className="mt-4 text-xl font-black text-[#071d4e]">
            Select a country
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Choose a country to configure its academic calendar rules.
          </p>
        </section>
      ) : (
        <form key={formKey} action={handleSubmit} className="space-y-6">
          <input type="hidden" name="countryId" value={countryId} />

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeading
              title="Week configuration"
              description="Control when calendar weeks begin and which weekdays count as instructional days."
            />

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <FormField
                label="Week begins on"
                error={state.errors?.weekStartsOn?.[0]}
                required>
                <Select
                  name="weekStartsOn"
                  defaultValue={savedSetting?.weekStartsOn ?? "MONDAY"}>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="MONDAY">Monday</SelectItem>
                    <SelectItem value="SUNDAY">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Default academic period"
                error={state.errors?.defaultPeriodType?.[0]}
                required>
                <Select
                  name="defaultPeriodType"
                  defaultValue={savedSetting?.defaultPeriodType ?? "TERM"}>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="TERM">Term</SelectItem>
                    <SelectItem value="SEMESTER">Semester</SelectItem>
                    <SelectItem value="QUARTER">Quarter</SelectItem>
                    <SelectItem value="TRIMESTER">Trimester</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <div className="mt-7">
              <Label>
                Instructional days
                <span className="ml-1 text-red-600">*</span>
              </Label>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Select every weekday that normally counts as a teaching day.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {weekdays.map((day) => {
                  const defaultChecked = savedSetting
                    ? savedSetting.instructionalDays.includes(day.value)
                    : day.value >= 1 && day.value <= 5;

                  return (
                    <label
                      key={day.value}
                      className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <Checkbox
                        name="instructionalDays"
                        value={String(day.value)}
                        defaultChecked={defaultChecked}
                      />

                      <span className="text-sm font-bold text-slate-700">
                        {day.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              {state.errors?.instructionalDays?.[0] && (
                <p className="mt-3 text-xs font-medium text-red-600">
                  {state.errors.instructionalDays[0]}
                </p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeading
              title="Localization"
              description="Set the locale and time zone used when displaying and processing calendar dates."
            />

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <FormField
                label="Default locale"
                error={state.errors?.defaultLocale?.[0]}
                required>
                <Input
                  name="defaultLocale"
                  defaultValue={
                    savedSetting?.defaultLocale ??
                    selectedCountry?.defaultLocale ??
                    "en-BS"
                  }
                  placeholder="en-BS"
                  className="h-12"
                  required
                />
              </FormField>

              <FormField
                label="Default time zone"
                error={state.errors?.defaultTimeZone?.[0]}
                required>
                <Input
                  name="defaultTimeZone"
                  defaultValue={
                    savedSetting?.defaultTimeZone ??
                    selectedCountry?.defaultTimeZone ??
                    "America/Nassau"
                  }
                  placeholder="America/Nassau"
                  className="h-12"
                  required
                />
              </FormField>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeading
              title="Automation rules"
              description="Control how QuantIQ assigns and categorizes generated academic weeks."
            />

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <BooleanSetting
                name="autoAssignWeeksToTerms"
                title="Automatically assign weeks to terms"
                description="Generated weeks will be linked to the active term with the strongest date overlap."
                defaultChecked={savedSetting?.autoAssignWeeksToTerms ?? true}
              />

              <BooleanSetting
                name="outsideTermsNonInstructional"
                title="Mark weeks outside terms as non-instructional"
                description="Weeks that do not overlap an active term will be treated as breaks."
                defaultChecked={
                  savedSetting?.outsideTermsNonInstructional ?? true
                }
              />
            </div>
          </section>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={pending}
              className="min-w-52 bg-blue-700 hover:bg-blue-800">
              {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}

              {pending ? "Saving..." : "Save Calendar Settings"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-slate-200 pb-5">
      <h2 className="text-xl font-black text-[#071d4e]">{title}</h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
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

function BooleanSetting({
  name,
  title,
  description,
  defaultChecked,
}: {
  name: string;
  title: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <Checkbox name={name} defaultChecked={defaultChecked} className="mt-1" />

      <div>
        <p className="text-sm font-black text-slate-800">{title}</p>

        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </label>
  );
}
