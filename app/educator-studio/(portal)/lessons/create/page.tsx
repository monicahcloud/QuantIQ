import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import LessonWizard from "@/components/educator-studio/lessons/LessonWizard";

export const metadata: Metadata = {
  title: "Create Lesson",
  description:
    "Create a detailed, curriculum-aligned lesson with QuantIQ Educator Studio.",
};

export default function CreateLessonPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="mt-1 shrink-0 rounded-xl">
            <Link
              href="/educator-studio/lessons"
              aria-label="Return to lesson planner">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-blue-700">
              <BookOpen className="h-4 w-4" />
              Lesson Planner
            </div>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#071d4e] sm:text-4xl">
              Create a New Lesson
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Complete the guided steps to create a detailed, curriculum-aligned
              lesson and supporting classroom resources.
            </p>
          </div>
        </div>

        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/educator-studio/lessons">View My Lessons</Link>
        </Button>
      </div>

      <LessonWizard />
    </div>
  );
}
