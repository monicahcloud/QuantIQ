import { impactItems } from "@/app/data/site";

export function Impact() {
  return (
    <section className="relative overflow-hidden bg-[#041f3d] px-6 py-24 text-white">
      {/* background */}
      <div className="absolute inset-0 z-0 bg-[#041f3d]" />

      <div className="absolute left-[-12%] top-[-30%] z-[1] h-[520px] w-[520px] rounded-full bg-quantiq-sky/20 blur-3xl" />

      <div className="absolute right-[-10%] bottom-[-40%] z-[1] h-[520px] w-[520px] rounded-full bg-quantiq-lime/10 blur-3xl" />

      <div className="absolute right-[8%] top-[12%] z-[1] h-[420px] w-[420px] opacity-25">
        <div className="h-full w-full bg-[radial-gradient(circle,rgba(32,196,199,1)_1.4px,transparent_1.4px)] bg-[size:22px_22px]" />
      </div>

      <div className="absolute inset-0 z-[2] bg-[linear-gradient(135deg,#041f3d_0%,#061f3f_48%,rgba(32,196,199,0.08)_100%)]" />

      {/* content */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-quantiq-sky">
            Making An Impact
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-6xl">
            Measurable support for{" "}
            <span className="text-quantiq-sky">meaningful growth.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            QuantIQ combines individualized learning, targeted intervention, and
            data-informed progress tracking to help students build confidence
            and long-term academic success.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {impactItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-black/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-quantiq-sky/40 hover:bg-white/[0.09]">
                {/* number */}
                <span className="absolute right-6 top-5 text-5xl font-black leading-none text-white/[0.04]">
                  0{index + 1}
                </span>

                {/* icon */}
                <div className="flex size-16 items-center justify-center rounded-2xl bg-quantiq-sky/10 ring-1 ring-quantiq-sky/25 transition-all duration-300 group-hover:bg-quantiq-sky/20">
                  <Icon className="size-8 text-quantiq-sky" />
                </div>

                <h3 className="mt-7 text-xl font-extrabold leading-tight text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  {item.text}
                </p>

                {/* bottom accent */}
                <div className="mt-8 h-1.5 w-16 rounded-full bg-quantiq-sky transition-all duration-300 group-hover:w-24" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
