"use client";

import {
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { Loader2, Plus, School } from "lucide-react";
import { toast } from "sonner";

import { createSchool } from "@/app/admin/(portal)/education-engine/schools/actions";
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
import type { SchoolActionState } from "@/lib/types/school-action-state";

type CountryOption = {
  id: string;
  name: string;
};

type AuthorityOption = {
  id: string;
  countryId: string;
  name: string;
  type: string;
};

type OrganizationOption = {
  id: string;
  countryId: string;
  authorityId: string | null;
  name: string;
  type: string;
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

type CreateSchoolFormProps = {
  countries: CountryOption[];
  authorities: AuthorityOption[];
  organizations: OrganizationOption[];
  divisions: DivisionOption[];
  localities: LocalityOption[];
};

const initialState: SchoolActionState = {
  success: false,
  message: "",
};

export default function CreateSchoolForm({
  countries,
  authorities,
  organizations,
  divisions,
  localities,
}: CreateSchoolFormProps) {
  const [open, setOpen] = useState(false);

  const [countryId, setCountryId] = useState("");
  const [authorityId, setAuthorityId] = useState("NONE");
  const [organizationId, setOrganizationId] = useState("NONE");
  const [divisionId, setDivisionId] = useState("NONE");
  const [localityId, setLocalityId] = useState("NONE");

  const [state, setState] = useState<SchoolActionState>(initialState);

  const [pending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  const filteredAuthorities = useMemo(
    () => authorities.filter((authority) => authority.countryId === countryId),
    [authorities, countryId],
  );

  const filteredOrganizations = useMemo(
    () =>
      organizations.filter(
        (organization) =>
          organization.countryId === countryId &&
          (authorityId === "NONE" ||
            organization.authorityId === authorityId ||
            organization.authorityId === null),
      ),
    [authorityId, countryId, organizations],
  );

  const filteredDivisions = useMemo(
    () => divisions.filter((division) => division.countryId === countryId),
    [countryId, divisions],
  );

  const filteredLocalities = useMemo(
    () =>
      localities.filter(
        (locality) =>
          locality.countryId === countryId &&
          (divisionId === "NONE" ||
            locality.administrativeDivisionId === divisionId),
      ),
    [countryId, divisionId, localities],
  );

  function resetForm() {
    formRef.current?.reset();

    setCountryId("");
    setAuthorityId("NONE");
    setOrganizationId("NONE");
    setDivisionId("NONE");
    setLocalityId("NONE");
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
    setAuthorityId("NONE");
    setOrganizationId("NONE");
    setDivisionId("NONE");
    setLocalityId("NONE");
    setState(initialState);
  }

  function handleAuthorityChange(value: string) {
    setAuthorityId(value);
    setOrganizationId("NONE");
    setState(initialState);
  }

  function handleDivisionChange(value: string) {
    setDivisionId(value);
    setLocalityId("NONE");
    setState(initialState);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createSchool(initialState, formData);

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
          Add School
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <School className="h-5 w-5 text-blue-700" />
            Add a school
          </DialogTitle>

          <DialogDescription>
            Add a school and connect it to its location, authority,
            organization, and contact details.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleSubmit} className="mt-4 space-y-7">
          <section className="space-y-5">
            <SectionHeading
              title="Geographic assignment"
              description="Identify where the school is located."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Country"
                error={state.errors?.countryId?.[0]}
                required>
                <Select
                  name="countryId"
                  value={countryId}
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
                  value={divisionId}
                  onValueChange={handleDivisionChange}
                  disabled={!countryId}>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="NONE">No specific division</SelectItem>

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
                  value={localityId}
                  onValueChange={(value) => {
                    setLocalityId(value);
                    setState(initialState);
                  }}
                  disabled={!countryId}>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="NONE">No specific locality</SelectItem>

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
              title="Governance"
              description="Optionally connect the school to an education authority and organization."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Education authority"
                error={state.errors?.authorityId?.[0]}>
                <Select
                  name="authorityId"
                  value={authorityId}
                  onValueChange={handleAuthorityChange}
                  disabled={!countryId}>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="NONE">No education authority</SelectItem>

                    {filteredAuthorities.map((authority) => (
                      <SelectItem key={authority.id} value={authority.id}>
                        {authority.name} · {formatLabel(authority.type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Organization"
                error={state.errors?.organizationId?.[0]}>
                <Select
                  name="organizationId"
                  value={organizationId}
                  onValueChange={(value) => {
                    setOrganizationId(value);
                    setState(initialState);
                  }}
                  disabled={!countryId}>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="NONE">No organization</SelectItem>

                    {filteredOrganizations.map((organization) => (
                      <SelectItem key={organization.id} value={organization.id}>
                        {organization.name} · {formatLabel(organization.type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </section>

          <section className="space-y-5 border-t border-slate-200 pt-6">
            <SectionHeading
              title="School information"
              description="Add the school name, type, code, and identifier."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="School name"
                error={state.errors?.name?.[0]}
                required>
                <Input
                  name="name"
                  placeholder="Windermere High School"
                  className="h-12"
                  required
                />
              </FormField>

              <FormField
                label="School type"
                error={state.errors?.type?.[0]}
                required>
                <Select name="type" defaultValue="PRIMARY">
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {schoolTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="School code"
                error={state.errors?.schoolCode?.[0]}>
                <Input
                  name="schoolCode"
                  placeholder="WHS-001"
                  className="h-12 uppercase"
                />
              </FormField>

              <FormField label="Slug" error={state.errors?.slug?.[0]} required>
                <Input
                  name="slug"
                  placeholder="windermere-high-school"
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
                placeholder="Describe the school, its population, programs, or instructional focus..."
              />
            </FormField>
          </section>

          <section className="space-y-5 border-t border-slate-200 pt-6">
            <SectionHeading
              title="Address"
              description="Add the school’s physical or mailing address."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Address line 1"
                error={state.errors?.addressLine1?.[0]}>
                <Input
                  name="addressLine1"
                  placeholder="Queen's Highway"
                  className="h-12"
                />
              </FormField>

              <FormField
                label="Address line 2"
                error={state.errors?.addressLine2?.[0]}>
                <Input
                  name="addressLine2"
                  placeholder="Rock Sound"
                  className="h-12"
                />
              </FormField>

              <FormField
                label="Postal code"
                error={state.errors?.postalCode?.[0]}>
                <Input
                  name="postalCode"
                  placeholder="Optional"
                  className="h-12"
                />
              </FormField>
            </div>
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
                  placeholder="https://www.example.edu"
                  className="h-12"
                />
              </FormField>

              <FormField label="Email" error={state.errors?.email?.[0]}>
                <Input
                  name="email"
                  type="email"
                  placeholder="info@example.edu"
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

            {pending ? "Creating..." : "Create School"}
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

const schoolTypes = [
  { value: "PRESCHOOL", label: "Preschool" },
  { value: "PRIMARY", label: "Primary" },
  { value: "JUNIOR_HIGH", label: "Junior High" },
  { value: "SENIOR_HIGH", label: "Senior High" },
  { value: "ALL_AGE", label: "All-Age" },
  { value: "SPECIALIZED", label: "Specialized" },
  { value: "VOCATIONAL", label: "Vocational" },
  { value: "PRIVATE", label: "Private" },
  { value: "OTHER", label: "Other" },
] as const;
