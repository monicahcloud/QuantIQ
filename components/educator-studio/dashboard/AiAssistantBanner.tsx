import { ArrowRight, Bot, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AiAssistantBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#061b4f] to-[#073b8f] px-6 py-7 text-white shadow-sm">
      <div className="absolute right-20 top-1/2 hidden h-24 w-24 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 xl:flex">
        <Bot className="h-14 w-14 text-cyan-200" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black">
              Try the new AI Classroom Assistant
            </h2>

            <span className="rounded-full bg-violet-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em]">
              Beta
            </span>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100/80">
            Get real-time suggestions, differentiate instruction, generate
            lessons, and personalize learning for every student.
          </p>
        </div>

        <Link
          href="/educator-studio/dashboard/nova"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20">
          <Sparkles className="h-4 w-4" />
          Launch Assistant
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
