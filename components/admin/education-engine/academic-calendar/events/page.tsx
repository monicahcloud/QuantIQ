import { Sparkles } from "lucide-react";

export default function AcademicCalendarHolidaysPage() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
      <Sparkles className="mx-auto h-10 w-10 text-slate-300" />

      <h2 className="mt-4 text-xl font-black text-[#071d4e]">
        Holidays and Breaks
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Manage public holidays, school breaks, professional days, and closures.
      </p>
    </div>
  );
}
