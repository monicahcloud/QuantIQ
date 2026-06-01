"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function sendEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formRef.current) return;

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      toast.error("Email service is not configured.");
      return;
    }

    try {
      setIsSubmitting(true);

      await emailjs.sendForm(serviceId, templateId, formRef.current, {
        publicKey,
      });

      toast.success("Message sent successfully!", {
        description: "A member of the QuantIQ team will contact you shortly.",
      });

      formRef.current.reset();
    } catch (error) {
      console.error("EmailJS error:", error);

      toast.error("Message failed to send", {
        description: "Please try again or email info@quantiqlearning.com.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      id="contact-form"
      className="relative overflow-hidden rounded-[3rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200 md:p-12">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#20b8c7]/10" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#a6c83a]/10" />

      <div className="relative">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#20b8c7]">
          Send Us A Message
        </p>

        <h2 className="mt-4 text-5xl font-black uppercase leading-[0.95] text-[#082b4f]">
          We’d Love
          <span className="block text-[#20b8c7]">To Hear From You</span>
        </h2>

        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
          Complete the form below and a member of the QuantIQ team will contact
          you shortly.
        </p>

        <form ref={formRef} onSubmit={sendEmail} className="mt-10 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <input
              name="from_name"
              type="text"
              placeholder="Full Name"
              className={inputStyles}
              required
            />

            <input
              name="reply_to"
              type="email"
              placeholder="Email Address"
              className={inputStyles}
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              className={inputStyles}
              required
            />

            <select name="inquiry_type" className={inputStyles} required>
              <option value="">Inquiry Type</option>
              <option value="Academic Intervention">
                Academic Intervention
              </option>
              <option value="Assessments">Assessments</option>
              <option value="Summer Programs">Summer Programs</option>
              <option value="Parent Consultation">Parent Consultation</option>
              <option value="School Partnership">School Partnership</option>
            </select>
          </div>

          <textarea
            name="message"
            placeholder="Tell us how we can help..."
            className={`${inputStyles} min-h-[180px]`}
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[#20b8c7] px-8 py-5 text-lg font-black uppercase tracking-[0.18em] text-white shadow-xl transition hover:brightness-95 disabled:opacity-60">
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyles =
  "w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-[#082b4f] outline-none transition focus:border-[#20b8c7] focus:ring-4 focus:ring-[#20b8c7]/15";
