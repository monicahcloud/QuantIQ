"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import type { LessonWizardData } from "./LessonWizard";

type Props = {
  data: LessonWizardData;
  updateData: (values: Partial<LessonWizardData>) => void;
};

const assessmentOptions = [
  {
    id: "exit-ticket",
    label: "Exit Ticket",
    description: "A short end-of-lesson check for understanding.",
  },
  {
    id: "quiz",
    label: "Quiz",
    description: "A structured set of assessment questions.",
  },
  {
    id: "worksheet",
    label: "Worksheet",
    description: "Independent or guided student practice.",
  },
  {
    id: "discussion",
    label: "Discussion",
    description: "A verbal assessment of student reasoning.",
  },
  {
    id: "observation",
    label: "Observation",
    description: "Assess students during classroom participation.",
  },
  {
    id: "project",
    label: "Project",
    description: "An applied task demonstrating knowledge and skills.",
  },
];

export default function LessonObjectives({ data, updateData }: Props) {
  function updateObjective(index: number, value: string) {
    const learningObjectives = [...data.learningObjectives];
    learningObjectives[index] = value;
    updateData({ learningObjectives });
  }

  function addObjective() {
    updateData({
      learningObjectives: [...data.learningObjectives, ""],
    });
  }

  function removeObjective(index: number) {
    if (data.learningObjectives.length === 1) return;

    updateData({
      learningObjectives: data.learningObjectives.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    });
  }

  function updateCriterion(index: number, value: string) {
    const successCriteria = [...data.successCriteria];
    successCriteria[index] = value;
    updateData({ successCriteria });
  }

  function addCriterion() {
    updateData({
      successCriteria: [...data.successCriteria, ""],
    });
  }

  function removeCriterion(index: number) {
    if (data.successCriteria.length === 1) return;

    updateData({
      successCriteria: data.successCriteria.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    });
  }

  return (
    <section>
      <h2 className="text-2xl font-black text-[#071d4e]">
        Define the lesson outcomes
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        Identify what students should learn and how they will demonstrate
        success.
      </p>

      <div className="mt-8 space-y-9">
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Label className="text-base font-black text-[#071d4e]">
                Learning objectives
              </Label>

              <p className="mt-1 text-sm text-slate-500">
                Use observable verbs such as identify, explain, compare, solve,
                or create.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addObjective}>
              <Plus className="mr-2 h-4 w-4" />
              Add Objective
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {data.learningObjectives.map((objective, index) => (
              <div
                key={`objective-${index}`}
                className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-700">
                  {index + 1}
                </div>

                <Textarea
                  value={objective}
                  onChange={(event) =>
                    updateObjective(index, event.target.value)
                  }
                  placeholder="Students will be able to..."
                  rows={2}
                  className="min-h-12 resize-none"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeObjective(index)}
                  disabled={data.learningObjectives.length === 1}
                  className="mt-1 shrink-0 text-slate-400 hover:text-red-600"
                  aria-label={`Remove objective ${index + 1}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Label className="text-base font-black text-[#071d4e]">
                Success criteria
              </Label>

              <p className="mt-1 text-sm text-slate-500">
                Describe the evidence that demonstrates mastery.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCriterion}>
              <Plus className="mr-2 h-4 w-4" />
              Add Criterion
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {data.successCriteria.map((criterion, index) => (
              <div
                key={`criterion-${index}`}
                className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-700">
                  {index + 1}
                </div>

                <Input
                  value={criterion}
                  onChange={(event) =>
                    updateCriterion(index, event.target.value)
                  }
                  placeholder="Example: Students correctly solve 4 out of 5 problems."
                  className="h-12"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCriterion(index)}
                  disabled={data.successCriteria.length === 1}
                  className="shrink-0 text-slate-400 hover:text-red-600"
                  aria-label={`Remove criterion ${index + 1}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <Label className="text-base font-black text-[#071d4e]">
            Primary assessment type
          </Label>

          <p className="mt-1 text-sm text-slate-500">
            Select the main method for checking student understanding.
          </p>

          <RadioGroup
            value={data.assessmentType}
            onValueChange={(assessmentType) => updateData({ assessmentType })}
            className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {assessmentOptions.map((option) => {
              const selected = data.assessmentType === option.id;

              return (
                <Label
                  key={option.id}
                  htmlFor={`assessment-${option.id}`}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                    selected
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}>
                  <RadioGroupItem
                    id={`assessment-${option.id}`}
                    value={option.id}
                    className="mt-0.5"
                  />

                  <div>
                    <p className="text-sm font-black text-slate-800">
                      {option.label}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {option.description}
                    </p>
                  </div>
                </Label>
              );
            })}
          </RadioGroup>
        </div>
      </div>
    </section>
  );
}
