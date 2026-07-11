"use client";

import { useMemo, useState, useTransition } from "react";
import { BookOpen, CheckCircle2, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GradeSubjectActionState } from "@/lib/types/grade-subject-action-state";
import { saveGradeSubjectMappings } from "@/app/admin/(portal)/education-engine/grade-subjects/actions";

type CountryOption = {
  id: string;
  name: string;
};

type EducationLevelOption = {
  id: string;
  countryId: string;
  name: string;
};

type GradeOption = {
  id: string;
  countryId: string;
  educationLevelId: string;
  name: string;
  sequence: number;
};

type SubjectOption = {
  id: string;
  countryId: string;
  name: string;
  code: string;
  sequence: number;
};

type ExistingMapping = {
  gradeLevelId: string;
  subjectId: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  isRequired: boolean;
};

type GradeSubjectManagerProps = {
  countries: CountryOption[];
  educationLevels: EducationLevelOption[];
  grades: GradeOption[];
  subjects: SubjectOption[];
  mappings: ExistingMapping[];
};

const initialState: GradeSubjectActionState = {
  success: false,
  message: "",
};

export default function GradeSubjectManager({
  countries,
  educationLevels,
  grades,
  subjects,
  mappings,
}: GradeSubjectManagerProps) {
  const [countryId, setCountryId] = useState("");
  const [educationLevelId, setEducationLevelId] = useState("");
  const [gradeLevelId, setGradeLevelId] = useState("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [state, setState] = useState<GradeSubjectActionState>(initialState);
  const [pending, startTransition] = useTransition();

  const filteredEducationLevels = useMemo(
    () => educationLevels.filter((level) => level.countryId === countryId),
    [countryId, educationLevels],
  );

  const filteredGrades = useMemo(
    () =>
      grades.filter(
        (grade) =>
          grade.countryId === countryId &&
          grade.educationLevelId === educationLevelId,
      ),
    [countryId, educationLevelId, grades],
  );

  const filteredSubjects = useMemo(
    () =>
      subjects
        .filter((subject) => subject.countryId === countryId)
        .sort((a, b) => a.sequence - b.sequence),
    [countryId, subjects],
  );

  function loadGradeMappings(nextGradeLevelId: string) {
    setGradeLevelId(nextGradeLevelId);

    const existingSubjectIds = mappings
      .filter(
        (mapping) =>
          mapping.gradeLevelId === nextGradeLevelId &&
          mapping.status === "ACTIVE",
      )
      .map((mapping) => mapping.subjectId);

    setSelectedSubjectIds(existingSubjectIds);
    setState(initialState);
  }

  function handleCountryChange(value: string) {
    setCountryId(value);
    setEducationLevelId("");
    setGradeLevelId("");
    setSelectedSubjectIds([]);
    setState(initialState);
  }

  function handleEducationLevelChange(value: string) {
    setEducationLevelId(value);
    setGradeLevelId("");
    setSelectedSubjectIds([]);
    setState(initialState);
  }

  function toggleSubject(subjectId: string) {
    setSelectedSubjectIds((current) =>
      current.includes(subjectId)
        ? current.filter((id) => id !== subjectId)
        : [...current, subjectId],
    );

    setState(initialState);
  }

  function selectAllSubjects() {
    setSelectedSubjectIds(filteredSubjects.map((subject) => subject.id));
  }

  function clearSubjects() {
    setSelectedSubjectIds([]);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveGradeSubjectMappings(initialState, formData);

      setState(result);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="countryId" value={countryId} />
      <input type="hidden" name="gradeLevelId" value={gradeLevelId} />

      {selectedSubjectIds.map((subjectId) => (
        <input
          key={subjectId}
          type="hidden"
          name="subjectIds"
          value={subjectId}
        />
      ))}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-3">
          <FormField label="Country" error={state.errors?.countryId?.[0]}>
            <Select
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

          <FormField label="Education level">
            <Select
              value={educationLevelId || undefined}
              onValueChange={handleEducationLevelChange}
              disabled={!countryId}>
              <SelectTrigger className="h-12 w-full">
                <SelectValue
                  placeholder={
                    countryId
                      ? "Select education level"
                      : "Select country first"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {filteredEducationLevels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Grade level"
            error={state.errors?.gradeLevelId?.[0]}>
            <Select
              value={gradeLevelId || undefined}
              onValueChange={loadGradeMappings}
              disabled={!educationLevelId}>
              <SelectTrigger className="h-12 w-full">
                <SelectValue
                  placeholder={
                    educationLevelId
                      ? "Select grade level"
                      : "Select education level first"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {filteredGrades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id}>
                    {grade.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </section>

      {gradeLevelId ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                Subject assignment
              </p>

              <h2 className="mt-2 text-xl font-black text-[#071d4e]">
                Select subjects for this grade
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {selectedSubjectIds.length} of {filteredSubjects.length}{" "}
                subjects selected
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={selectAllSubjects}>
                Select All
              </Button>

              <Button type="button" variant="ghost" onClick={clearSubjects}>
                Clear
              </Button>
            </div>
          </div>

          {state.errors?.subjectIds?.[0] && (
            <p className="mt-4 text-sm font-medium text-red-600">
              {state.errors.subjectIds[0]}
            </p>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredSubjects.map((subject) => {
              const checked = selectedSubjectIds.includes(subject.id);

              return (
                <label
                  key={subject.id}
                  className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                    checked
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}>
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleSubject(subject.id)}
                    className="mt-1"
                  />

                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        checked
                          ? "bg-blue-700 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                      {checked ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <BookOpen className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-black text-[#071d4e]">
                        {subject.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {subject.code}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="mt-7 flex justify-end border-t border-slate-200 pt-6">
            <Button
              type="submit"
              disabled={
                pending || !gradeLevelId || selectedSubjectIds.length === 0
              }
              className="min-w-48 bg-blue-700 hover:bg-blue-800">
              {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}

              {pending ? "Saving..." : "Save Grade Subjects"}
            </Button>
          </div>
        </section>
      ) : (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-300" />

          <h2 className="mt-4 text-xl font-black text-[#071d4e]">
            Select a grade level
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Choose a country, education level, and grade to manage its available
            subjects.
          </p>
        </section>
      )}
    </form>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {children}

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
