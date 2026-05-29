import { supportAreas } from "@/app/data/site";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function SupportAreas() {
  return (
    <section className="px-6 pb-20">
      <div className="mx-auto grid max-w-7xl gap-10 rounded-3xl bg-quantiq-soft p-10 md:grid-cols-3">
        <div>
          <p className="text-sm font-extrabold uppercase text-quantiq-sky">
            Who We Support
          </p>

          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-primary">
            We support students who may experience:
          </h2>

          <Button className="mt-6 rounded-lg bg-quantiq-sky text-white hover:bg-quantiq-sky/90">
            View All Programs
          </Button>
        </div>

        <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
          {supportAreas.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-quantiq-sky" />
              <p className="text-sm font-medium text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
