"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { createCountry } from "@/app/admin/(portal)/education-engine/countries/actions";
import { initialCountryActionState } from "@/lib/types/country-action-state";
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

export default function CreateCountryForm() {
  const [state, action, pending] = useActionState(
    createCountry,
    initialCountryActionState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.success) {
      toast.success(state.message);
      formRef.current?.reset();
      return;
    }

    toast.error(state.message);
  }, [state]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-blue-700 hover:bg-blue-800">
          <Plus className="mr-2 h-4 w-4" />
          Add Country
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add a country</DialogTitle>

          <DialogDescription>
            Create a country-level tenant and its default localization settings.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={action} className="mt-4 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Country name"
              name="name"
              placeholder="The Bahamas"
              error={state.errors?.name?.[0]}
              required
            />

            <Field
              label="Official name"
              name="officialName"
              placeholder="Commonwealth of The Bahamas"
              error={state.errors?.officialName?.[0]}
            />

            <Field
              label="ISO-2 code"
              name="iso2Code"
              placeholder="BS"
              maxLength={2}
              error={state.errors?.iso2Code?.[0]}
              required
            />

            <Field
              label="ISO-3 code"
              name="iso3Code"
              placeholder="BHS"
              maxLength={3}
              error={state.errors?.iso3Code?.[0]}
              required
            />

            <Field
              label="Slug"
              name="slug"
              placeholder="the-bahamas"
              error={state.errors?.slug?.[0]}
              required
            />

            <Field
              label="Default locale"
              name="defaultLocale"
              placeholder="en-BS"
              defaultValue="en-BS"
              error={state.errors?.defaultLocale?.[0]}
              required
            />

            <div className="sm:col-span-2">
              <Field
                label="Default time zone"
                name="defaultTimeZone"
                placeholder="America/Nassau"
                error={state.errors?.defaultTimeZone?.[0]}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-700 hover:bg-blue-800">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? "Creating..." : "Create Country"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  name,
  error,
  required,
  ...inputProps
}: React.ComponentProps<typeof Input> & {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </Label>

      <Input
        id={name}
        name={name}
        required={required}
        aria-invalid={Boolean(error)}
        {...inputProps}
      />

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
