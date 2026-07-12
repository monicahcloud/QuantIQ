"use client";

import {
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { BookOpenCheck, Loader2, Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import type { CurriculumVersionActionState } from "@/lib/types/curriculum-version-action-state";
import { createCurriculumVersion } from "@/app/admin/(portal)/curriculum-engine/versions/action";

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

type AuthorityOption = {
  id: string;
  countryId: string;
  administrativeDivisionId: string | null;
  name: string;
  type: string;
};

type OrganizationOption = {
  id: string;
  countryId: string;
  authorityId: string | null;
  administrativeDivisionId: string | null;
  name: string;
  type: string;
};

type SchoolOption = {
  id: string;
  countryId: string;
  authorityId: string | null;
  organizationId: string | null;
  administrativeDivisionId: string | null;
  name: string;
  type: string;
};

type CurriculumScope =
  | "COUNTRY"
  | "ADMINISTRATIVE_DIVISION"
  | "AUTHORITY"
  | "ORGANIZATION"
  | "SCHOOL";

type CreateCurriculumVersionFormProps = {
  countries: CountryOption[];
  divisions: DivisionOption[];
  authorities: AuthorityOption[];
  organizations: OrganizationOption[];
  schools: SchoolOption[];
};

const initialState: CurriculumVersionActionState = {
  success: false,
  message: "",
};

export default function CreateCurriculumVersionForm({
  countries,
  divisions,
  authorities,
  organizations,
  schools,
}: CreateCurriculumVersionFormProps) {
  const [open, setOpen] = useState(false);

  const [countryId, setCountryId] = useState("");
  const [scope, setScope] = useState<CurriculumScope>("COUNTRY");

  const [divisionId, setDivisionId] = useState("NONE");
  const [authorityId, setAuthorityId] = useState("NONE");
  const [organizationId, setOrganizationId] = useState("NONE");
  const [schoolId, setSchoolId] = useState("NONE");

  const [status, setStatus] = useState("DRAFT");

  const [state, setState] =
    useState<CurriculumVersionActionState>(initialState);

  const [pending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  const filteredDivisions = useMemo(
    () => divisions.filter((division) => division.countryId === countryId),
    [countryId, divisions],
  );

  const filteredAuthorities = useMemo(
    () =>
      authorities.filter(
        (authority) =>
          authority.countryId === countryId &&
          (divisionId === "NONE" ||
            authority.administrativeDivisionId === divisionId ||
            authority.administrativeDivisionId === null),
      ),
    [authorities, countryId, divisionId],
  );

  const filteredOrganizations = useMemo(
    () =>
      organizations.filter(
        (organization) =>
          organization.countryId === countryId &&
          (divisionId === "NONE" ||
            organization.administrativeDivisionId === divisionId ||
            organization.administrativeDivisionId === null) &&
          (authorityId === "NONE" ||
            organization.authorityId === authorityId ||
            organization.authorityId === null),
      ),
    [authorityId, countryId, divisionId, organizations],
  );

  const filteredSchools = useMemo(
    () =>
      schools.filter(
        (school) =>
          school.countryId === countryId &&
          (divisionId === "NONE" ||
            school.administrativeDivisionId === divisionId ||
            school.administrativeDivisionId === null) &&
          (authorityId === "NONE" ||
            school.authorityId === authorityId ||
            school.authorityId === null) &&
          (organizationId === "NONE" ||
            school.organizationId === organizationId ||
            school.organizationId === null),
      ),
    [authorityId, countryId, divisionId, organizationId, schools],
  );

  function resetForm() {
    formRef.current?.reset();

    setCountryId("");
    setScope("COUNTRY");
    setDivisionId("NONE");
    setAuthorityId("NONE");
    setOrganizationId("NONE");
    setSchoolId("NONE");
    setStatus("DRAFT");
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
    setDivisionId("NONE");
    setAuthorityId("NONE");
    setOrganizationId("NONE");
    setSchoolId("NONE");
    setState(initialState);
  }

  function handleScopeChange(value: string) {
    const nextScope = value as CurriculumScope;

    setScope(nextScope);

    if (nextScope === "COUNTRY") {
      setDivisionId("NONE");
      setAuthorityId("NONE");
      setOrganizationId("NONE");
      setSchoolId("NONE");
    }

    if (nextScope === "ADMINISTRATIVE_DIVISION") {
      setAuthorityId("NONE");
      setOrganizationId("NONE");
      setSchoolId("NONE");
    }

    if (nextScope === "AUTHORITY") {
      setOrganizationId("NONE");
      setSchoolId("NONE");
    }

    if (nextScope === "ORGANIZATION") {
      setSchoolId("NONE");
    }

    setState(initialState);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createCurriculumVersion(initialState, formData);

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
          Add Curriculum Version
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpenCheck className="h-5 w-5 text-blue-700" />
            Add a curriculum version
          </DialogTitle>

          <DialogDescription>
            Define the curriculum’s jurisdiction, effective dates, language, and
            publication status.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleSubmit} className="mt-4 space-y-7">
          <section className="space-y-5">
            <SectionHeading
              title="Jurisdiction and scope"
              description="Choose where this curriculum applies."
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
                label="Curriculum scope"
                error={state.errors?.scope?.[0]}
                required>
                <Select
                  name="scope"
                  value={scope}
                  onValueChange={handleScopeChange}>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="COUNTRY">Entire country</SelectItem>

                    <SelectItem value="ADMINISTRATIVE_DIVISION">
                      State, province, island, or division
                    </SelectItem>

                    <SelectItem value="AUTHORITY">
                      Education authority
                    </SelectItem>

                    <SelectItem value="ORGANIZATION">Organization</SelectItem>

                    <SelectItem value="SCHOOL">Individual school</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              {scope !== "COUNTRY" && (
                <FormField
                  label="Administrative division"
                  error={state.errors?.administrativeDivisionId?.[0]}
                  required={scope === "ADMINISTRATIVE_DIVISION"}>
                  <Select
                    name="administrativeDivisionId"
                    value={divisionId}
                    onValueChange={(value) => {
                      setDivisionId(value);
                      setAuthorityId("NONE");
                      setOrganizationId("NONE");
                      setSchoolId("NONE");
                      setState(initialState);
                    }}
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
              )}

              {["AUTHORITY", "ORGANIZATION", "SCHOOL"].includes(scope) && (
                <FormField
                  label="Education authority"
                  error={state.errors?.authorityId?.[0]}
                  required={scope === "AUTHORITY"}>
                  <Select
                    name="authorityId"
                    value={authorityId}
                    onValueChange={(value) => {
                      setAuthorityId(value);
                      setOrganizationId("NONE");
                      setSchoolId("NONE");
                      setState(initialState);
                    }}
                    disabled={!countryId}>
                    <SelectTrigger className="h-12 w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="NONE">
                        No education authority
                      </SelectItem>

                      {filteredAuthorities.map((authority) => (
                        <SelectItem key={authority.id} value={authority.id}>
                          {authority.name} · {formatLabel(authority.type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              )}

              {["ORGANIZATION", "SCHOOL"].includes(scope) && (
                <FormField
                  label="Organization"
                  error={state.errors?.organizationId?.[0]}
                  required={scope === "ORGANIZATION"}>
                  <Select
                    name="organizationId"
                    value={organizationId}
                    onValueChange={(value) => {
                      setOrganizationId(value);
                      setSchoolId("NONE");
                      setState(initialState);
                    }}
                    disabled={!countryId}>
                    <SelectTrigger className="h-12 w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="NONE">No organization</SelectItem>

                      {filteredOrganizations.map((organization) => (
                        <SelectItem
                          key={organization.id}
                          value={organization.id}>
                          {organization.name} · {formatLabel(organization.type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              )}

              {scope === "SCHOOL" && (
                <FormField
                  label="School"
                  error={state.errors?.schoolId?.[0]}
                  required>
                  <Select
                    name="schoolId"
                    value={schoolId}
                    onValueChange={(value) => {
                      setSchoolId(value);
                      setState(initialState);
                    }}
                    disabled={!countryId}>
                    <SelectTrigger className="h-12 w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="NONE">Select school</SelectItem>

                      {filteredSchools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name} · {formatLabel(school.type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              )}
            </div>
          </section>

          <section className="space-y-5 border-t border-slate-200 pt-6">
            <SectionHeading
              title="Curriculum identity"
              description="Add the official curriculum name, code, version, language, and identifier."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Curriculum name"
                error={state.errors?.name?.[0]}
                required>
                <Input
                  name="name"
                  placeholder="The Bahamas National Curriculum"
                  className="h-12"
                  required
                />
              </FormField>

              <FormField
                label="Version label"
                error={state.errors?.versionLabel?.[0]}>
                <Input
                  name="versionLabel"
                  placeholder="2026 Edition"
                  className="h-12"
                />
              </FormField>

              <FormField
                label="Curriculum code"
                error={state.errors?.code?.[0]}
                required>
                <Input
                  name="code"
                  placeholder="BHS-NC-2026"
                  className="h-12 uppercase"
                  required
                />
              </FormField>

              <FormField label="Slug" error={state.errors?.slug?.[0]} required>
                <Input
                  name="slug"
                  placeholder="bahamas-national-curriculum-2026"
                  className="h-12"
                  required
                />
              </FormField>

              <FormField
                label="Language code"
                error={state.errors?.languageCode?.[0]}
                required>
                <Input
                  name="languageCode"
                  defaultValue="en"
                  placeholder="en"
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
                placeholder="Describe the curriculum, its purpose, and intended audience..."
              />
            </FormField>

            <FormField label="Internal notes" error={state.errors?.notes?.[0]}>
              <Textarea
                name="notes"
                rows={3}
                placeholder="Add internal implementation or governance notes..."
              />
            </FormField>
          </section>

          <section className="space-y-5 border-t border-slate-200 pt-6">
            <SectionHeading
              title="Version lifecycle"
              description="Define when this curriculum takes effect and its governance status."
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                label="Effective from"
                error={state.errors?.effectiveFrom?.[0]}>
                <Input name="effectiveFrom" type="date" className="h-12" />
              </FormField>

              <FormField
                label="Effective to"
                error={state.errors?.effectiveTo?.[0]}>
                <Input name="effectiveTo" type="date" className="h-12" />
              </FormField>

              <FormField
                label="Published date"
                error={state.errors?.publishedAt?.[0]}>
                <Input name="publishedAt" type="date" className="h-12" />
              </FormField>

              <FormField
                label="Workflow status"
                error={state.errors?.status?.[0]}
                required>
                <Select
                  name="status"
                  value={status}
                  onValueChange={(value) => {
                    setStatus(value);
                    setState(initialState);
                  }}>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="RETIRED">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <Checkbox name="isCurrent" className="mt-1" />

              <div>
                <p className="text-sm font-black text-slate-800">
                  Mark as current curriculum
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  This will replace any existing current curriculum version with
                  the same scope and jurisdiction.
                </p>

                {state.errors?.isCurrent?.[0] && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {state.errors.isCurrent[0]}
                  </p>
                )}
              </div>
            </label>
          </section>

          <Button
            type="submit"
            disabled={pending || !countryId}
            className="w-full bg-blue-700 hover:bg-blue-800">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {pending ? "Creating..." : "Create Curriculum Version"}
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
