import { CheckCircle2 } from "lucide-react";

export function Partnerships() {
  return (
    <section id="partnerships" className="px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 rounded-3xl bg-primary p-10 text-white md:grid-cols-2">
        <div>
          <p className="font-bold uppercase text-quantiq-sky">
            Partnership Opportunity
          </p>

          <h2 className="mt-3 text-4xl font-extrabold text-white">
            Supporting schools through specialized intervention.
          </h2>

          <p className="mt-5 text-white/75">
            QuantIQ operates as an independent educational institute while
            collaborating with partner schools to expand individualized learning
            support services.
          </p>
        </div>

        <div className="space-y-4">
          {[
            "On-campus learning support programs",
            "Intervention services",
            "Assessments and student support planning",
            "After-school academic support",
            "Literacy and executive functioning programs",
          ].map((item) => (
            <div key={item} className="flex gap-3">
              <CheckCircle2 className="mt-1 size-5 shrink-0 text-quantiq-sky" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
