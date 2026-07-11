import {
  BarChart3,
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  FileText,
  ListChecks,
} from "lucide-react";
import Link from "next/link";

const actions = [
  {
    title: "Create Lesson Plan",
    description: "AI-powered lesson planning",
    href: "/educator-studio/dashboard/lesson-planner",
    icon: BookOpen,
    iconStyles: "bg-blue-100 text-blue-700",
  },
  {
    title: "Create Forecast",
    description: "Predict student performance",
    href: "/educator-studio/dashboard/forecasts",
    icon: BarChart3,
    iconStyles: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Generate Worksheet",
    description: "Worksheets and activities",
    href: "/educator-studio/dashboard/resources?type=worksheet",
    icon: FileText,
    iconStyles: "bg-violet-100 text-violet-700",
  },
  {
    title: "Generate Quiz",
    description: "Quizzes and assessments",
    href: "/educator-studio/dashboard/assessments",
    icon: ClipboardCheck,
    iconStyles: "bg-orange-100 text-orange-700",
  },
  {
    title: "Exit Ticket",
    description: "Create quick exit tickets",
    href: "/educator-studio/dashboard/resources?type=exit-ticket",
    icon: ListChecks,
    iconStyles: "bg-cyan-100 text-cyan-700",
  },
];

export default function DashboardQuickActions() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-[#071d4e]">Quick Actions</h2>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[repeat(5,minmax(0,1fr))_110px]">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex min-h-24 items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:shadow-sm">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.iconStyles}`}>
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-black text-[#071d4e]">
                  {action.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}

        <Link
          href="/educator-studio/dashboard/resources"
          className="flex min-h-24 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-center text-sm font-black text-[#071d4e] transition hover:border-blue-300 hover:text-blue-700">
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
