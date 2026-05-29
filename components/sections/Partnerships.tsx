import {
  BookOpenCheck,
  CheckCircle2,
  GraduationCap,
  Handshake,
  School,
  UsersRound,
} from "lucide-react";

const partnershipItems = [
  "On-campus learning support programs",
  "Intervention services",
  "Assessments and student support planning",
  "After-school academic support",
  "Literacy and executive functioning programs",
  "Teacher training on intervention strategies",
  "IEP review, interpretation, and implementation support",
];

export function Partnerships() {
  return (
    <section
      id="partnerships"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#dff8ff_0%,#eef9ff_100%)] px-6 py-24 text-[#041f3d]">
      <div className="absolute right-[-10%] top-[-20%] z-0 h-[700px] w-[700px] rounded-full bg-quantiq-sky/15 blur-[120px]" />

      <div className="absolute left-[-10%] bottom-[-30%] z-0 h-[600px] w-[600px] rounded-full bg-[#9be7f5]/40 blur-[120px]" />
      <div className="absolute right-[10%] top-[12%] z-0 h-[360px] w-[360px] opacity-20">
        <div className="h-full w-full bg-[radial-gradient(circle,rgba(32,196,199,1)_1.3px,transparent_1.3px)] bg-[size:22px_22px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <div className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-quantiq-sky/10 ring-1 ring-quantiq-sky/25">
              <Handshake className="size-8 text-quantiq-sky" />
            </div>

            <p className="text-xs font-black uppercase tracking-[0.28em] text-quantiq-sky">
              Partnership Opportunity
            </p>

            <h2 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-[#041f3d] md:text-5xl">
              Helping schools build stronger{" "}
              <span className="text-quantiq-sky">student support systems.</span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#041f3d]/70">
              QuantIQ collaborates with schools as an independent learning
              support institute, providing intervention services, student
              support planning, parent guidance, and teacher training.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: School,
                  title: "Schools",
                  text: "Extend support without overloading classroom teams.",
                },
                {
                  icon: GraduationCap,
                  title: "Teachers",
                  text: "Build confidence with IEPs, accommodations, and strategies.",
                },
                {
                  icon: UsersRound,
                  title: "Families",
                  text: "Give parents clearer pathways for student growth.",
                },
              ].map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-[1.75rem] border border-[#d7e8f3] bg-white p-6 shadow-[0_10px_40px_rgba(2,22,49,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(2,22,49,0.10)]">
                    <Icon className="size-8 text-quantiq-sky" />
                    <h3 className="mt-4 font-extrabold text-[#041f3d]">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#041f3d]/65">
                      {card.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-[#d9eaf4] bg-white p-7 shadow-[0_25px_80px_rgba(2,22,49,0.08)] md:p-9">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-quantiq-sky/10 ring-1 ring-quantiq-sky/20">
                <BookOpenCheck className="size-6 text-quantiq-sky" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-quantiq-sky">
                  Collaboration Model
                </p>
                <h3 className="mt-1 text-2xl font-black text-[#041f3d]">
                  Services schools can add quickly
                </h3>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {partnershipItems.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-2xl border border-[#d7e8f3] bg-[#082b57]/65 p-4">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-quantiq-sky" />
                  <p className="text-sm font-semibold leading-relaxed text-white">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.75rem] bg-[linear-gradient(135deg,#20c4c7_0%,#67d9ed_100%)] p-6 shadow-lg">
              <p className="text-sm font-bold leading-relaxed text-[#041f3d]">
                This model helps schools strengthen student support while giving
                families access to targeted academic, behavioral, and executive
                functioning intervention.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
