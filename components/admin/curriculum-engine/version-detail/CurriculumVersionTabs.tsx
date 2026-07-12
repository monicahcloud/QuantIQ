"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type CurriculumVersionTabsProps = {
  versionId: string;
};

const tabs = [
  {
    label: "Overview",
    suffix: "",
  },
  {
    label: "Documents",
    suffix: "/documents",
  },
  {
    label: "AI Imports",
    suffix: "/imports",
  },
  {
    label: "Frameworks",
    suffix: "/frameworks",
  },
  {
    label: "Packages",
    suffix: "/packages",
  },
  {
    label: "Curriculum Tree",
    suffix: "/tree",
  },
];

export default function CurriculumVersionTabs({
  versionId,
}: CurriculumVersionTabsProps) {
  const pathname = usePathname();
  const basePath = `/admin/curriculum-engine/versions/${versionId}`;

  return (
    <nav className="overflow-x-auto border-b border-slate-200">
      <div className="flex min-w-max gap-1">
        {tabs.map((tab) => {
          const href = `${basePath}${tab.suffix}`;

          const active =
            tab.suffix === ""
              ? pathname === basePath
              : pathname.startsWith(href);

          return (
            <Link
              key={tab.label}
              href={href}
              className={cn(
                "border-b-2 px-4 py-3 text-sm font-bold transition",
                active
                  ? "border-blue-700 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-900",
              )}>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
