import { ChevronDown } from "lucide-react";
import Link from "next/link";

const classes = [
  {
    name: "No classes yet",
    score: "—",
    trend: "—",
    risk: "—",
  },
];

export default function ClassPerformanceCard() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-black text-[#071d4e]">
          Class Performance Overview
        </h2>

        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">
          All Classes
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-[1.4fr_0.7fr_0.7fr_0.8fr] gap-3 border-b border-slate-200 pb-3 text-xs font-bold text-slate-500">
        <span>Class</span>
        <span>Avg. Score</span>
        <span>Trend</span>
        <span>At Risk</span>
      </div>

      <div className="divide-y divide-slate-100">
        {classes.map((item) => (
          <div
            key={item.name}
            className="grid grid-cols-[1.4fr_0.7fr_0.7fr_0.8fr] gap-3 py-5 text-sm">
            <span className="font-bold text-slate-700">{item.name}</span>

            <span className="font-bold text-slate-500">{item.score}</span>

            <span className="font-bold text-slate-500">{item.trend}</span>

            <span className="font-bold text-slate-500">{item.risk}</span>
          </div>
        ))}
      </div>

      <Link
        href="/educator-studio/dashboard/classes"
        className="mt-5 flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-[#071d4e] transition hover:border-blue-300 hover:text-blue-700">
        View All Class Insights
      </Link>
    </article>
  );
}
