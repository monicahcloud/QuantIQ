"use client";

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

import type { LessonWizardData } from "../LessonWizard";

type Props = {
  data: LessonWizardData;
  updateData: (values: Partial<LessonWizardData>) => void;
};

const learningLevels = [
  {
    id: "below-grade-level",
    label: "Below grade level",
    description: "Students who need additional scaffolding and support.",
  },
  {
    id: "on-grade-level",
    label: "On grade level",
    description: "Students working at the expected curriculum level.",
  },
  {
    id: "above-grade-level",
    label: "Above grade level",
    description: "Students ready for enrichment and extension work.",
  },
];

const studentNeeds = [
  { id: "adhd", label: "ADHD" },
  { id: "dyslexia", label: "Dyslexia" },
  { id: "ell", label: "English language learners" },
  { id: "autism", label: "Autism support" },
  { id: "gifted", label: "Gifted learners" },
  { id: "behavioral-support", label: "Behavioral support" },
  { id: "iep", label: "IEP accommodations" },
  { id: "small-group", label: "Small-group instruction" },
];

export default function LessonStudentInformation({ data, updateData }: Props) {
  function toggleLearningLevel(value: string) {
    updateData({
      learningLevels: data.learningLevels.includes(value)
        ? data.learningLevels.filter((item) => item !== value)
        : [...data.learningLevels, value],
    });
  }

  function toggleStudentNeed(value: string) {
    updateData({
      studentNeeds: data.studentNeeds.includes(value)
        ? data.studentNeeds.filter((item) => item !== value)
        : [...data.studentNeeds, value],
    });
  }

  return (
    <section>
      <h2 className="text-2xl font-black text-[#071d4e]">
        Tell us about your students
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        These details help QuantIQ personalize pacing, differentiation,
        scaffolding, and classroom activities.
      </p>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Class</Label>

          <Select
            value={data.className}
            onValueChange={(className) => updateData({ className })}>
            <SelectTrigger className="h-12 w-full">
              <SelectValue placeholder="Select a class or continue without one" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="not-assigned">
                Continue without a class
              </SelectItem>
              <SelectItem value="create-new">Create a new class</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            Class size <span className="text-red-600">*</span>
          </Label>

          <Input
            type="number"
            min={1}
            max={500}
            value={data.classSize}
            onChange={(event) => updateData({ classSize: event.target.value })}
            placeholder="Example: 25"
            className="h-12"
          />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-base font-black text-[#071d4e]">Learning levels</h3>

        <p className="mt-1 text-sm text-slate-500">
          Select every level represented in the class.
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {learningLevels.map((option) => {
            const checked = data.learningLevels.includes(option.id);

            return (
              <label
                key={option.id}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                  checked
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}>
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleLearningLevel(option.id)}
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
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-base font-black text-[#071d4e]">
          Student needs and accommodations
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Select any needs that should influence the lesson design.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {studentNeeds.map((option) => {
            const checked = data.studentNeeds.includes(option.id);

            return (
              <label
                key={option.id}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                  checked
                    ? "border-blue-500 bg-blue-50 text-blue-800"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}>
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleStudentNeed(option.id)}
                />

                <span className="text-sm font-bold">{option.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
}
