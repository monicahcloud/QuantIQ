import Link from "next/link";

type PaymentPageProps = {
  searchParams: Promise<{
    program?: string;
  }>;
};

export default async function AcademicBoostCampPaymentPage({
  searchParams,
}: PaymentPageProps) {
  const params = await searchParams;

  const selectedProgram = params.program;

  const isFullProgram = selectedProgram === "full-program";

  const title = isFullProgram ? "Full Academic Boost Camp" : "Assessment Only";

  const amount = isFullProgram ? "$375" : "$99";

  const description = isFullProgram
    ? "Includes assessment, 4-week academic camp, personalized learning plan, and progress report."
    : "Includes QuantIQ Learning Profile Assessment and parent consultation.";

  return (
    <main className="min-h-screen bg-[#eefafb] text-[#082b4f]">
      {/* HERO */}

      <section className="relative overflow-hidden bg-[#082b4f] px-6 py-16 text-white">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#20b8c7]/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#a6c83a]/30 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <Link
            href="/academic-boost-camp/register"
            className="mb-8 inline-flex text-sm font-bold text-[#d6e96e] hover:underline">
            ← Back to Registration
          </Link>

          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#20b8c7]">
            QuantIQ Learning Lab
          </p>

          <h1 className="mt-4 text-5xl font-black uppercase leading-[0.95] md:text-7xl">
            Complete Payment
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
            Your registration has been received successfully. Complete your
            payment below to secure your child’s enrollment.
          </p>
        </div>
      </section>

      {/* PAYMENT CONTENT */}

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1fr_.8fr]">
        {/* LEFT */}

        <div className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#20b8c7]">
            Selected Program
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase text-[#082b4f]">
            {title}
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
            {description}
          </p>

          <div className="mt-10 rounded-[2rem] bg-[#f7fcfd] p-8 ring-1 ring-[#20b8c7]/10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#20b8c7]">
                  Total Due
                </p>

                <p className="mt-3 text-7xl font-black text-[#082b4f]">
                  {amount}
                </p>
              </div>

              <div className="rounded-full bg-[#a6c83a] px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#082b4f]">
                Enrollment Pending Payment
              </div>
            </div>
          </div>

          {/* PAYMENT METHODS */}

          <div className="mt-10">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#20b8c7]">
              Payment Options
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <button className="rounded-[2rem] border-2 border-[#20b8c7] bg-white p-6 text-left transition hover:bg-[#eefafb]">
                <p className="text-lg font-black uppercase text-[#082b4f]">
                  Debit / Credit Card
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Secure online payment with Visa or Mastercard.
                </p>
              </button>

              <button className="rounded-[2rem] border-2 border-slate-200 bg-white p-6 text-left transition hover:bg-slate-50">
                <p className="text-lg font-black uppercase text-[#082b4f]">
                  Bank Transfer
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Manual bank payment instructions.
                </p>
              </button>
            </div>
          </div>

          {/* FUTURE STRIPE */}

          <button className="mt-10 w-full rounded-full bg-[#20b8c7] px-8 py-5 text-lg font-black uppercase tracking-[0.18em] text-white shadow-xl transition hover:brightness-95">
            Continue to Payment
          </button>
        </div>

        {/* RIGHT */}

        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-lg ring-1 ring-slate-200">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#20b8c7]">
              What Happens Next?
            </p>

            <div className="mt-6 space-y-5">
              <Step
                number="01"
                title="Payment Confirmation"
                text="Your enrollment is confirmed once payment is completed."
              />

              <Step
                number="02"
                title="Parent Communication"
                text="You will receive onboarding details and camp information."
              />

              <Step
                number="03"
                title="Assessment Scheduling"
                text="Students will complete their initial QuantIQ assessment."
              />
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#082b4f] p-6 text-white shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#20b8c7]">
              Need Assistance?
            </p>

            <div className="mt-5 space-y-3 text-sm">
              <p>info@quantiqlearning.com</p>
              <p>242-815-9436</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#20b8c7] text-sm font-black text-white">
        {number}
      </div>

      <div>
        <p className="text-sm font-black uppercase text-[#082b4f]">{title}</p>

        <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}
