import { CalendarDays, ChevronDown } from "lucide-react";

type DashboardWelcomeProps = {
  firstName: string;
};

export default function DashboardWelcome({ firstName }: DashboardWelcomeProps) {
  return (
    <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-black tracking-[-0.03em] text-[#071d4e] sm:text-4xl">
          Welcome back, {firstName}! 👋
        </h1>

        <p className="mt-2 text-base text-slate-500">
          Here&apos;s what&apos;s happening in your classroom today.
        </p>
      </div>

      <button
        type="button"
        className="inline-flex w-fit items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm">
        <CalendarDays className="h-4 w-4" />
        This Week
        <ChevronDown className="h-4 w-4" />
      </button>
    </section>
  );
}
