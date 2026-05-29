import Image from "next/image";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-4">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#dbe7f3] bg-white shadow-[0_25px_80px_rgba(2,22,49,0.08)]">
          {/* BACKGROUND EFFECTS */}
          <div className="absolute inset-0 z-0 bg-[linear-gradient(135deg,#ffffff_0%,#f5f9ff_45%,#eef7ff_100%)]" />

          <div className="absolute right-[-120px] top-[-100px] z-0 h-[320px] w-[320px] rounded-full bg-quantiq-sky/10 blur-3xl" />

          <div className="absolute left-[-100px] bottom-[-120px] z-0 h-[260px] w-[260px] rounded-full bg-quantiq-lime/10 blur-3xl" />

          {/* DOT GRID */}
          <div className="absolute right-[12%] top-[18%] z-0 h-[220px] w-[220px] opacity-20">
            <div className="h-full w-full bg-[radial-gradient(circle,rgba(32,196,199,1)_1.3px,transparent_1.3px)] bg-[size:20px_20px]" />
          </div>

          <div className="relative z-10 grid items-center gap-10 px-8 py-10 lg:grid-cols-[1fr_320px] lg:px-14 lg:py-12">
            {/* LEFT CONTENT */}
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-quantiq-sky">
                Ready To Get Started?
              </p>

              <h2 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-[#041f3d] md:text-5xl">
                Let’s build a path to{" "}
                <span className="text-quantiq-sky">success</span> together.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#4c5d73] md:text-lg">
                Schedule a consultation to learn how QuantIQ can provide
                personalized intervention, academic support, and structured
                learning strategies for your student.
              </p>

              {/* CTA BUTTONS */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button className="h-14 rounded-full bg-quantiq-sky px-8 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg shadow-quantiq-sky/20 transition-all hover:bg-quantiq-sky/90">
                  Book a Consultation
                  <CalendarDays className="ml-2 size-5" />
                </Button>

                <Button
                  variant="outline"
                  className="h-14 rounded-full border-2 border-[#041f3d]/10 bg-white px-8 text-sm font-bold uppercase tracking-wide text-[#041f3d] hover:bg-[#041f3d] hover:text-white">
                  Learn More
                </Button>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative mx-auto w-full max-w-[320px]">
              {/* glow */}
              <div className="absolute inset-0 rounded-[2rem] bg-quantiq-sky/20 blur-2xl" />

              {/* image card */}
              <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-white shadow-2xl">
                <Image
                  src="/images/little-girl.png"
                  alt="Student smiling while learning"
                  width={500}
                  height={500}
                  className="h-[320px] w-full object-cover"
                />

                {/* floating badge */}
                <div className="absolute bottom-5 left-5 rounded-2xl bg-[#041f3d]/90 px-5 py-4 text-white shadow-xl backdrop-blur-md">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-quantiq-sky">
                    Student Growth
                  </p>

                  <p className="mt-1 text-lg font-bold leading-tight">
                    Every learner deserves the chance to thrive.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ACCENT LINE */}
          <div className="absolute bottom-0 left-0 h-2 w-full bg-[linear-gradient(90deg,#20c4c7_0%,#183c90_45%,#20c4c7_100%)]" />
        </div>
      </div>
    </section>
  );
}
