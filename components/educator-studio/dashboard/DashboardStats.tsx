import { BarChart3, BookOpen, FileText, Users } from "lucide-react";

const stats = [
  {
    label: "Lessons Created",
    value: "0",
    detail: "+0 this week",
    icon: BookOpen,
    iconStyles: "bg-blue-100 text-blue-700",
    detailStyles: "text-blue-700",
  },
  {
    label: "Forecasted Weak Areas",
    value: "0",
    detail: "No forecasts yet",
    icon: BarChart3,
    iconStyles: "bg-emerald-100 text-emerald-700",
    detailStyles: "text-emerald-700",
  },
  {
    label: "Classes",
    value: "0",
    detail: "0 students",
    icon: Users,
    iconStyles: "bg-orange-100 text-orange-700",
    detailStyles: "text-orange-700",
  },
  {
    label: "Resources Generated",
    value: "0",
    detail: "+0 this week",
    icon: FileText,
    iconStyles: "bg-violet-100 text-violet-700",
    detailStyles: "text-violet-700",
  },
];

export default function DashboardStats() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${stat.iconStyles}`}>
                <Icon className="h-7 w-7" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-500">{stat.label}</p>

                <p className="mt-1 text-3xl font-black tracking-[-0.04em] text-[#071d4e]">
                  {stat.value}
                </p>

                <p className={`mt-1 text-xs font-bold ${stat.detailStyles}`}>
                  {stat.detail}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
