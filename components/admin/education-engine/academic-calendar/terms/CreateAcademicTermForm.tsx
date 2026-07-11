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

import { createAcademicTerm } from "@/app/admin/(portal)/education-engine/academic-calendar/terms/actions";
import { Button } from "@/components/ui/button";
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
import type { AcademicTermActionState } from "@/lib/types/academic-term-action-state";

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

type CreateAcademicTermFormProps = {
  countries: CountryOption[];
  academicYears: AcademicYearOption[];
};

const initialState: AcademicTermActionState = {
  success: false,
  message: "",
};

const termDefaults = {
  CHRISTMAS: {
    name: "Christmas Term",
    code: "CHRISTMAS_TERM",
    type: "TERM",
    sequence: "1",
  },
  EASTER: {
    name: "Easter Term",
    code: "EASTER_TERM",
    type: "TERM",
    sequence: "2",
  },
  SUMMER: {
    name: "Summer Term",
    code: "SUMMER_TERM",
    type: "TERM",
    sequence: "3",
  },
} as const;

type TermPreset = keyof typeof termDefaults;

export default function CreateAcademicTermForm({
  countries,
  academicYears,
}: CreateAcademicTermFormProps) {
  const [open, setOpen] = useState(false);
  const [countryId, setCountryId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [preset, setPreset] = useState<TermPreset | "CUSTOM">("CUSTOM");
  const [state, setState] = useState<AcademicTermActionState>(initialState);
  const [pending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  const filteredAcademicYears = useMemo(
    () =>
      academicYears.filter(
        (academicYear) => academicYear.countryId === countryId,
      ),
    [academicYears, countryId],
  );

  const selectedAcademicYear = academicYears.find(
    (academicYear) => academicYear.id === academicYearId,
  );

  const defaults = preset === "CUSTOM" ? null : termDefaults[preset];

  function resetForm() {
    formRef.current?.reset();
    setCountryId("");
    setAcademicYearId("");
    setPreset("CUSTOM");
    setState(initialState);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  }

  function handleCountryChange(value: string) {
    setCountryId(value);
    setAcademicYearId("");
    setState(initialState);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createAcademicTerm(initialState, formData);

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
          disabled={countries.length === 0}
          className="rounded-xl bg-blue-700 hover:bg-blue-800">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add Term
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add an academic term</DialogTitle>

          <DialogDescription>
            Add a term, semester, quarter, or trimester within an academic year.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleSubmit} className="mt-4 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Country" required>
              <Select
                value={countryId || undefined}
                onValueChange={handleCountryChange}>
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

          {selectedAcademicYear && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                Academic year boundaries
              </p>

              <p className="mt-2 text-sm font-bold text-blue-950">
                {formatDate(selectedAcademicYear.startDate)} –{" "}
                {formatDate(selectedAcademicYear.endDate)}
              </p>
            </div>
          )}

          <FormField label="Term preset">
            <Select
              value={preset}
              onValueChange={(value) => {
                setPreset(value as TermPreset | "CUSTOM");
                setState(initialState);
              }}>
              <SelectTrigger className="h-12 w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="CUSTOM">Custom period</SelectItem>
                <SelectItem value="CHRISTMAS">Christmas Term</SelectItem>
                <SelectItem value="EASTER">Easter Term</SelectItem>
                <SelectItem value="SUMMER">Summer Term</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Period name"
              error={state.errors?.name?.[0]}
              required>
              <Input
                key={`name-${preset}`}
                name="name"
                defaultValue={defaults?.name ?? ""}
                placeholder="Christmas Term"
                className="h-12"
                required
              />
            </FormField>

            <FormField
              label="Period code"
              error={state.errors?.code?.[0]}
              required>
              <Input
                key={`code-${preset}`}
                name="code"
                defaultValue={defaults?.code ?? ""}
                placeholder="CHRISTMAS_TERM"
                className="h-12 uppercase"
                required
              />
            </FormField>

            <FormField
              label="Period type"
              error={state.errors?.type?.[0]}
              required>
              <Select
                key={`type-${preset}`}
                name="type"
                defaultValue={defaults?.type ?? "TERM"}>
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

            <FormField
              label="Display sequence"
              error={state.errors?.sequence?.[0]}
              required>
              <Input
                key={`sequence-${preset}`}
                name="sequence"
                type="number"
                min={1}
                defaultValue={defaults?.sequence ?? ""}
                placeholder="1"
                className="h-12"
                required
              />
            </FormField>

            <FormField
              label="Start date"
              error={state.errors?.startDate?.[0]}
              required>
              <Input
                name="startDate"
                type="date"
                min={selectedAcademicYear?.startDate}
                max={selectedAcademicYear?.endDate}
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
                min={selectedAcademicYear?.startDate}
                max={selectedAcademicYear?.endDate}
                className="h-12"
                required
              />
            </FormField>
          </div>

          <Button
            type="submit"
            disabled={pending || !academicYearId}
            className="w-full bg-blue-700 hover:bg-blue-800">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {pending ? "Creating..." : "Create Academic Term"}
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BS", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}
