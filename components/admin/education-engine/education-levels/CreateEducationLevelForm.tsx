"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { createEducationLevel } from "@/app/admin/(portal)/education-engine/education-levels/actions";
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
import { Textarea } from "@/components/ui/textarea";
import type { EducationLevelActionState } from "@/lib/types/education-level-action-state";

type CountryOption = {
  id: string;
  name: string;
};

type CreateEducationLevelFormProps = {
  countries: CountryOption[];
};

const levelDefaults = {
  PRESCHOOL: {
    name: "Preschool",
    slug: "preschool",
    sequence: "1",
  },
  PRIMARY: {
    name: "Primary",
    slug: "primary",
    sequence: "2",
  },
  HIGH_SCHOOL: {
    name: "High School",
    slug: "high-school",
    sequence: "3",
  },
} as const;

type EducationLevelCode = keyof typeof levelDefaults;

const initialState: EducationLevelActionState = {
  success: false,
  message: "",
};

export default function CreateEducationLevelForm({
  countries,
}: CreateEducationLevelFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<EducationLevelCode | null>(
    null,
  );
  const [state, setState] = useState<EducationLevelActionState>(initialState);
  const [pending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  const defaults = selectedCode ? levelDefaults[selectedCode] : null;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      formRef.current?.reset();
      setSelectedCode(null);
      setState(initialState);
    }
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createEducationLevel(initialState, formData);

      setState(result);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      formRef.current?.reset();
      setSelectedCode(null);
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
          Add Education Level
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add an education level</DialogTitle>

          <DialogDescription>
            Add a country-specific stage such as Preschool, Primary, or High
            School.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleSubmit} className="mt-4 space-y-5">
          <FormField
            label="Country"
            error={state.errors?.countryId?.[0]}
            required>
            <Select name="countryId" required>
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
            label="Level code"
            error={state.errors?.code?.[0]}
            required>
            <Select
              name="code"
              value={selectedCode ?? undefined}
              onValueChange={(value) => {
                setSelectedCode(value as EducationLevelCode);
                setState(initialState);
              }}
              required>
              <SelectTrigger className="h-12 w-full">
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="PRESCHOOL">Preschool</SelectItem>

                <SelectItem value="PRIMARY">Primary</SelectItem>

                <SelectItem value="HIGH_SCHOOL">High School</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Display name"
              error={state.errors?.name?.[0]}
              required>
              <Input
                key={`name-${selectedCode ?? "empty"}`}
                name="name"
                defaultValue={defaults?.name ?? ""}
                placeholder="Primary"
                className="h-12"
                required
              />
            </FormField>

            <FormField label="Slug" error={state.errors?.slug?.[0]} required>
              <Input
                key={`slug-${selectedCode ?? "empty"}`}
                name="slug"
                defaultValue={defaults?.slug ?? ""}
                placeholder="primary"
                className="h-12"
                required
              />
            </FormField>

            <FormField
              label="Display sequence"
              error={state.errors?.sequence?.[0]}
              required>
              <Input
                key={`sequence-${selectedCode ?? "empty"}`}
                name="sequence"
                type="number"
                min={1}
                defaultValue={defaults?.sequence ?? ""}
                placeholder="1"
                className="h-12"
                required
              />
            </FormField>
          </div>

          <FormField label="Description" error={state.errors?.description?.[0]}>
            <Textarea
              name="description"
              placeholder="Describe this education level..."
              rows={4}
            />
          </FormField>

          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-700 hover:bg-blue-800">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {pending ? "Creating..." : "Create Education Level"}
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
