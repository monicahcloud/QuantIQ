"use client";

import type { ReactNode } from "react";

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

import type { LessonWizardData } from "./LessonWizard";

type Props = {
  data: LessonWizardData;
  updateData: (values: Partial<LessonWizardData>) => void;
};

const subjects = [
  "Mathematics",
  "English Language",
  "Science",
  "Social Studies",
  "Computer Science",
  "Religious Studies",
  "Health and Family Life",
  "Physical Education",
  "Art",
  "Music",
];

export default function LessonBasicInformation({ data, updateData }: Props) {
  return (
    <section>
      <h2 className="text-2xl font-black text-[#071d4e]">
        Basic lesson information
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        Enter the core details QuantIQ will use to structure and align the
        lesson.
      </p>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <Field label="Subject" required>
          <Select
            value={data.subject}
            onValueChange={(subject) => updateData({ subject })}>
            <SelectTrigger className="h-12 w-full">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>

            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Grade level" required>
          <Select
            value={data.gradeLevel}
            onValueChange={(gradeLevel) => updateData({ gradeLevel })}>
            <SelectTrigger className="h-12 w-full">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>

            <SelectContent>
              {Array.from({ length: 12 }, (_, index) => index + 1).map(
                (grade) => (
                  <SelectItem key={grade} value={`Grade ${grade}`}>
                    Grade {grade}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Topic" required>
          <Input
            value={data.topic}
            onChange={(event) => updateData({ topic: event.target.value })}
            placeholder="Example: Adding fractions"
            className="h-12"
          />
        </Field>

        <Field label="Lesson title" required>
          <Input
            value={data.title}
            onChange={(event) => updateData({ title: event.target.value })}
            placeholder="Example: Understanding Like Denominators"
            className="h-12"
          />
        </Field>

        <Field label="Lesson date">
          <Input
            type="date"
            value={data.lessonDate}
            onChange={(event) => updateData({ lessonDate: event.target.value })}
            className="h-12"
          />
        </Field>

        <Field label="Duration">
          <Select
            value={data.duration}
            onValueChange={(duration) => updateData({ duration })}>
            <SelectTrigger className="h-12 w-full">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
              <SelectItem value="75">75 minutes</SelectItem>
              <SelectItem value="90">90 minutes</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Curriculum">
          <Input
            value={data.curriculum}
            onChange={(event) => updateData({ curriculum: event.target.value })}
            placeholder="Example: Bahamas National Curriculum"
            className="h-12"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Standards or benchmarks">
            <Textarea
              value={data.standards}
              onChange={(event) =>
                updateData({ standards: event.target.value })
              }
              placeholder="Enter curriculum standards, benchmarks, or learning indicators..."
              rows={4}
            />
          </Field>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
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
    </div>
  );
}
