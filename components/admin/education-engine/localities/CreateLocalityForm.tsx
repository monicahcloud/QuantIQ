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

import { createLocality } from "@/app/admin/(portal)/education-engine/localities/actions";
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
import { LocalityActionState } from "@/lib/types/locality-action-state";

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

type CreateLocalityFormProps = {
  countries: CountryOption[];
  divisions: DivisionOption[];
};

const initialState: LocalityActionState = {
  success: false,
  message: "",
};

export default function CreateLocalityForm({
  countries,
  divisions,
}: CreateLocalityFormProps) {
  const [open, setOpen] = useState(false);
  const [countryId, setCountryId] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [state, setState] = useState<LocalityActionState>(initialState);
  const [pending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  const filteredDivisions = useMemo(
    () => divisions.filter((division) => division.countryId === countryId),
    [countryId, divisions],
  );

  function resetForm() {
    formRef.current?.reset();
    setCountryId("");
    setDivisionId("");
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
    setState(initialState);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createLocality(initialState, formData);

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
          Add Locality
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add a locality</DialogTitle>

          <DialogDescription>
            Create a city, town, settlement, village, district, municipality, or
            community within an administrative division.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleSubmit} className="mt-4 space-y-6">
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
              error={state.errors?.administrativeDivisionId?.[0]}
              required>
              <Select
                name="administrativeDivisionId"
                value={divisionId || undefined}
                onValueChange={(value) => {
                  setDivisionId(value);
                  setState(initialState);
                }}
                disabled={!countryId}>
                <SelectTrigger className="h-12 w-full">
                  <SelectValue
                    placeholder={
                      countryId ? "Select division" : "Select country first"
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

            <FormField
              label="Locality name"
              error={state.errors?.name?.[0]}
              required>
              <Input
                name="name"
                placeholder="Governor's Harbour"
                className="h-12"
                required
              />
            </FormField>

            <FormField
              label="Locality type"
              error={state.errors?.type?.[0]}
              required>
              <Select name="type" defaultValue="SETTLEMENT">
                <SelectTrigger className="h-12 w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {localityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Code" error={state.errors?.code?.[0]}>
              <Input name="code" placeholder="GH" className="h-12 uppercase" />
            </FormField>

            <FormField label="Slug" error={state.errors?.slug?.[0]} required>
              <Input
                name="slug"
                placeholder="governors-harbour"
                className="h-12"
                required
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

          <FormField label="Description" error={state.errors?.description?.[0]}>
            <Textarea
              name="description"
              rows={4}
              placeholder="Describe this locality..."
            />
          </FormField>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-black text-[#071d4e]">Map coordinates</p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Optional coordinates support future maps and geographic reporting.
            </p>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <FormField label="Latitude" error={state.errors?.latitude?.[0]}>
                <Input
                  name="latitude"
                  type="number"
                  step="any"
                  min={-90}
                  max={90}
                  placeholder="25.0343"
                  className="h-12"
                />
              </FormField>

              <FormField label="Longitude" error={state.errors?.longitude?.[0]}>
                <Input
                  name="longitude"
                  type="number"
                  step="any"
                  min={-180}
                  max={180}
                  placeholder="-77.3963"
                  className="h-12"
                />
              </FormField>
            </div>
          </section>

          <Button
            type="submit"
            disabled={pending || !divisionId}
            className="w-full bg-blue-700 hover:bg-blue-800">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {pending ? "Creating..." : "Create Locality"}
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

const localityTypes = [
  { value: "CITY", label: "City" },
  { value: "TOWN", label: "Town" },
  { value: "SETTLEMENT", label: "Settlement" },
  { value: "VILLAGE", label: "Village" },
  { value: "DISTRICT", label: "District" },
  { value: "MUNICIPALITY", label: "Municipality" },
  { value: "COMMUNITY", label: "Community" },
  { value: "OTHER", label: "Other" },
] as const;
