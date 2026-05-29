import Image from "next/image";
import { ArrowRight, Star, Target, User } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#021631] text-white">
      {/* BACKGROUND BASE */}
      <div className="absolute inset-0 z-0 bg-[#041f3d]" />

      {/* IMAGE */}
      <div className="absolute inset-y-0 right-0 z-[1]  w-[52%] overflow-hidden rounded-bl-[220px] xl:block 2xl:w-[56%]">
        <Image
          src="/images/student.png"
          alt="Student learning"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#041f3d_0%,rgba(4,31,61,0.78)_16%,rgba(4,31,61,0.35)_31%,rgba(4,31,61,0)_52%)]" />
      </div>

      {/* DOT GRID */}
      <div className="absolute left-[34%] top-[20%] z-[2] h-[520px] w-[520px] opacity-45">
        <div className="h-full w-full bg-[radial-gradient(circle,rgba(32,196,199,1)_1.6px,transparent_1.6px)] bg-[size:22px_22px]" />
      </div>

      {/* GLOW EFFECT */}
      <div className="absolute inset-0 z-[3] bg-[radial-gradient(circle_at_18%_40%,rgba(32,196,199,0.14),transparent_34%)]" />

      {/* MAIN DARK FADE */}
      <div className="absolute inset-0 z-[4] bg-[linear-gradient(90deg,#041f3d_0%,#041f3d_42%,rgba(4,31,61,0.62)_57%,rgba(4,31,61,0)_76%)]" />

      {/* image going off-page */}
      {/* <div className="absolute right-[-90px] top-0 z-0 h-[650px] w-[58%] overflow-hidden rounded-bl-[260px]">
        <Image
          src="/images/student.png"
          alt="Student learning"
          fill
          priority
          className="object-cover object-center"
        /> 
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#041f3d_0%,rgba(4,31,61,0.78)_16%,rgba(4,31,61,0.35)_31%,rgba(4,31,61,0)_52%)]" />
      </div>*/}

      {/* content */}
      <div className="relative z-40 flex min-h-[760px] w-full items-center px-6 pb-28 pt-24 sm:px-10 lg:px-16 xl:min-h-[900px] xl:px-24 2xl:px-32">
        <div className="w-full max-w-[620px] xl:max-w-[920px]">
          <h1 className="text-6xl font-black leading-[0.95] tracking-tight text-white md:text-7xl lg:text-[92px]">
            Built for the <br />
            Way Students <br />
            <span className="text-quantiq-sky">Learn.</span>
          </h1>

          <p className="mt-7 max-w-[520px] text-xl leading-relaxed text-white/85">
            Empowering students who learn differently through individualized
            education, targeted intervention, and innovative support systems.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Button className="h-16 rounded-2xl bg-quantiq-sky px-9 text-lg font-extrabold uppercase tracking-wide text-white shadow-xl shadow-quantiq-sky/30 hover:bg-quantiq-sky/90">
              Our Services <ArrowRight className="ml-2 size-5" />
            </Button>

            <Button
              variant="outline"
              className="h-16 rounded-2xl border-2 border-white/80 bg-transparent px-9 text-lg font-extrabold uppercase tracking-wide text-white hover:bg-white hover:text-[#041f3d]">
              Learn More About Us
            </Button>
          </div>
          <div className="mt-12 w-full xl:w-[920px]">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-12">
              {/* CARD 1 */}
              <div className="group flex items-center gap-5 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:border-quantiq-sky/40 hover:bg-white/10 xl:bg-transparent xl:p-0 xl:pr-8 xl:hover:bg-transparent">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-quantiq-sky/10 ring-1 ring-quantiq-sky/20">
                  <User className="size-8 text-quantiq-sky" />
                </div>

                <div>
                  <p className="md:hidden text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
                    Core Focus
                  </p>

                  <h3 className="mt-2 text-base font-extrabold uppercase leading-snug text-white 2xl:text-lg">
                    Individualized Learning
                  </h3>
                </div>
              </div>

              {/* CARD 2 */}
              <div className="group flex items-center gap-5 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:border-quantiq-sky/40 hover:bg-white/10 xl:bg-transparent xl:p-0 xl:pr-8 xl:hover:bg-transparent">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-quantiq-sky/10 ring-1 ring-quantiq-sky/20">
                  <Target className="size-8 text-quantiq-sky" />
                </div>

                <div>
                  <p className="md:hidden text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
                    Strategic Support
                  </p>

                  <h3 className="mt-2 text-base font-extrabold uppercase leading-snug text-white 2xl:text-lg">
                    Targeted Intervention
                  </h3>
                </div>
              </div>

              {/* CARD 3 */}
              <div className="group flex items-center gap-5 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:border-quantiq-sky/40 hover:bg-white/10 xl:bg-transparent xl:p-0 xl:pr-8 xl:hover:bg-transparent">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-quantiq-sky/10 ring-1 ring-quantiq-sky/20">
                  <Star className="size-8 text-quantiq-sky" />
                </div>

                <div>
                  <p className=" md:hidden text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
                    Long-Term Growth
                  </p>

                  <h3 className="mt-2 text-base font-extrabold uppercase leading-snug text-white 2xl:text-lg">
                    Student Success
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* curved vector wave lines */}
      <svg
        className="pointer-events-none absolute bottom-[-40px] left-0 z-20 h-[220px] w-full"
        viewBox="0 0 1600 220"
        preserveAspectRatio="none">
        <defs>
          {/* DARK NAVY GRADIENT */}
          <linearGradient id="navyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#021631" />
            <stop offset="45%" stopColor="#082b57" />
            <stop offset="100%" stopColor="#20c4c7" />
          </linearGradient>
        </defs>

        {/* MAIN WHITE CURVE */}
        <path
          d="M0 80 C360 170 920 190 1600 20 L1600 220 L0 220 Z"
          fill="white"
        />

        {/* GRADIENT WAVE */}
        <path
          d="
      M0 74
      C360 158 930 175 1600 12
      L1600 32
      C930 192 360 176 0 92
      Z
    "
          fill="url(#navyGradient)"
        />

        {/* CYAN WAVE */}
        <path
          d="
      M0 92
      C360 176 930 192 1600 30
      L1600 42
      C930 205 360 188 0 104
      Z
    "
          fill="#20c4c7"
        />
      </svg>
    </section>
  );
}
