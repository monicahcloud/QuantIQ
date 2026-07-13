"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

type CountryOption = {
  id: string;
  name: string;
};

type CurriculumVersionFormProps = {
  countries: CountryOption[];
};

export default function CurriculumVersionForm({
  countries,
}: CurriculumVersionFormProps) {
  const router = useRouter();

  const [countryId, setCountryId] = useState("");
  const [scope, setScope] = useState("COUNTRY");
  const [status, setStatus] = useState("DRAFT");
  const [isCurrent, setIsCurrent] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const payload = {
      countryId,
      name: String(formData.get("name") ?? ""),
      code: String(formData.get("code") ?? ""),
      versionLabel: String(formData.get("versionLabel") ?? ""),
      languageCode: String(formData.get("languageCode") ?? "en"),
      description: String(formData.get("description") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      effectiveFrom: String(formData.get("effectiveFrom") ?? ""),
      effectiveTo: String(formData.get("effectiveTo") ?? ""),
      scope,
      status,
      isCurrent,
    };

    startTransition(async () => {
      try {
        const response = await fetch("/api/curriculum-versions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = (await response.json()) as {
          success: boolean;
          message: string;
          versionId?: string;
        };

        if (!response.ok || !result.success || !result.versionId) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);

        router.push(
          `/admin/curriculum-engine/versions/${result.versionId}/documents`,
        );

        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("The curriculum version could not be created.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label>Country</Label>

          <Select value={countryId} onValueChange={setCountryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>

            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.id} value={country.id}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Name</Label>

          <Input
            name="name"
            placeholder="The Bahamas National Curriculum"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Code</Label>

          <Input name="code" placeholder="BHS-NATIONAL-2026" required />
        </div>

        <div className="space-y-2">
          <Label>Version label</Label>

          <Input name="versionLabel" placeholder="2026 Edition" />
        </div>

        <div className="space-y-2">
          <Label>Language code</Label>

          <Input
            name="languageCode"
            defaultValue="en"
            placeholder="en"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Scope</Label>

          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="COUNTRY">Country</SelectItem>
              <SelectItem value="ADMINISTRATIVE_DIVISION">
                Administrative Division
              </SelectItem>
              <SelectItem value="AUTHORITY">Authority</SelectItem>
              <SelectItem value="ORGANIZATION">Organization</SelectItem>
              <SelectItem value="SCHOOL">School</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Effective from</Label>
          <Input name="effectiveFrom" type="date" />
        </div>

        <div className="space-y-2">
          <Label>Effective to</Label>
          <Input name="effectiveTo" type="date" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>

        <Textarea
          name="description"
          rows={4}
          placeholder="Describe the curriculum version..."
        />
      </div>

      <div className="space-y-2">
        <Label>Internal notes</Label>

        <Textarea
          name="notes"
          rows={3}
          placeholder="Add internal administrative notes..."
        />
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Checkbox
          checked={isCurrent}
          onCheckedChange={(checked) => setIsCurrent(checked === true)}
        />

        <div>
          <p className="text-sm font-bold text-slate-800">
            Current curriculum version
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Mark this version as the currently active curriculum for the
            selected country.
          </p>
        </div>
      </label>

      <Button
        type="submit"
        disabled={pending || !countryId}
        className="w-full bg-blue-700 hover:bg-blue-800">
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}

        {pending ? "Creating Version..." : "Create Curriculum Version"}
      </Button>
    </form>
  );
}
