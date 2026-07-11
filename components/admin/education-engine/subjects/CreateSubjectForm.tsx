"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { createSubject } from "@/app/admin/(portal)/education-engine/subjects/actions";
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
import type { SubjectActionState } from "@/lib/types/subject-action-state";

type CountryOption = {
  id: string;
  name: string;
};

type CreateSubjectFormProps = {
  countries: CountryOption[];
};

const initialState: SubjectActionState = {
  success: false,
  message: "",
};

export default function CreateSubjectForm({
  countries,
}: CreateSubjectFormProps) {
  const [open, setOpen] = useState(false);
  const [countryId, setCountryId] = useState("");
  const [state, setState] = useState<SubjectActionState>(initialState);
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
      const result = await createSubject(initialState, formData);

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
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add a subject</DialogTitle>

          <DialogDescription>
            Create a country-level subject that can later be assigned to one or
            more grades.
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
              label="Subject name"
              error={state.errors?.name?.[0]}
              required>
              <Input
                name="name"
                placeholder="Mathematics"
                className="h-12"
                required
              />
            </FormField>

            <FormField
              label="Subject code"
              error={state.errors?.code?.[0]}
              required>
              <Input
                name="code"
                placeholder="MATHEMATICS"
                className="h-12 uppercase"
                required
              />
            </FormField>

            <FormField label="Slug" error={state.errors?.slug?.[0]} required>
              <Input
                name="slug"
                placeholder="mathematics"
                className="h-12"
                required
              />
            </FormField>

            <FormField
              label="Display sequence"
              error={state.errors?.sequence?.[0]}
              required>
              <Input
                name="sequence"
                type="number"
                min={1}
                placeholder="1"
                className="h-12"
                required
              />
            </FormField>
          </div>

          <FormField label="Description" error={state.errors?.description?.[0]}>
            <Textarea
              name="description"
              placeholder="Describe the subject and its instructional focus..."
              rows={4}
            />
          </FormField>

          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-700 hover:bg-blue-800">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {pending ? "Creating..." : "Create Subject"}
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
