import Link from "next/link";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

import { Logo } from "@/components/shared/Logo";

const quickLinks = [
  "About Us",
  "Services",
  "Programs",
  "Resources",
  "Partnerships",
  "Contact",
];

const services = [
  "Academic Intervention",
  "Assessments & Support",
  "Parent & Family Support",
  "Specialized Programs",
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#061f3f] px-6 py-20 text-white">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(32,196,199,0.12),transparent_30%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-14 md:grid-cols-4">
        {/* BRAND */}
        <div>
          <Logo className="h-50 w-auto object-contain" />

          <p className="mt-1 max-w-sm text-sm leading-relaxed text-white/70">
            Empowering students who learn differently through individualized
            education, intervention, and innovative support systems that build
            confidence, independence, and long-term success.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-quantiq-sky" />
            <div className="h-3 w-3 rounded-full bg-quantiq-lime" />
            <div className="h-3 w-3 rounded-full bg-quantiq-orange" />
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white">
            Quick Links
          </h4>

          <div className="mt-6 space-y-3">
            {quickLinks.map((link) => (
              <Link
                key={link}
                href="/"
                className="group flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-quantiq-sky">
                {link}
                <ArrowUpRight className="size-3 opacity-0 transition-all group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>

        {/* SERVICES */}
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white">
            Services
          </h4>

          <div className="mt-6 space-y-3">
            {services.map((service) => (
              <p
                key={service}
                className="text-sm text-white/70 transition-colors hover:text-quantiq-sky">
                {service}
              </p>
            ))}
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white">
            Contact Us
          </h4>

          <div className="mt-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/10">
                <Mail className="size-4 text-quantiq-sky" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-white/40">
                  Email
                </p>

                <p className="mt-1 text-sm text-white/70">
                  info@quantiqacademy.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/10">
                <MapPin className="size-4 text-quantiq-sky" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-white/40">
                  Location
                </p>

                <p className="mt-1 text-sm text-white/70">Nassau, Bahamas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 md:flex-row">
        <p>
          © {new Date().getFullYear()} QuantIQ Learning Institute. All rights
          reserved.
        </p>

        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-quantiq-sky">
            Privacy Policy
          </Link>

          <Link href="/" className="hover:text-quantiq-sky">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
