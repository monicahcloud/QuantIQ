"use client";

import {
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { LessonWizardData } from "../LessonWizard";

export default function LessonReview({ data }: { data: LessonWizardData }) {
  const objectives = data.learningObjectives.filter((item) => item.trim());
  const criteria = data.successCriteria.filter((item) => item.trim());

  return (
    <section className="space-y-7">
      <div>
        <h2 className="text-2xl font-black text-[#071d4e]">
          Review your lesson
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Confirm the information before QuantIQ generates your complete lesson
          plan and selected classroom resources.
        </p>
      </div>

      <ReviewCard
        icon={BookOpen}
        iconClassName="text-blue-700"
        title="Lesson overview">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Info label="Lesson title" value={data.title} />
          <Info label="Subject" value={data.subject} />
          <Info label="Grade level" value={data.gradeLevel} />
          <Info label="Topic" value={data.topic} />
          <Info label="Duration" value={`${data.duration} minutes`} />
          <Info label="Curriculum" value={data.curriculum} />
          <Info label="Lesson date" value={data.lessonDate} />
          <Info label="Assessment" value={data.assessmentType} />
          <Info label="Complexity" value={data.complexity} />
        </div>

        {data.standards && (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              Standards
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {data.standards}
            </p>
          </div>
        )}
      </ReviewCard>

      <ReviewCard
        icon={Users}
        iconClassName="text-orange-600"
        title="Student information">
        <div className="grid gap-6 md:grid-cols-2">
          <Info label="Class" value={data.className} />
          <Info label="Class size" value={data.classSize} />
        </div>

        <ReviewBadges
          title="Learning levels"
          items={data.learningLevels}
          emptyLabel="No learning levels selected"
        />

        <ReviewBadges
          title="Student needs"
          items={data.studentNeeds}
          emptyLabel="No additional accommodations selected"
        />
      </ReviewCard>

      <ReviewCard
        icon={GraduationCap}
        iconClassName="text-emerald-600"
        title="Learning objectives">
        <div className="space-y-3">
          {objectives.map((objective, index) => (
            <div
              key={`${objective}-${index}`}
              className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-sm leading-6 text-slate-700">{objective}</p>
            </div>
          ))}
        </div>
      </ReviewCard>

      <ReviewCard
        icon={ClipboardList}
        iconClassName="text-blue-700"
        title="Success criteria">
        <div className="space-y-3">
          {criteria.map((criterion, index) => (
            <div
              key={`${criterion}-${index}`}
              className="rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-700">
              {criterion}
            </div>
          ))}
        </div>
      </ReviewCard>

      <ReviewCard
        icon={Brain}
        iconClassName="text-violet-600"
        title="AI generation settings">
        <ReviewBadges
          title="Teaching styles"
          items={data.teachingStyles}
          emptyLabel="No teaching style selected"
        />

        <ReviewBadges
          title="Resources to generate"
          items={data.generateResources}
          emptyLabel="Lesson plan only"
          badgeClassName="bg-violet-700 text-white"
        />
      </ReviewCard>

      <div className="rounded-3xl bg-gradient-to-r from-[#071d4e] to-blue-700 p-6 text-white">
        <div className="flex gap-4">
          <Sparkles className="mt-1 h-7 w-7 shrink-0 text-blue-200" />

          <div>
            <h3 className="text-lg font-black">Ready to generate</h3>

            <p className="mt-2 text-sm leading-7 text-blue-100">
              QuantIQ will create a complete lesson with instructional
              activities, differentiation strategies, assessment guidance, and
              the supporting resources selected above.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({
  icon: Icon,
  iconClassName,
  title,
  children,
}: {
  icon: React.ElementType;
  iconClassName: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <Icon className={`h-6 w-6 ${iconClassName}`} />
        <h3 className="text-lg font-black text-[#071d4e]">{title}</h3>
      </div>

      <Separator className="my-5" />

      {children}
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold capitalize text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
}

function ReviewBadges({
  title,
  items,
  emptyLabel,
  badgeClassName,
}: {
  title: string;
  items: string[];
  emptyLabel: string;
  badgeClassName?: string;
}) {
  return (
    <div className="mt-6 first:mt-0">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <Badge
              key={item}
              className={badgeClassName}
              variant={badgeClassName ? "default" : "secondary"}>
              {item.replaceAll("-", " ")}
            </Badge>
          ))
        ) : (
          <Badge variant="secondary">{emptyLabel}</Badge>
        )}
      </div>
    </div>
  );
}
