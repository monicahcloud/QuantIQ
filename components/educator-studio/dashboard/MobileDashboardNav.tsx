"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  Library,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/educator-studio/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Lesson Planner",
    href: "/educator-studio/dashboard/lesson-planner",
    icon: BookOpen,
  },
  {
    label: "Resources",
    href: "/educator-studio/dashboard/resources",
    icon: FileText,
  },
  {
    label: "Assessments",
    href: "/educator-studio/dashboard/assessments",
    icon: GraduationCap,
  },
  {
    label: "Forecasts",
    href: "/educator-studio/dashboard/forecasts",
    icon: BarChart3,
  },
  {
    label: "Classes",
    href: "/educator-studio/dashboard/classes",
    icon: Users,
  },
  {
    label: "Saved Resources",
    href: "/educator-studio/dashboard/library",
    icon: FolderOpen,
  },
  {
    label: "Curriculum",
    href: "/educator-studio/dashboard/curriculum",
    icon: CalendarDays,
  },
  {
    label: "Student Insights",
    href: "/educator-studio/dashboard/insights",
    icon: Library,
  },
  {
    label: "Settings",
    href: "/educator-studio/dashboard/settings",
    icon: Settings,
  },
];

export default function MobileDashboardNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close dashboard navigation"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
      />

      <aside className="relative h-full w-[86%] max-w-sm overflow-y-auto bg-white shadow-2xl">
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">
          <div className="relative h-11 w-36">
            <Image
              src="/images/quantiqlogo.png"
              alt="QuantIQ"
              fill
              sizes="144px"
              className="object-contain object-left"
            />
          </div>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/educator-studio/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-slate-600"
                }`}>
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="m-4 rounded-3xl bg-[#071d4e] p-5 text-white">
          <Sparkles className="h-6 w-6 text-blue-200" />

          <p className="mt-3 font-black">Nova AI Assistant</p>

          <p className="mt-2 text-sm leading-6 text-blue-100/75">
            Create a lesson, worksheet, assessment, or classroom activity.
          </p>

          <Link
            href="/educator-studio/dashboard/nova"
            onClick={onClose}
            className="mt-4 block rounded-xl bg-white px-4 py-3 text-center text-sm font-black text-[#071d4e]">
            Open Nova
          </Link>
        </div>
      </aside>
    </div>
  );
}
