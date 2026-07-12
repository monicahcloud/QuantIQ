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

import { createAdministrativeDivision } from "@/app/admin/(portal)/education-engine/administrative-divisions/actions";
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
import type { AdministrativeDivisionActionState } from "@/lib/types/administrative-division-action-state";

type CountryOption = {
  id: string;
  name: string;
};

type DivisionOption = {
  id: string;
  countryId: string;
  name: string;
  type: string;
};

type CreateAdministrativeDivisionFormProps = {
  countries: CountryOption[];
  divisions: DivisionOption[];
};

const initialState: AdministrativeDivisionActionState = {
  success: false,
  message: "",
};

export default function CreateAdministrativeDivisionForm({
  countries,
  divisions,
}: CreateAdministrativeDivisionFormProps) {
  const [open, setOpen] = useState(false);
  const [countryId, setCountryId] = useState("");
  const [state, setState] =
    useState<AdministrativeDivisionActionState>(initialState);
  const [pending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  const parentOptions = useMemo(
    () => divisions.filter((division) => division.countryId === countryId),
    [countryId, divisions],
  );

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
      const result = await createAdministrativeDivision(initialState, formData);

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
          Add Division
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add an administrative division</DialogTitle>

          <DialogDescription>
            Create an island, state, province, parish, region, county,
            territory, or other geographic division.
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
            </FormField>

            <FormField
              label="Division type"
              error={state.errors?.type?.[0]}
              required>
              <Select name="type" defaultValue="ISLAND">
                <SelectTrigger className="h-12 w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {divisionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              label="Division name"
              error={state.errors?.name?.[0]}
              required>
              <Input
                name="name"
                placeholder="New Providence"
                className="h-12"
                required
              />
            </FormField>

            <FormField label="Code" error={state.errors?.code?.[0]}>
              <Input name="code" placeholder="NP" className="h-12 uppercase" />
            </FormField>

            <FormField label="Slug" error={state.errors?.slug?.[0]} required>
              <Input
                name="slug"
                placeholder="new-providence"
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
            label="Parent division"
            error={state.errors?.parentDivisionId?.[0]}>
            <Select name="parentDivisionId" disabled={!countryId}>
              <SelectTrigger className="h-12 w-full">
                <SelectValue
                  placeholder={
                    countryId ? "No parent division" : "Select country first"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {parentOptions.map((division) => (
                  <SelectItem key={division.id} value={division.id}>
                    {division.name} · {formatLabel(division.type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Description" error={state.errors?.description?.[0]}>
            <Textarea
              name="description"
              rows={4}
              placeholder="Describe this administrative division..."
            />
          </FormField>

          <Button
            type="submit"
            disabled={pending || !countryId}
            className="w-full bg-blue-700 hover:bg-blue-800">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {pending ? "Creating..." : "Create Administrative Division"}
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

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

const divisionTypes = [
  { value: "ISLAND", label: "Island" },
  { value: "STATE", label: "State" },
  { value: "PROVINCE", label: "Province" },
  { value: "PARISH", label: "Parish" },
  { value: "REGION", label: "Region" },
  { value: "COUNTY", label: "County" },
  { value: "TERRITORY", label: "Territory" },
  { value: "DISTRICT", label: "District" },
  { value: "DEPARTMENT", label: "Department" },
  { value: "MUNICIPALITY", label: "Municipality" },
  { value: "OTHER", label: "Other" },
] as const;
