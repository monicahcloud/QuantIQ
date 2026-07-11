"use client";

import {
  Brain,
  Check,
  ClipboardList,
  FileText,
  GraduationCap,
  Layers3,
  MonitorPlay,
  Sparkles,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type { LessonWizardData } from "../LessonWizard";

type Props = {
  data: LessonWizardData;
  updateData: (values: Partial<LessonWizardData>) => void;
};

const teachingStyles = [
  {
    id: "direct-instruction",
    label: "Direct Instruction",
    description: "Explicit explanation, modeling, and guided practice.",
    icon: GraduationCap,
  },
  {
    id: "inquiry-based",
    label: "Inquiry-Based",
    description: "Students investigate, question, and discover.",
    icon: Brain,
  },
  {
    id: "cooperative-learning",
    label: "Cooperative Learning",
    description: "Structured partner and group collaboration.",
    icon: Layers3,
  },
  {
    id: "project-based",
    label: "Project-Based",
    description: "Learning through authentic tasks and projects.",
    icon: ClipboardList,
  },
  {
    id: "hands-on",
    label: "Hands-On",
    description: "Interactive and practical classroom activities.",
    icon: Sparkles,
  },
  {
    id: "blended-learning",
    label: "Blended Learning",
    description: "Teacher instruction combined with digital learning.",
    icon: MonitorPlay,
  },
];

const complexityOptions = [
  {
    id: "simple",
    label: "Simple",
    description: "Clear pacing with strong scaffolding.",
  },
  {
    id: "standard",
    label: "Standard",
    description: "Balanced rigor, support, and practice.",
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Higher-order thinking and deeper application.",
  },
];

const resourceOptions = [
  {
    id: "worksheet",
    label: "Worksheet",
    description: "Student practice activities.",
    icon: FileText,
  },
  {
    id: "quiz",
    label: "Quiz",
    description: "Questions and an answer key.",
    icon: ClipboardList,
  },
  {
    id: "slides",
    label: "Presentation Slides",
    description: "A teacher-ready presentation outline.",
    icon: MonitorPlay,
  },
  {
    id: "exit-ticket",
    label: "Exit Ticket",
    description: "A quick end-of-lesson check.",
    icon: Check,
  },
  {
    id: "homework",
    label: "Homework",
    description: "Independent follow-up practice.",
    icon: GraduationCap,
  },
  {
    id: "parent-summary",
    label: "Parent Summary",
    description: "A family-friendly lesson overview.",
    icon: FileText,
  },
];

export default function LessonAiOptions({ data, updateData }: Props) {
  function toggleTeachingStyle(value: string) {
    updateData({
      teachingStyles: data.teachingStyles.includes(value)
        ? data.teachingStyles.filter((item) => item !== value)
        : [...data.teachingStyles, value],
    });
  }

  function toggleResource(value: string) {
    updateData({
      generateResources: data.generateResources.includes(value)
        ? data.generateResources.filter((item) => item !== value)
        : [...data.generateResources, value],
    });
  }

  return (
    <section>
      <h2 className="text-2xl font-black text-[#071d4e]">
        Customize the AI generation
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        Choose the instructional approach, complexity, and supporting resources
        QuantIQ should include.
      </p>

      <div className="mt-8 space-y-9">
        <div>
          <Label className="text-base font-black text-[#071d4e]">
            Teaching style
          </Label>

          <p className="mt-1 text-sm text-slate-500">
            Select one or more instructional approaches.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {teachingStyles.map((option) => {
              const Icon = option.icon;
              const checked = data.teachingStyles.includes(option.id);

              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                    checked
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}>
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      checked
                        ? "bg-blue-700 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-black text-slate-800">
                        {option.label}
                      </p>

                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleTeachingStyle(option.id)}
                      />
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {option.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <Label className="text-base font-black text-[#071d4e]">
            Lesson complexity
          </Label>

          <p className="mt-1 text-sm text-slate-500">
            Choose the overall rigor and instructional depth.
          </p>

          <RadioGroup
            value={data.complexity}
            onValueChange={(complexity) => updateData({ complexity })}
            className="mt-4 grid gap-4 md:grid-cols-3">
            {complexityOptions.map((option) => {
              const selected = data.complexity === option.id;

              return (
                <Label
                  key={option.id}
                  htmlFor={`complexity-${option.id}`}
                  className={`cursor-pointer rounded-2xl border p-5 transition ${
                    selected
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}>
                  <div className="flex items-start gap-3">
                    <RadioGroupItem
                      id={`complexity-${option.id}`}
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
                  </div>
                </Label>
              );
            })}
          </RadioGroup>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <Label className="text-base font-black text-[#071d4e]">
            Supporting resources
          </Label>

          <p className="mt-1 text-sm text-slate-500">
            Select the additional resources to create with the lesson.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resourceOptions.map((option) => {
              const Icon = option.icon;
              const checked = data.generateResources.includes(option.id);

              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                    checked
                      ? "border-violet-500 bg-violet-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}>
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      checked
                        ? "bg-violet-700 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-black text-slate-800">
                        {option.label}
                      </p>

                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleResource(option.id)}
                      />
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {option.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
