"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  preferredContact: string;
  studentName: string;
  studentAge: string;
  gradeEntering: string;
  currentSchool: string;
  programSelection: string;
  academicConcerns: string[];
  academicNotes: string;
  parentGoals: string;
  medicalNotes: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  consent: boolean;
};

const concerns = [
  "Reading Comprehension",
  "Writing",
  "Vocabulary",
  "Math Foundations",
  "Critical Thinking",
  "Focus & Organization",
  "Confidence Building",
  "Study Skills",
];

export default function AcademicBoostRegistrationForm() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      academicConcerns: [],
    },
  });

  async function onSubmit(data: FormData) {
    try {
      setSuccess(false);

      const response = await fetch("/api/academic-boost-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          formResponses: data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit registration.");
      }

      toast.success("Registration submitted successfully!", {
        description: "Redirecting you to the payment page now.",
      });

      setSuccess(true);
      reset();

      const paymentType =
        data.programSelection === "Full Academic Boost Camp"
          ? "full-program"
          : "assessment-only";

      setTimeout(() => {
        router.push(`/academic-boost-camp/payment?program=${paymentType}`);
      }, 1800);
    } catch (error) {
      console.error(error);

      toast.error("Registration failed", {
        description:
          "Something went wrong while submitting the form. Please try again.",
      });
    }
  }

  const inputStyles =
    "w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-[#082b4f] outline-none transition focus:border-[#20b8c7] focus:ring-4 focus:ring-[#20b8c7]/15";

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#20b8c7]">
            Registration Form
          </p>

          <h2 className="mt-3 text-5xl font-black uppercase leading-[0.95] text-[#082b4f] md:text-6xl">
            Student Enrollment
          </h2>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
            Please complete the information below to register your child for the
            QuantIQ Academic Boost Camp.
          </p>
        </div>

        <div className="relative hidden lg:flex lg:justify-end">
          <div className="absolute right-10 top-0 h-[260px] w-[260px] rounded-full bg-[#20b8c7]" />
          <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[#a6c83a]" />

          {/* <div className="absolute -bottom-40 z-30 rounded-2xl bg-white px-6 py-5 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#20b8c7]">
              QuantIQ Learning Lab
            </p>

            <p className="mt-2 text-2xl font-black text-[#082b4f]">
              Grades 1–8{" "}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Limited enrollment available.
            </p>
          </div> */}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        <section className="space-y-5">
          <SectionHeader number="01" title="Parent / Guardian Information" />

          <div className="grid gap-5 md:grid-cols-2">
            <input
              {...register("parentName")}
              placeholder="Parent Full Name"
              className={inputStyles}
              required
            />
            <input
              {...register("parentEmail")}
              type="email"
              placeholder="Parent Email Address"
              className={inputStyles}
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <input
              {...register("parentPhone")}
              placeholder="Parent Phone Number"
              className={inputStyles}
              required
            />
            <select
              {...register("preferredContact")}
              className={inputStyles}
              required>
              <option value="">Preferred Contact Method</option>
              <option value="Phone">Phone</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
              <option value="Text">Text Message</option>
            </select>
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeader number="02" title="Student Information" />

          <div className="grid gap-5 md:grid-cols-2">
            <input
              {...register("studentName")}
              placeholder="Student Full Name"
              className={inputStyles}
              required
            />
            <input
              {...register("studentAge")}
              placeholder="Student Age"
              className={inputStyles}
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <select
              {...register("gradeEntering")}
              className={inputStyles}
              required>
              <option value="">Select Grade</option>
              <option value="Grade 3">Grade 1</option>
              <option value="Grade 3">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 3">Grade 7</option>
              <option value="Grade 3">Grade 8</option>
            </select>

            <input
              {...register("currentSchool")}
              placeholder="Current School"
              className={inputStyles}
              required
            />
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeader number="03" title="Program Selection" />

          <select
            {...register("programSelection")}
            className={inputStyles}
            required>
            <option value="">Select Program</option>
            <option value="Full Academic Boost Camp">
              Full Academic Boost Camp — $375
            </option>
            <option value="Assessment Only">Assessment Only — $99</option>
          </select>
        </section>

        <section className="space-y-6">
          <SectionHeader number="04" title="Areas of Support" />

          <div className="grid gap-4 md:grid-cols-2">
            {concerns.map((concern) => (
              <label
                key={concern}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#f8fcfd] p-5 text-sm font-semibold text-[#082b4f]">
                <input
                  type="checkbox"
                  value={concern}
                  {...register("academicConcerns", {
                    validate: (value) =>
                      value.length > 0 ||
                      "Please select at least one support area.",
                  })}
                />
                {concern}
              </label>
            ))}
          </div>

          <textarea
            {...register("academicNotes")}
            placeholder="Tell us briefly about your child’s academic strengths or concerns."
            className={`${inputStyles} min-h-[160px]`}
            required
          />
          <textarea
            {...register("parentGoals")}
            placeholder="What outcomes are you hoping to see from this program?"
            className={`${inputStyles} min-h-[160px]`}
            required
          />
          <textarea
            {...register("medicalNotes")}
            placeholder="Medical concerns, allergies, or accommodations. If none, type N/A."
            className={`${inputStyles} min-h-[160px]`}
            required
          />
        </section>

        <section className="space-y-5">
          <SectionHeader number="05" title="Emergency Contact" />

          <div className="grid gap-5 md:grid-cols-2">
            <input
              {...register("emergencyContactName")}
              placeholder="Emergency Contact Name"
              className={inputStyles}
              required
            />
            <input
              {...register("emergencyContactPhone")}
              placeholder="Emergency Contact Phone Number"
              className={inputStyles}
              required
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#20b8c7]/20 bg-[#eefafb] p-6">
          <label className="flex items-start gap-4">
            <input
              type="checkbox"
              {...register("consent")}
              required
              className="mt-1"
            />
            <span className="text-sm leading-7 text-slate-700">
              I understand that completing this registration form reserves
              enrollment for the QuantIQ Academic Boost Camp and that payment
              instructions and next steps will follow.
            </span>
          </label>
        </section>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#a6c83a] px-8 py-5 text-lg font-black uppercase tracking-[0.18em] text-[#082b4f] shadow-xl transition hover:brightness-95 disabled:opacity-60">
          {isSubmitting
            ? "Submitting Registration..."
            : "Secure My Child’s Spot"}
        </button>

        {success && (
          <div className="rounded-2xl border border-[#20b8c7] bg-[#eefafb] p-5 text-center text-sm font-semibold text-[#082b4f]">
            Registration submitted successfully. Redirecting to payment...
          </div>
        )}
      </form>
    </div>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.25em] text-[#20b8c7]">
        Section {number}
      </p>

      <h3 className="mt-2 text-2xl font-black text-[#082b4f]">{title}</h3>
    </div>
  );
}
