import Link from "next/link";
import {
  BookOpen,
  Clock3,
  FileText,
  FolderOpen,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LessonsPage() {
  return (
    <div className="space-y-8">
      {/* Hero */}

      <section className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#071d4e] via-blue-800 to-violet-700 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.03em] text-white drop-shadow-sm sm:text-5xl">
              Lesson Planner
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/85">
              Create engaging AI-powered lessons, organize your teaching
              materials, and build differentiated instruction in minutes.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="rounded-2xl bg-white text-[#071d4e] hover:bg-slate-100">
            <Link href="/educator-studio/lessons/create">
              <Plus className="mr-2 h-5 w-5" />
              Create Lesson
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats */}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Lessons"
          value="0"
          icon={<BookOpen className="h-6 w-6" />}
        />

        <StatCard
          title="Drafts"
          value="0"
          icon={<FileText className="h-6 w-6" />}
        />

        <StatCard
          title="Templates"
          value="0"
          icon={<Sparkles className="h-6 w-6" />}
        />

        <StatCard
          title="Published"
          value="0"
          icon={<FolderOpen className="h-6 w-6" />}
        />
      </section>

      {/* Toolbar */}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input placeholder="Search lessons..." className="h-12 pl-11" />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline">All Lessons</Button>

            <Button variant="outline">Drafts</Button>

            <Button variant="outline">Templates</Button>

            <Button variant="outline">Archived</Button>
          </div>
        </div>
      </section>

      {/* Empty State */}

      <section className="rounded-[32px] border border-dashed border-slate-300 bg-white py-24 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <BookOpen className="h-10 w-10 text-blue-700" />
        </div>

        <h2 className="mt-6 text-2xl font-black text-[#071d4e]">
          No lessons yet
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-slate-500">
          Start building your lesson library with AI-powered lesson plans,
          worksheets, assessments, and differentiated instruction.
        </p>

        <Button asChild size="lg" className="mt-8 rounded-2xl">
          <Link href="/educator-studio/lessons/create">
            <Plus className="mr-2 h-5 w-5" />
            Create Your First Lesson
          </Link>
        </Button>
      </section>

      {/* Coming Soon */}

      <section className="grid gap-5 lg:grid-cols-3">
        <ComingSoonCard
          title="Lesson Templates"
          description="Save reusable lesson templates."
          icon={<Sparkles className="h-6 w-6" />}
        />

        <ComingSoonCard
          title="Calendar Planner"
          description="Schedule lessons across the school year."
          icon={<Clock3 className="h-6 w-6" />}
        />

        <ComingSoonCard
          title="AI Recommendations"
          description="Receive lesson suggestions based on your curriculum."
          icon={<BookOpen className="h-6 w-6" />}
        />
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>

          <p className="mt-2 text-4xl font-black text-[#071d4e]">{value}</p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 text-blue-700">{icon}</div>
      </div>
    </div>
  );
}

function ComingSoonCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-black text-[#071d4e]">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
