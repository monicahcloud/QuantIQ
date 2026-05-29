import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { services } from "@/app/data/site";

export function Services() {
  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="What We Do"
            title="Specialized Support.    "
            highlight=" Stronger Futures."
          />

          <p className="max-w-xl text-sm leading-relaxed text-slate-700">
            QuantIQ Learning Institute provides modern learning support and
            intervention services for neurodiverse and struggling learners. Our
            goal is to close educational gaps and build confidence,
            independence, and long-term academic success.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Card
                key={service.title}
                className="rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60">
                <CardContent className="p-8 text-center">
                  <div
                    className={`mx-auto mb-6 flex size-20 items-center justify-center rounded-full ${service.color} text-white`}>
                    <Icon className="size-10" />
                  </div>

                  <h3 className="text-xl font-extrabold leading-tight text-primary">
                    {service.title}
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {service.text}
                  </p>

                  <p className="mt-6 text-xs font-extrabold uppercase text-quantiq-sky">
                    Learn More →
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
