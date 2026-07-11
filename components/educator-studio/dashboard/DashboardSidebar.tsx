"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CircleHelp,
  CreditCard,
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  Library,
  MessageSquareText,
  Plug,
  Settings,
  Sparkles,
  UserCog,
  Users,
} from "lucide-react";

const primaryNavigation = [
  {
    label: "Dashboard",
    href: "/educator-studio/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Lesson Planner",
    href: "/educator-studio/lessons",
    icon: BookOpen,
  },
  {
    label: "Resource Generator",
    href: "/educator-studio/resources",
    icon: FileText,
  },
  {
    label: "Assessments",
    href: "/educator-studio/assessments",
    icon: GraduationCap,
  },
  {
    label: "Forecasts",
    href: "/educator-studio/forecasts",
    icon: BarChart3,
  },
];

const workspaceNavigation = [
  {
    label: "Classes",
    href: "/educator-studio/classes",
    icon: Users,
  },
  {
    label: "Saved Resources",
    href: "/educator-studio/library",
    icon: FolderOpen,
  },
  {
    label: "Curriculum Planner",
    href: "/educator-studio/curriculum",
    icon: CalendarDays,
  },
  {
    label: "Student Insights",
    href: "/educator-studio/insights",
    icon: Library,
  },
];

const accountNavigation = [
  {
    label: "Teacher Setup",
    href: "/educator-studio/dashboard/settings/profile",
    icon: UserCog,
    badge: "New",
  },
  {
    label: "Integrations",
    href: "/educator-studio/dashboard/integrations",
    icon: Plug,
  },
  {
    label: "Help & Support",
    href: "/educator-studio/dashboard/support",
    icon: CircleHelp,
  },
  {
    label: "Settings",
    href: "/educator-studio/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const teacherName = user?.fullName || user?.firstName || "Educator";

  const teacherRole =
    typeof user?.publicMetadata?.teacherRole === "string"
      ? user.publicMetadata.teacherRole
      : "Educator";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <Link
          href="/educator-studio/dashboard"
          className="flex items-center gap-3">
          <div className="relative h-11 w-36">
            <Image
              src="/images/quantiqlogo.png"
              alt="QuantIQ"
              fill
              priority
              sizes="144px"
              className="object-contain object-left"
            />
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <SidebarLabel label="Educator tools" />

        <nav className="mt-3 space-y-1">
          {primaryNavigation.map((item) => (
            <SidebarLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <SidebarLabel label="Workspace" className="mt-8" />

        <nav className="mt-3 space-y-1">
          {workspaceNavigation.map((item) => (
            <SidebarLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <SidebarLabel label="Account" className="mt-8" />

        <nav className="mt-3 space-y-1">
          {accountNavigation.map((item) => (
            <SidebarLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="mt-8 rounded-3xl bg-gradient-to-br from-[#071d4e] to-blue-700 p-5 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
            <Sparkles className="h-5 w-5" />
          </div>

          <p className="mt-4 font-black">Ask Nova</p>

          <p className="mt-2 text-sm leading-6 text-blue-100/80">
            Create lessons, assessments, activities, and teaching resources with
            your AI assistant.
          </p>

          <Link
            href="/educator-studio/dashboard/nova"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-[#071d4e]">
            <MessageSquareText className="h-4 w-4" />
            Open Nova
          </Link>
        </div>
      </div>

      <div className="space-y-3 border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
            }}
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-[#071d4e]">
              {teacherName}
            </p>

            <p className="mt-1 truncate text-xs font-semibold text-slate-500">
              {teacherRole}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
              <CreditCard className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-black text-[#071d4e]">
                Professional Plan
              </p>

              <p className="mt-1 text-xs font-semibold text-blue-700">
                14-day trial active
              </p>
            </div>
          </div>

          <Link
            href="/educator-studio/dashboard/billing"
            className="mt-4 flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-[#071d4e] transition hover:border-blue-300 hover:text-blue-700">
            Manage Subscription
          </Link>
        </div>
      </div>
    </aside>
  );
}

type NavigationItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
};

function SidebarLink({
  item,
  pathname,
}: {
  item: NavigationItem;
  pathname: string;
}) {
  const Icon = item.icon;

  const isActive =
    item.href === "/educator-studio/dashboard"
      ? pathname === item.href
      : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
        isActive
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      }`}>
      <Icon className="h-5 w-5 shrink-0" />

      <span className="min-w-0 flex-1 truncate">{item.label}</span>

      {item.badge && (
        <span
          className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] ${
            isActive
              ? "bg-blue-100 text-blue-700"
              : "bg-violet-100 text-violet-700"
          }`}>
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function SidebarLabel({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <p
      className={`px-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 ${className}`}>
      {label}
    </p>
  );
}
