import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import prisma from "@/lib/prisma";
import { completeEducatorOnboarding } from "../actions";

export default async function EducatorOnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const existingProfile = await prisma.educatorProfile.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (existingProfile?.onboardingComplete) {
    redirect("/educator-studio/dashboard");
  }

  const user = await currentUser();

  const firstName = user?.firstName ?? "Educator";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[0.8fr_1.2fr]">
        <OnboardingIntro firstName={firstName} />

        <section className="flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-3xl">
            <div className="mb-8 lg:hidden">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">
                QuantIQ Educator Studio
              </p>

              <h1 className="mt-3 text-3xl font-black text-[#071d4e]">
                Set up your teaching profile
              </h1>
            </div>

            <form
              action={completeEducatorOnboarding}
              className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-sm font-black text-white">
                    1
                  </span>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                      Educator setup
                    </p>

                    <h2 className="text-2xl font-black text-[#071d4e]">
                      Tell us about your teaching work
                    </h2>
                  </div>
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                  QuantIQ will use these details to personalize lessons,
                  assessments, forecasts, and classroom resources.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <OnboardingInput
                  name="schoolName"
                  label="School or organization"
                  placeholder="Example: Nassau Christian Academy"
                  icon={Building2}
                />

                <OnboardingInput
                  name="teacherRole"
                  label="Teaching role"
                  placeholder="Example: Grade 6 Teacher"
                  icon={GraduationCap}
                  required
                />

                <OnboardingInput
                  name="gradeLevels"
                  label="Grade levels"
                  placeholder="Example: Grade 5, Grade 6"
                  icon={Users}
                  helpText="Separate multiple grade levels with commas."
                  required
                />

                <OnboardingInput
                  name="subjects"
                  label="Subjects"
                  placeholder="Example: Mathematics, Science"
                  icon={BookOpen}
                  helpText="Separate multiple subjects with commas."
                  required
                />

                <OnboardingInput
                  name="curriculum"
                  label="Curriculum"
                  placeholder="Example: Bahamas National Curriculum"
                  icon={Sparkles}
                />

                <OnboardingInput
                  name="examFocus"
                  label="Exam focus"
                  placeholder="Example: GLAT, BJC, BGCSE"
                  icon={Target}
                />

                <OnboardingInput
                  name="country"
                  label="Country or region"
                  placeholder="Example: The Bahamas"
                  icon={MapPin}
                />

                <OnboardingInput
                  name="classSize"
                  label="Average class size"
                  placeholder="Example: 25"
                  icon={Users}
                  type="number"
                  min="1"
                  max="500"
                />

                <div className="md:col-span-2">
                  <label
                    htmlFor="teachingGoals"
                    className="mb-2 block text-sm font-black text-slate-800">
                    Teaching goals
                  </label>

                  <textarea
                    id="teachingGoals"
                    name="teachingGoals"
                    rows={5}
                    placeholder="Tell us what you want QuantIQ to help you accomplish..."
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  You can update these details later.
                </p>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-violet-600 px-7 py-4 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl">
                  Complete Setup
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function OnboardingIntro({ firstName }: { firstName: string }) {
  const benefits = [
    "Personalized lesson and resource recommendations",
    "Curriculum-aware lesson generation",
    "Teaching forecasts based on your subjects and grades",
    "Classroom resources matched to your goals",
  ];

  return (
    <aside className="relative hidden overflow-hidden bg-[#071d4e] px-12 py-14 text-white lg:flex lg:flex-col">
      <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative z-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-200">
          QuantIQ Educator Studio
        </p>

        <p className="mt-2 text-sm font-bold text-white/60">
          A QuantIQ Learning Institute platform
        </p>
      </div>

      <div className="relative z-10 my-auto max-w-xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-200">
          Welcome, {firstName}
        </p>

        <h1 className="mt-5 text-5xl font-black leading-[1.05] tracking-[-0.04em]">
          Let’s personalize your teaching workspace.
        </h1>

        <p className="mt-6 text-lg leading-8 text-blue-100/80">
          Your educator profile helps Nova and the QuantIQ tools generate more
          relevant lessons, assessments, resources, and recommendations.
        </p>

        <div className="mt-10 space-y-4">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                <CheckCircle2 className="h-4 w-4 text-blue-200" />
              </span>

              <p className="text-sm font-semibold leading-6 text-blue-100/85">
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="relative z-10 text-sm text-blue-100/50">
        Your information is used to personalize your QuantIQ experience.
      </p>
    </aside>
  );
}

type OnboardingInputProps = {
  name: string;
  label: string;
  placeholder: string;
  icon: React.ElementType;
  type?: string;
  helpText?: string;
  required?: boolean;
  min?: string;
  max?: string;
};

function OnboardingInput({
  name,
  label,
  placeholder,
  icon: Icon,
  type = "text",
  helpText,
  required = false,
  min,
  max,
}: OnboardingInputProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-black text-slate-800">
        {label}

        {required && <span className="ml-1 text-red-600">*</span>}
      </label>

      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          id={name}
          name={name}
          type={type}
          min={min}
          max={max}
          required={required}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {helpText && (
        <p className="mt-2 text-xs leading-5 text-slate-500">{helpText}</p>
      )}
    </div>
  );
}
