import EducatorFooter from "@/components/educator-studio/EducatorFooter";
import EducatorLandingHeader from "@/components/educator-studio/LandingHeader";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  FileText,
  GraduationCap,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "AI Lesson Planning",
    description: "Create detailed, standards-aligned lessons in minutes.",
    icon: Sparkles,
    iconStyles: "bg-violet-100 text-violet-700",
  },
  {
    title: "Learning Forecasts",
    description:
      "Predict student performance and identify learning gaps early.",
    icon: BarChart3,
    iconStyles: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Resource Generator",
    description:
      "Create worksheets, quizzes, exit tickets, and classroom activities.",
    icon: FileText,
    iconStyles: "bg-orange-100 text-orange-700",
  },
  {
    title: "Student Insights",
    description:
      "Use data-driven insights to support interventions and growth.",
    icon: Users,
    iconStyles: "bg-purple-100 text-purple-700",
  },
  {
    title: "Save Time",
    description: "Spend less time planning and more time teaching.",
    icon: ShieldCheck,
    iconStyles: "bg-blue-100 text-blue-700",
  },
];

const plans = [
  {
    name: "Starter Teacher",
    price: "$14.99",
    cadence: "/month",
    description: "For individual teachers getting started with AI.",
    icon: Users,
    button: "Start Free Trial",
    href: "/sign-up?plan=starter",
  },
  {
    name: "Professional Teacher",
    price: "$29.99",
    cadence: "/month",
    description: "For full-time educators who want advanced tools.",
    icon: Star,
    button: "Start Free Trial",
    href: "/sign-up?plan=professional",
    featured: true,
  },
  {
    name: "Department",
    price: "$99",
    cadence: "/month",
    description: "Up to 5 teachers collaborating and planning together.",
    icon: Users,
    button: "Start Free Trial",
    href: "/sign-up?plan=department",
  },
  {
    name: "School",
    price: "$299",
    cadence: "/month",
    description: "Up to 25 teachers with school-wide tools and oversight.",
    icon: Building2,
    button: "Start Free Trial",
    href: "/sign-up?plan=school",
  },
  {
    name: "District / Enterprise",
    price: "Custom",
    cadence: "",
    description: "Custom support for districts and education systems.",
    icon: GraduationCap,
    button: "Contact Sales",
    href: "/contact?interest=educator-studio",
  },
];

export default function EducatorStudioLandingPage() {
  return (
    <>
      <EducatorLandingHeader />

      <main className="min-h-screen bg-white pt-20 text-slate-950">
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 via-white to-white">
          <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute right-10 top-20 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />

          <div className="mx-auto grid max-w-[1500px] items-center gap-12 px-6 pb-16 pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:pb-20 lg:pt-16">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                <Sparkles className="h-4 w-4" />
                AI-powered teaching. Real student impact.
              </div>

              <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.04em] text-[#081c4f] sm:text-6xl lg:text-7xl">
                Plan Smarter.
                <br />
                Teach Better.
                <br />
                <span className="bg-gradient-to-r from-blue-700 to-violet-600 bg-clip-text text-transparent">
                  Impact Every Student.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                QuantIQ Educator Studio gives teachers the AI tools, resources,
                and insights they need to create exceptional lessons and
                accelerate student success.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/sign-up?redirect_url=/educator-studio/onboarding"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-violet-600 px-7 py-4 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl">
                  Start Your Free 14-Day Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="#features"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-7 py-4 text-sm font-black text-slate-950 transition hover:border-blue-300 hover:text-blue-700">
                  Explore Features
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-600 text-blue-700">
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </span>
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600">
                <TrustItem label="No credit card required" />
                <TrustItem label="Full access to all features" />
                <TrustItem label="Cancel anytime" />
              </div>
            </div>

            <div className="relative z-10">
              <div className="rounded-[30px] border border-slate-200 bg-white p-2 shadow-[0_35px_100px_rgba(15,23,42,0.15)]">
                <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-slate-50">
                  <Image
                    src="/images/educator-studio-dashboard.png"
                    alt="QuantIQ Educator Studio dashboard"
                    width={1600}
                    height={1000}
                    priority
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">
          <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-2 xl:grid-cols-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className={`flex gap-4 p-6 ${
                    index !== features.length - 1
                      ? "xl:border-r xl:border-slate-200"
                      : ""
                  }`}>
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${feature.iconStyles}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-sm font-black text-[#081c4f]">
                      {feature.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="pricing" className="px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                Choose your plan
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-[-0.03em] text-[#081c4f]">
                Plans Built for Every Educator
              </h2>

              <p className="mt-3 text-slate-500">
                Start with a 14-day free trial. Cancel anytime.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {plans.map((plan) => {
                const Icon = plan.icon;

                return (
                  <article
                    key={plan.name}
                    className={`relative flex min-h-[360px] flex-col rounded-3xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl ${
                      plan.featured
                        ? "border-blue-600 shadow-lg shadow-blue-100"
                        : "border-slate-200 shadow-sm"
                    }`}>
                    {plan.featured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-700 px-4 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
                        Most Popular
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                          plan.featured
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                        }`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="font-black text-[#081c4f]">{plan.name}</h3>
                    </div>

                    <div className="mt-7">
                      <span className="text-4xl font-black tracking-[-0.04em] text-[#081c4f]">
                        {plan.price}
                      </span>

                      {plan.cadence && (
                        <span className="ml-1 text-sm font-semibold text-slate-500">
                          {plan.cadence}
                        </span>
                      )}
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      {plan.description}
                    </p>

                    <Link
                      href={plan.href}
                      className={`mt-auto inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-black transition ${
                        plan.featured
                          ? "bg-gradient-to-r from-blue-700 to-violet-600 text-white hover:shadow-lg"
                          : "border border-slate-300 text-slate-900 hover:border-blue-500 hover:text-blue-700"
                      }`}>
                      {plan.button}
                    </Link>
                  </article>
                );
              })}
            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
              All plans include a 14-day free trial. No credit card required.
              Cancel anytime.
            </p>
          </div>
        </section>
      </main>
      <EducatorFooter />
    </>
  );
}

function TrustItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-white">
        <Check className="h-3 w-3" />
      </span>

      {label}
    </div>
  );
}
