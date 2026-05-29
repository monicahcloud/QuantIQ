import { impactItems } from "@/app/data/site";

export function Impact() {
  return (
    <section className="bg-[#061f3f] px-6 py-14 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-sm font-extrabold uppercase text-quantiq-sky">
          Making An Impact
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-4">
          {impactItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={
                  index !== 0 ? "md:border-l md:border-white/20 md:pl-8" : ""
                }>
                <Icon className="size-12 text-quantiq-sky" />

                <h3 className="mt-4 font-extrabold text-white">{item.title}</h3>

                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
