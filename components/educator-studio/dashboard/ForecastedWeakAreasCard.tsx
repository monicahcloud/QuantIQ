import Link from "next/link";

const areas = [
  {
    topic: "No forecasts created",
    className: "—",
    score: "—",
    risk: "Not available",
    riskStyles: "bg-slate-100 text-slate-500",
  },
];

export default function ForecastedWeakAreasCard() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-black text-[#071d4e]">
          Forecasted Weak Areas
        </h2>

        <Link
          href="/educator-studio/dashboard/forecasts"
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-[#071d4e]">
          View All
        </Link>
      </div>

      <div className="mt-5 divide-y divide-slate-100">
        {areas.map((area) => (
          <div
            key={area.topic}
            className="grid grid-cols-[1.2fr_0.9fr_0.45fr_0.75fr] items-center gap-3 py-4 text-sm">
            <span className="font-bold text-slate-700">{area.topic}</span>

            <span className="text-xs font-semibold text-slate-500">
              {area.className}
            </span>

            <span className="font-black text-slate-600">{area.score}</span>

            <span
              className={`rounded-lg px-2 py-1 text-center text-[11px] font-black ${area.riskStyles}`}>
              {area.risk}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/educator-studio/dashboard/forecasts"
        className="mt-5 flex items-center justify-center rounded-xl bg-blue-50 px-4 py-3 text-sm font-black text-blue-700">
        Create Your First Forecast
      </Link>
    </article>
  );
}
