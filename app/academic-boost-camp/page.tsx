import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Calculator,
  Brain,
  HeartHandshake,
  ClipboardCheck,
  CalendarDays,
  Clock,
  MapPin,
  Gift,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export default function AcademicBoostCampPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full bg-[#eefafb] text-[#082b4f]">
        <section className="relative min-h-[760px] overflow-hidden bg-white lg:min-h-[820px] xl:min-h-[900px]">
          <div className="absolute right-0 top-0 hidden h-full w-[60%] overflow-hidden lg:block">
            <Image
              src="/images/quantiqkids.png"
              alt="Students learning together"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="relative z-30 mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1fr_.9fr] lg:py-16">
            <div>
              <Image
                src="/images/quantiqlogo.png"
                alt="QuantIQ Learning Institute"
                width={480}
                height={110}
                className="mb-6"
                priority
              />

              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-24 bg-[#082b4f]/50" />
                <p className="text-sm font-black tracking-[0.45em] text-[#21b8c7]">
                  PRESENTS
                </p>
                <div className="h-px w-24 bg-[#082b4f]/50" />
              </div>

              <p className="text-3xl font-black text-[#082b4f]">
                QuantIQ Learning Lab:
              </p>

              <h1 className="mt-3 max-w-3xl text-6xl font-black uppercase leading-[0.86] tracking-tight text-[#082b4f] md:text-8xl">
                Academic
                <span className="block text-[#21b8c7]">Boost Camp</span>
              </h1>

              <div className="mt-7 inline-flex rounded-full bg-[#082b4f] px-8 py-4 text-sm font-black uppercase tracking-[0.4em] text-white">
                Learn. Grow. Succeed.
              </div>

              <p className="mt-7 font-bold w-[85%] text-lg leading-8 text-slate-700">
                A structured summer program designed to strengthen academic
                skills, build confidence, and prepare students for a successful
                school year ahead.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/academic-boost-camp/register"
                  className="rounded-full bg-[#a6c83a] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#082b4f] shadow-xl transition hover:scale-[1.02]">
                  Register Today
                </Link>

                <a
                  href="#program-details"
                  className="rounded-full border-2 border-[#21b8c7] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#082b4f]">
                  View Details
                </a>
              </div>
            </div>

            <div className="relative z-30 min-h-[420px] lg:hidden">
              <div className="relative h-[420px] overflow-hidden rounded-[1rem]">
                <Image
                  src="/images/quantiqkids.png"
                  alt="Students learning together"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute z-40 hidden place-items-center rounded-full bg-[#082b4f] text-center text-white ring-[10px] ring-white shadow-2xl lg:right-10 lg:top-[58%] lg:grid lg:h-72 lg:w-72 xl:right-16 xl:top-[55%] xl:h-80 xl:w-80 2xl:h-96 2xl:w-96">
            <div>
              <p className="text-2xl font-black uppercase xl:text-3xl">
                Grades
              </p>
              <p className="text-7xl font-black text-[#a6c83a] xl:text-8xl 2xl:text-9xl">
                3-6
              </p>
              <p className="mt-3 text-lg font-black uppercase xl:text-xl">
                Limited Spots!
              </p>
              <p className="mt-3 text-2xl font-serif text-[#d6e96e] xl:text-3xl">
                Register Today!
              </p>
            </div>
          </div>
        </section>

        <section id="program-details" className="bg-white px-6 py-12">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr_.9fr]">
            <div className="rounded-[2rem] border-2 border-[#21b8c7]/40 bg-white p-6 shadow-lg">
              <Pill>Program Highlights</Pill>

              <div className="mt-6 space-y-5">
                <Feature
                  icon={BookOpen}
                  title="Literacy Lab"
                  text="Reading comprehension, fluency, writing and vocabulary"
                />
                <Feature
                  icon={Calculator}
                  title="Math Boost"
                  text="Strengthening foundational skills through engaging activities."
                />
                <Feature
                  icon={Brain}
                  title="Critical Thinking"
                  text="Reasoning, logic and analysis"
                />
                <Feature
                  icon={HeartHandshake}
                  title="Confidence & Life Skills"
                  text="Building self-esteem, teamwork, and communication skills."
                />
                <Feature
                  icon={ClipboardCheck}
                  title="Executive Functioning"
                  text="Organization, focus, planning and time management."
                />
              </div>
            </div>

            <div>
              <Pill dark>Every Student Receives</Pill>

              <div className="mt-6 space-y-5">
                <Receive
                  title="Initial Assessment"
                  text="Comprehensive academic and learning profile to identify strengths and areas of growth."
                />
                <Receive
                  title="Personalized Plan"
                  text="Individualized plan with targeted goals and strategies."
                />
                <Receive
                  title="Progress Report"
                  text="End-of-camp snapshot with insights and next steps for continued success."
                />
              </div>
            </div>

            <div className="space-y-6">
              <Info
                icon={CalendarDays}
                title="When"
                text="July 27 – August 21, 2026"
              />
              <Info
                icon={Clock}
                title="Time"
                text="Monday – Thursday, 9:00 AM – 1:00 PM"
              />
              <Info
                icon={MapPin}
                title="Location"
                text="Boost Academy, Palmdale Ave, NP"
              />

              <div className="rounded-2xl bg-[#eefafb] p-6 shadow-md">
                <div className="flex gap-4">
                  <Gift className="h-12 w-12 text-[#21b8c7]" />
                  <div>
                    <p className="font-black uppercase text-[#21b8c7]">
                      Early Registration Bonus!
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Register by June 15, 2026 and receive{" "}
                      <span className="font-black text-[#082b4f]">10% OFF</span>{" "}
                      the Full Program.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function Pill({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={`inline-flex rounded-full px-6 py-2 text-xs font-black uppercase tracking-[0.25em] text-white ${
        dark ? "bg-[#082b4f]" : "bg-[#21b8c7]"
      }`}>
      {children}
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#eefafb] text-[#082b4f]">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-black uppercase text-[#21b8c7]">{title}</p>
        <p className="text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}

function Receive({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-[#f1f8ee] p-5 shadow-sm">
      <p className="text-sm font-black uppercase text-[#21b8c7]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function Info({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="border-b border-[#21b8c7]/50 pb-5">
      <div className="flex gap-4">
        <Icon className="h-10 w-10 shrink-0 text-[#21b8c7]" />
        <div>
          <p className="font-black uppercase text-[#21b8c7]">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{text}</p>
        </div>
      </div>
    </div>
  );
}
