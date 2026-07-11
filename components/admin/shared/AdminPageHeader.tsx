import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  backHref?: string;
  actions?: ReactNode;
};

export default function AdminPageHeader({
  eyebrow = "QuantIQ Administration",
  title,
  description,
  backHref,
  actions,
}: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex items-start gap-4">
        {backHref && (
          <Button
            asChild
            variant="outline"
            size="icon"
            className="mt-1 shrink-0 rounded-xl">
            <Link href={backHref} aria-label={`Return from ${title}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        )}

        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
            {eyebrow}
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#071d4e] sm:text-4xl">
            {title}
          </h1>

          {description && (
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>

      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
}
