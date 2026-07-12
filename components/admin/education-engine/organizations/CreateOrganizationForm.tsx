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
import { createOrganization } from "@/app/admin/(portal)/education-engine/organizations/actions";
import { OrganizationActionState } from "@/lib/types/organization-action-state";

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

type OrganizationOption = {
  id: string;
  countryId: string;
  name: string;
  type: string;
};

type CreateOrganizationFormProps = {
  countries: CountryOption[];
  authorities: AuthorityOption[];
  divisions: DivisionOption[];
  localities: LocalityOption[];
  organizations: OrganizationOption[];
};

const initialState: OrganizationActionState = {
  success: false,
  message: "",
};

export default function CreateOrganizationForm({
  countries,
  authorities,
  divisions,
  localities,
  organizations,
}: CreateOrganizationFormProps) {
  const [open, setOpen] = useState(false);

  const [countryId, setCountryId] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [localityId, setLocalityId] = useState("");
  const [authorityId, setAuthorityId] = useState("NONE");
  const [parentOrganizationId, setParentOrganizationId] = useState("NONE");

  const [state, setState] = useState<OrganizationActionState>(initialState);

  const [pending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  const filteredAuthorities = useMemo(
    () => authorities.filter((authority) => authority.countryId === countryId),
    [authorities, countryId],
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
          (!divisionId || locality.administrativeDivisionId === divisionId),
      ),
    [countryId, divisionId, localities],
  );

  const filteredParentOrganizations = useMemo(
    () =>
      organizations.filter(
        (organization) => organization.countryId === countryId,
      ),
    [countryId, organizations],
  );

  function resetForm() {
    formRef.current?.reset();

    setCountryId("");
    setDivisionId("");
    setLocalityId("");
    setAuthorityId("NONE");
    setParentOrganizationId("NONE");
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
    setAuthorityId("NONE");
    setParentOrganizationId("NONE");
    setState(initialState);
  }

  function handleDivisionChange(value: string) {
    setDivisionId(value === "NONE" ? "" : value);
    setLocalityId("");
    setState(initialState);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createOrganization(initialState, formData);

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
          Add Organization
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-700" />
            Add an organization
          </DialogTitle>

          <DialogDescription>
            Add a government entity, school network, district, religious
            organization, charter network, or independent organization.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleSubmit} className="mt-4 space-y-7">
          <section className="space-y-5">
            <SectionHeading
              title="Geographic assignment"
              description="Country is required. Division and locality are optional."
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
                  value={divisionId || "NONE"}
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
                  value={localityId || "NONE"}
                  onValueChange={(value) => {
                    setLocalityId(value === "NONE" ? "" : value);
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
              description="Optionally connect this organization to an education authority or parent organization."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Education authority"
                error={state.errors?.authorityId?.[0]}>
                <Select
                  name="authorityId"
                  value={authorityId}
                  onValueChange={(value) => {
                    setAuthorityId(value);
                    setState(initialState);
                  }}
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
                label="Parent organization"
                error={state.errors?.parentOrganizationId?.[0]}>
                <Select
                  name="parentOrganizationId"
                  value={parentOrganizationId}
                  onValueChange={(value) => {
                    setParentOrganizationId(value);
                    setState(initialState);
                  }}
                  disabled={!countryId}>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="NONE">No parent organization</SelectItem>

                    {filteredParentOrganizations.map((organization) => (
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
              title="Organization information"
              description="Define the organization name, classification, and identifier."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Organization name"
                error={state.errors?.name?.[0]}
                required>
                <Input
                  name="name"
                  placeholder="Catholic Board of Education"
                  className="h-12"
                  required
                />
              </FormField>

              <FormField
                label="Organization type"
                error={state.errors?.type?.[0]}
                required>
                <Select name="type" defaultValue="GOVERNMENT">
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {organizationTypes.map((type) => (
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
                  placeholder="catholic-board-of-education"
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
                placeholder="Describe the organization and its role..."
              />
            </FormField>
          </section>

          <section className="space-y-5 border-t border-slate-200 pt-6">
            <SectionHeading
              title="Contact information"
              description="Optional contact details for this organization."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Website" error={state.errors?.websiteUrl?.[0]}>
                <Input
                  name="websiteUrl"
                  type="url"
                  placeholder="https://www.example.org"
                  className="h-12"
                />
              </FormField>

              <FormField label="Email" error={state.errors?.email?.[0]}>
                <Input
                  name="email"
                  type="email"
                  placeholder="info@example.org"
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

            {pending ? "Creating..." : "Create Organization"}
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

const organizationTypes = [
  { value: "GOVERNMENT", label: "Government" },
  { value: "PRIVATE_NETWORK", label: "Private Network" },
  { value: "SCHOOL_BOARD", label: "School Board" },
  { value: "DISTRICT", label: "District" },
  {
    value: "RELIGIOUS_NETWORK",
    label: "Religious Network",
  },
  { value: "CHARTER_NETWORK", label: "Charter Network" },
  {
    value: "HOMESCHOOL_NETWORK",
    label: "Homeschool Network",
  },
  { value: "INDEPENDENT", label: "Independent" },
  { value: "OTHER", label: "Other" },
] as const;
