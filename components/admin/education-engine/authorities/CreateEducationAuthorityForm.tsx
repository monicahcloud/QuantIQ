"use client";

import {
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { Building2, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
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
import type { EducationAuthorityActionState } from "@/lib/types/education-authority-action-state";
import { createEducationAuthority } from "@/app/admin/(portal)/education-engine/authorities/actions";

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

type LocalityOption = {
  id: string;
  countryId: string;
  administrativeDivisionId: string;
  name: string;
  type: string;
};

type CreateEducationAuthorityFormProps = {
  countries: CountryOption[];
  divisions: DivisionOption[];
  localities: LocalityOption[];
};

const initialState: EducationAuthorityActionState = {
  success: false,
  message: "",
};

export default function CreateEducationAuthorityForm({
  countries,
  divisions,
  localities,
}: CreateEducationAuthorityFormProps) {
  const [open, setOpen] = useState(false);

  const [countryId, setCountryId] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [localityId, setLocalityId] = useState("");

  const [state, setState] =
    useState<EducationAuthorityActionState>(initialState);

  const [pending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  const filteredDivisions = useMemo(
    () => divisions.filter((division) => division.countryId === countryId),
    [countryId, divisions],
  );

  const filteredLocalities = useMemo(
    () =>
      localities.filter(
        (locality) =>
          locality.countryId === countryId &&
          (!divisionId || locality.administrativeDivisionId === divisionId),
      ),
    [countryId, divisionId, localities],
  );

  function resetForm() {
    formRef.current?.reset();
    setCountryId("");
    setDivisionId("");
    setLocalityId("");
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
    setDivisionId("");
    setLocalityId("");
    setState(initialState);
  }

  function handleDivisionChange(value: string) {
    setDivisionId(value);
    setLocalityId("");
    setState(initialState);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createEducationAuthority(initialState, formData);

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
          Add Authority
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-700" />
            Add an education authority
          </DialogTitle>

          <DialogDescription>
            Add a ministry, department, board, district, region, or other
            education-governance authority.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleSubmit} className="mt-4 space-y-6">
          <section className="space-y-5">
            <SectionHeading
              title="Geographic assignment"
              description="Country is required. Division and locality are optional for national-level authorities."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Country"
                error={state.errors?.countryId?.[0]}
                required>
                <Select
                  name="countryId"
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
                label="Administrative division"
                error={state.errors?.administrativeDivisionId?.[0]}>
                <Select
                  name="administrativeDivisionId"
                  value={divisionId || undefined}
                  onValueChange={handleDivisionChange}
                  disabled={!countryId}>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue
                      placeholder={
                        countryId
                          ? "National / all divisions"
                          : "Select country first"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {filteredDivisions.map((division) => (
                      <SelectItem key={division.id} value={division.id}>
                        {division.name} · {formatLabel(division.type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Locality" error={state.errors?.localityId?.[0]}>
                <Select
                  name="localityId"
                  value={localityId || undefined}
                  onValueChange={(value) => {
                    setLocalityId(value);
                    setState(initialState);
                  }}
                  disabled={!countryId}>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue
                      placeholder={
                        countryId
                          ? "No specific locality"
                          : "Select country first"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {filteredLocalities.map((locality) => (
                      <SelectItem key={locality.id} value={locality.id}>
                        {locality.name} · {formatLabel(locality.type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </section>

          <section className="space-y-5 border-t border-slate-200 pt-6">
            <SectionHeading
              title="Authority information"
              description="Define the authority name, classification, and URL-friendly identifier."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Authority name"
                error={state.errors?.name?.[0]}
                required>
                <Input
                  name="name"
                  placeholder="Ministry of Education"
                  className="h-12"
                  required
                />
              </FormField>

              <FormField
                label="Authority type"
                error={state.errors?.type?.[0]}
                required>
                <Select name="type" defaultValue="MINISTRY">
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {authorityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Slug" error={state.errors?.slug?.[0]} required>
                <Input
                  name="slug"
                  placeholder="ministry-of-education"
                  className="h-12"
                  required
                />
              </FormField>
            </div>

            <FormField
              label="Description"
              error={state.errors?.description?.[0]}>
              <Textarea
                name="description"
                rows={4}
                placeholder="Describe this authority's role and jurisdiction..."
              />
            </FormField>
          </section>

          <section className="space-y-5 border-t border-slate-200 pt-6">
            <SectionHeading
              title="Contact information"
              description="Optional public or administrative contact details."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Website" error={state.errors?.websiteUrl?.[0]}>
                <Input
                  name="websiteUrl"
                  type="url"
                  placeholder="https://www.example.gov"
                  className="h-12"
                />
              </FormField>

              <FormField label="Email" error={state.errors?.email?.[0]}>
                <Input
                  name="email"
                  type="email"
                  placeholder="info@example.gov"
                  className="h-12"
                />
              </FormField>

              <FormField label="Phone" error={state.errors?.phone?.[0]}>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="+1 242 555 0100"
                  className="h-12"
                />
              </FormField>
            </div>
          </section>

          <Button
            type="submit"
            disabled={pending || !countryId}
            className="w-full bg-blue-700 hover:bg-blue-800">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {pending ? "Creating..." : "Create Education Authority"}
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

const authorityTypes = [
  { value: "MINISTRY", label: "Ministry" },
  { value: "DEPARTMENT", label: "Department" },
  { value: "BOARD", label: "Board" },
  { value: "DISTRICT", label: "District" },
  { value: "REGION", label: "Region" },
  { value: "OTHER", label: "Other" },
] as const;
