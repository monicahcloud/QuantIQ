import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type QuickActionCardProps = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
};

export default function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-blue-700 group-hover:text-white">
          <Icon className="h-6 w-6" />
        </div>

        <ArrowUpRight className="h-5 w-5 text-slate-300 transition group-hover:text-blue-700" />
      </div>

      <h3 className="mt-6 text-lg font-black text-[#071d4e]">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </Link>
  );
}
