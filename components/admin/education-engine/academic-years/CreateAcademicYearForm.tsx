"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import { CalendarPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import type { AcademicYearActionState } from "@/lib/types/academic-year-action-state";
import { createAcademicYear } from "@/app/admin/(portal)/education-engine/academic-years/action";

type CountryOption = {
  id: string;
  name: string;
};

type CreateAcademicYearFormProps = {
  countries: CountryOption[];
};

const initialState: AcademicYearActionState = {
  success: false,
  message: "",
};

export default function CreateAcademicYearForm({
  countries,
}: CreateAcademicYearFormProps) {
  const [open, setOpen] = useState(false);
  const [countryId, setCountryId] = useState("");
  const [state, setState] = useState<AcademicYearActionState>(initialState);
  const [pending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  function resetForm() {
    formRef.current?.reset();
    setCountryId("");
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
      const result = await createAcademicYear(initialState, formData);

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
          Add Academic Year
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add an academic year</DialogTitle>

          <DialogDescription>
            Create a country-specific school year and define its date range.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleSubmit} className="mt-4 space-y-5">
          <FormField
            label="Country"
            error={state.errors?.countryId?.[0]}
            required>
            <Select
              name="countryId"
              value={countryId || undefined}
              onValueChange={(value) => {
                setCountryId(value);
                setState(initialState);
              }}
              required>
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

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Academic year name"
              error={state.errors?.name?.[0]}
              required>
              <Input
                name="name"
                placeholder="2026-2027"
                className="h-12"
                required
              />
            </FormField>

            <FormField label="Slug" error={state.errors?.slug?.[0]} required>
              <Input
                name="slug"
                placeholder="2026-2027"
                className="h-12"
                required
              />
            </FormField>

            <FormField
              label="Start date"
              error={state.errors?.startDate?.[0]}
              required>
              <Input name="startDate" type="date" className="h-12" required />
            </FormField>

            <FormField
              label="End date"
              error={state.errors?.endDate?.[0]}
              required>
              <Input name="endDate" type="date" className="h-12" required />
            </FormField>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Checkbox name="isCurrent" className="mt-0.5" />

            <div>
              <p className="text-sm font-black text-slate-800">
                Set as current academic year
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Any other current academic year for this country will be
                automatically unset.
              </p>
            </div>
          </label>

          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-700 hover:bg-blue-800">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {pending ? "Creating..." : "Create Academic Year"}
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
