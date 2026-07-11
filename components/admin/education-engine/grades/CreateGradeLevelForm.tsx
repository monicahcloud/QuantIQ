"use client";

import {
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { createGradeLevel } from "@/app/admin/(portal)/education-engine/grades/actions";
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
import type { GradeLevelActionState } from "@/lib/types/grade-level-action-state";

type CountryOption = {
  id: string;
  name: string;
};

type EducationLevelOption = {
  id: string;
  countryId: string;
  name: string;
  code: string;
};

type CreateGradeLevelFormProps = {
  countries: CountryOption[];
  educationLevels: EducationLevelOption[];
};

const initialState: GradeLevelActionState = {
  success: false,
  message: "",
};

export default function CreateGradeLevelForm({
  countries,
  educationLevels,
}: CreateGradeLevelFormProps) {
  const [open, setOpen] = useState(false);
  const [countryId, setCountryId] = useState("");
  const [educationLevelId, setEducationLevelId] = useState("");
  const [state, setState] = useState<GradeLevelActionState>(initialState);
  const [pending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  const filteredEducationLevels = useMemo(
    () =>
      educationLevels.filter(
        (educationLevel) => educationLevel.countryId === countryId,
      ),
    [countryId, educationLevels],
  );

  function handleCountryChange(value: string) {
    setCountryId(value);
    setEducationLevelId("");
    setState(initialState);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      formRef.current?.reset();
      setCountryId("");
      setEducationLevelId("");
      setState(initialState);
    }
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createGradeLevel(initialState, formData);

      setState(result);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      formRef.current?.reset();
      setCountryId("");
      setEducationLevelId("");
      setState(initialState);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="rounded-xl bg-blue-700 hover:bg-blue-800"
          disabled={countries.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Add Grade Level
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add a grade level</DialogTitle>

          <DialogDescription>
            Assign a grade to a country and education level.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleSubmit} className="mt-4 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Country"
              error={state.errors?.countryId?.[0]}
              required>
              <Select
                name="countryId"
                value={countryId || undefined}
                onValueChange={handleCountryChange}
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

            <FormField
              label="Education level"
              error={state.errors?.educationLevelId?.[0]}
              required>
              <Select
                name="educationLevelId"
                value={educationLevelId || undefined}
                onValueChange={(value) => {
                  setEducationLevelId(value);
                  setState(initialState);
                }}
                disabled={!countryId}
                required>
                <SelectTrigger className="h-12 w-full">
                  <SelectValue
                    placeholder={
                      countryId
                        ? "Select education level"
                        : "Select country first"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {filteredEducationLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              label="Grade name"
              error={state.errors?.name?.[0]}
              required>
              <Input
                name="name"
                placeholder="Grade 5"
                className="h-12"
                required
              />
            </FormField>

            <FormField
              label="Grade code"
              error={state.errors?.code?.[0]}
              required>
              <Input
                name="code"
                placeholder="GRADE_5"
                className="h-12 uppercase"
                required
              />
            </FormField>

            <FormField label="Slug" error={state.errors?.slug?.[0]} required>
              <Input
                name="slug"
                placeholder="grade-5"
                className="h-12"
                required
              />
            </FormField>

            <FormField
              label="Numeric grade"
              error={state.errors?.numericGrade?.[0]}>
              <Input
                name="numericGrade"
                type="number"
                min={0}
                max={20}
                placeholder="5"
                className="h-12"
              />
            </FormField>

            <FormField
              label="Display sequence"
              error={state.errors?.sequence?.[0]}
              required>
              <Input
                name="sequence"
                type="number"
                min={0}
                placeholder="5"
                className="h-12"
                required
              />
            </FormField>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-bold text-blue-900">
              Preschool grades can leave Numeric Grade blank.
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-700">
              For Grades 1–12, use the grade number for both Numeric Grade and
              Display Sequence.
            </p>
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-700 hover:bg-blue-800">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {pending ? "Creating..." : "Create Grade Level"}
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
