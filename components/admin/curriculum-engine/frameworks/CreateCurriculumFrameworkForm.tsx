"use client";

import {
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { GitBranch, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { createCurriculumFramework } from "@/app/admin/(portal)/curriculum-engine/frameworks/actions";
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
import type { CurriculumFrameworkActionState } from "@/lib/types/curriculum-framework-action-state";
import { CurriculumVersionStatus } from "@/lib/generated/prisma/client";

type CountryOption = {
  id: string;
  name: string;
};

type CurriculumVersionOption = {
  id: string;
  countryId: string;
  name: string;
  code: string;
  versionLabel: string | null;
  status: CurriculumVersionStatus;
};

type CreateCurriculumFrameworkFormProps = {
  countries: CountryOption[];
  versions: CurriculumVersionOption[];
};

const initialState: CurriculumFrameworkActionState = {
  success: false,
  message: "",
};

export default function CreateCurriculumFrameworkForm({
  countries,
  versions,
}: CreateCurriculumFrameworkFormProps) {
  const [open, setOpen] = useState(false);
  const [countryId, setCountryId] = useState("");
  const [curriculumVersionId, setCurriculumVersionId] = useState("");
  const [state, setState] =
    useState<CurriculumFrameworkActionState>(initialState);
  const [pending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  const filteredVersions = useMemo(
    () => versions.filter((version) => version.countryId === countryId),
    [countryId, versions],
  );

  function resetForm() {
    formRef.current?.reset();
    setCountryId("");
    setCurriculumVersionId("");
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
    setCurriculumVersionId("");
    setState(initialState);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createCurriculumFramework(initialState, formData);

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
          disabled={versions.length === 0}
          className="rounded-xl bg-blue-700 hover:bg-blue-800">
          <Plus className="mr-2 h-4 w-4" />
          Add Framework
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-blue-700" />
            Add a curriculum framework
          </DialogTitle>

          <DialogDescription>
            Organize a curriculum version into instructional structures such as
            Preschool, Primary, Secondary, IGCSE, PYP, or MYP.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleSubmit} className="mt-4 space-y-7">
          <section className="space-y-5">
            <SectionHeading
              title="Curriculum assignment"
              description="Choose the curriculum version this framework belongs to."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Country" required>
                <Select value={countryId} onValueChange={handleCountryChange}>
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
                label="Curriculum version"
                error={state.errors?.curriculumVersionId?.[0]}
                required>
                <Select
                  name="curriculumVersionId"
                  value={curriculumVersionId}
                  onValueChange={(value) => {
                    setCurriculumVersionId(value);
                    setState(initialState);
                  }}
                  disabled={!countryId}>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue
                      placeholder={
                        countryId
                          ? "Select curriculum version"
                          : "Select country first"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {filteredVersions.map((version) => (
                      <SelectItem key={version.id} value={version.id}>
                        {version.name}
                        {version.versionLabel
                          ? ` · ${version.versionLabel}`
                          : ""}
                        {` · ${formatLabel(version.status)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </section>

          <section className="space-y-5 border-t border-slate-200 pt-6">
            <SectionHeading
              title="Framework information"
              description="Add the framework name, code, sequence, and identifier."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Framework name"
                error={state.errors?.name?.[0]}
                required>
                <Input
                  name="name"
                  placeholder="Primary"
                  className="h-12"
                  required
                />
              </FormField>

              <FormField label="Framework code" error={state.errors?.code?.[0]}>
                <Input
                  name="code"
                  placeholder="PRI"
                  className="h-12 uppercase"
                />
              </FormField>

              <FormField label="Slug" error={state.errors?.slug?.[0]} required>
                <Input
                  name="slug"
                  placeholder="primary"
                  className="h-12"
                  required
                />
              </FormField>

              <FormField
                label="Display sequence"
                error={state.errors?.sequence?.[0]}>
                <Input
                  name="sequence"
                  type="number"
                  min={1}
                  placeholder="1"
                  className="h-12"
                />
              </FormField>
            </div>

            <FormField
              label="Description"
              error={state.errors?.description?.[0]}>
              <Textarea
                name="description"
                rows={4}
                placeholder="Describe the education stage, intended grades, or instructional purpose of this framework..."
              />
            </FormField>
          </section>

          <Button
            type="submit"
            disabled={pending || !curriculumVersionId}
            className="w-full bg-blue-700 hover:bg-blue-800">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {pending ? "Creating..." : "Create Curriculum Framework"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
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
    <div>
      <h3 className="text-base font-black text-[#071d4e]">{title}</h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
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

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
