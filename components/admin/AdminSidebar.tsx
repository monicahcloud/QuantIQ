"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenCheck,
  Bot,
  Building2,
  CalendarDays,
  Files,
  Gauge,
  Globe2,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  School,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const primaryNavigation = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Education Engine",
    href: "/admin/education-engine",
    icon: Gauge,
  },
  {
    label: "Curriculum",
    href: "/admin/curriculum",
    icon: LibraryBig,
  },
  {
    label: "Pacing Guides",
    href: "/admin/pacing-guides",
    icon: CalendarDays,
  },
  {
    label: "Resources",
    href: "/admin/resources",
    icon: Files,
  },
];

const managementNavigation = [
  {
    label: "Organizations",
    href: "/admin/organizations",
    icon: Building2,
  },
  {
    label: "Schools",
    href: "/admin/schools",
    icon: School,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "AI Prompts",
    href: "/admin/prompt-templates",
    icon: Bot,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
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

          <div className="border-l border-slate-200 pl-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
              Admin
            </p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <SidebarLabel>Platform</SidebarLabel>

        <nav className="mt-3 space-y-1">
          {primaryNavigation.map((item) => (
            <SidebarLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <SidebarLabel className="mt-8">Management</SidebarLabel>

        <nav className="mt-3 space-y-1">
          {managementNavigation.map((item) => (
            <SidebarLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="mt-8 rounded-3xl bg-gradient-to-br from-[#071d4e] to-blue-700 p-5 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
            <BookOpenCheck className="h-5 w-5" />
          </div>

          <p className="mt-4 font-black">Education Engine</p>

          <p className="mt-2 text-sm leading-6 text-blue-100/80">
            Manage the countries, grades, subjects, calendars, curricula, and
            pacing information that power QuantIQ.
          </p>

          <Link
            href="/admin/education-engine"
            className="mt-5 flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-black text-[#071d4e]">
            Open Engine
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-200 p-4">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
}

type NavigationItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

function SidebarLink({
  item,
  pathname,
}: {
  item: NavigationItem;
  pathname: string;
}) {
  const Icon = item.icon;

  const active =
    item.href === "/admin/dashboard"
      ? pathname === item.href
      : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
        active
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
      )}>
      <Icon className="h-5 w-5" />
      {item.label}
    </Link>
  );
}

function SidebarLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "px-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400",
        className,
      )}>
      {children}
    </p>
  );
}
