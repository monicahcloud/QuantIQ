"use client";

import {
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { CalendarCog, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { generateAcademicWeeks } from "@/app/admin/(portal)/education-engine/academic-calendar/weeks/actions";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AcademicWeekActionState } from "@/lib/types/academic-week-action-state";

type CountryOption = {
  id: string;
  name: string;
};

type AcademicYearOption = {
  id: string;
  countryId: string;
  countryName: string;
  name: string;
  startDate: string;
  endDate: string;
  termCount: number;
  weekCount: number;
};

type GenerateAcademicWeeksFormProps = {
  countries: CountryOption[];
  academicYears: AcademicYearOption[];
};

const initialState: AcademicWeekActionState = {
  success: false,
  message: "",
};

export default function GenerateAcademicWeeksForm({
  countries,
  academicYears,
}: GenerateAcademicWeeksFormProps) {
  const [open, setOpen] = useState(false);
  const [countryId, setCountryId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [state, setState] = useState<AcademicWeekActionState>(initialState);
  const [pending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  const filteredYears = useMemo(
    () =>
      academicYears.filter(
        (academicYear) => academicYear.countryId === countryId,
      ),
    [academicYears, countryId],
  );

  const selectedYear = academicYears.find(
    (academicYear) => academicYear.id === academicYearId,
  );

  function resetForm() {
    formRef.current?.reset();
    setCountryId("");
    setAcademicYearId("");
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
      const result = await generateAcademicWeeks(initialState, formData);

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
        <Button
          disabled={academicYears.length === 0}
          className="rounded-xl bg-blue-700 hover:bg-blue-800">
          <CalendarCog className="mr-2 h-4 w-4" />
          Generate Weeks
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate academic weeks</DialogTitle>

          <DialogDescription>
            Create calendar weeks automatically and assign them to their
            matching academic terms.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleSubmit} className="mt-4 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Country" required>
              <Select
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
                  {filteredYears.map((academicYear) => (
                    <SelectItem key={academicYear.id} value={academicYear.id}>
                      {academicYear.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          {selectedYear && (
            <div className="grid gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:grid-cols-3">
              <SummaryItem
                label="Date range"
                value={`${formatDate(selectedYear.startDate)} – ${formatDate(
                  selectedYear.endDate,
                )}`}
              />

              <SummaryItem
                label="Active terms"
                value={String(selectedYear.termCount)}
              />

              <SummaryItem
                label="Existing weeks"
                value={String(selectedYear.weekCount)}
              />
            </div>
          )}

          <FormField
            label="Week begins on"
            error={state.errors?.weekStartsOn?.[0]}
            required>
            <Select name="weekStartsOn" defaultValue="MONDAY">
              <SelectTrigger className="h-12 w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="MONDAY">Monday</SelectItem>

                <SelectItem value="SUNDAY">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          {selectedYear && selectedYear.termCount === 0 && (
            <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
              <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="text-sm font-black">Terms are required</p>

                <p className="mt-1 text-xs leading-5">
                  Create at least one academic term before generating weeks.
                </p>
              </div>
            </div>
          )}

          {selectedYear && selectedYear.weekCount > 0 && (
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <Checkbox name="replaceExisting" className="mt-0.5" />

              <div>
                <p className="text-sm font-black text-red-900">
                  Replace existing weeks
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  This removes all existing week records for this academic year
                  and creates a new set.
                </p>

                {state.errors?.replaceExisting?.[0] && (
                  <p className="mt-2 text-xs font-bold text-red-700">
                    {state.errors.replaceExisting[0]}
                  </p>
                )}
              </div>
            </label>
          )}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-black text-slate-800">
              How generation works
            </p>

            <p className="mt-2 text-xs leading-6 text-slate-600">
              QuantIQ creates one calendar week at a time across the academic
              year. Weeks overlapping an active term are assigned to that term
              and marked instructional. Weeks between terms are marked
              non-instructional.
            </p>
          </div>

          <Button
            type="submit"
            disabled={pending || !selectedYear || selectedYear.termCount === 0}
            className="w-full bg-blue-700 hover:bg-blue-800">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {pending ? "Generating..." : "Generate Academic Weeks"}
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

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.13em] text-blue-600">
        {label}
      </p>

      <p className="mt-2 text-sm font-black text-blue-950">{value}</p>
    </div>
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
