"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CalendarRange,
  Clock3,
  Settings,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  {
    label: "Overview",
    href: "/admin/education-engine/academic-calendar",
    icon: CalendarRange,
  },
  {
    label: "Terms",
    href: "/admin/education-engine/academic-calendar/terms",
    icon: CalendarDays,
  },
  {
    label: "Weeks",
    href: "/admin/education-engine/academic-calendar/weeks",
    icon: Clock3,
  },
  {
    label: "Events",
    href: "/admin/education-engine/academic-calendar/events",
    icon: Sparkles,
  },
  {
    label: "Settings",
    href: "/admin/education-engine/academic-calendar/settings",
    icon: Settings,
  },
];

export default function AcademicCalendarNav() {
  const pathname = usePathname();

  return (
    <nav className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex min-w-max gap-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/admin/education-engine/academic-calendar"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition",
                isActive
                  ? "bg-blue-700 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              )}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
