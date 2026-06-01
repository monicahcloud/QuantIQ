import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";

import { Logo } from "@/components/shared/Logo";

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      // { label: "About Us", href: "#about" },
      { label: "Services", href: "null" },
      { label: "Programs", href: "null" },
      // // { label: "Resources", href: "#resources" },
      // { label: "Partnerships", href: "#partnerships" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      {
        label: "Academic Intervention Services",
        href: "null",
      },
      {
        label: "Assessments & Learning Evaluations",
        href: "null",
      },
      {
        label: "Specialized Learning Support",
        href: "null",
      },
      {
        label: "Parent & Family Support",
        href: "null",
      },
      {
        label: "School & Educational Consulting",
        href: "null",
      },
      {
        label: "Educational Workshops & Training",
        href: "null",
      },
    ],
  },
];

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "info@quantiqlearning.com",
    href: "mailto:info@quantiqlearning.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Nassau, Bahamas",
    href: null,
  },
];

export function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[#041f3d] px-6 py-10 text-white">
      {/* Background atmosphere */}
      <div className="absolute inset-0 z-0 bg-[#041f3d]" />
      <div className="absolute right-[-12%] top-[-30%] z-[1] h-[520px] w-[520px] rounded-full bg-quantiq-sky/15 blur-3xl" />
      <div className="absolute left-[-10%] bottom-[-35%] z-[1] h-[420px] w-[420px] rounded-full bg-quantiq-lime/10 blur-3xl" />

      {/* Dot grid */}
      <div className="absolute right-[12%] top-[18%] z-[1] h-[360px] w-[360px] opacity-20">
        <div className="h-full w-full bg-[radial-gradient(circle,rgba(32,196,199,1)_1.3px,transparent_1.3px)] bg-[size:22px_22px]" />
      </div>

      <div className="absolute inset-0 z-[2] bg-[linear-gradient(135deg,#041f3d_0%,#061f3f_55%,rgba(32,196,199,0.08)_100%)]" />

      <div className="relative z-10 mx-auto w-full px-5">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.8fr_0.9fr_1fr]">
          {/* Brand */}
          <div>
            <Logo className="h-16 w-auto object-contain sm:h-24" />

            <p className="mt-1 max-w-sm text-sm leading-relaxed text-white/70">
              Empowering students who learn differently through individualized
              education, intervention, and innovative support systems that build
              confidence, independence, and long-term success.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-quantiq-sky" />
              <span className="h-3 w-3 rounded-full bg-quantiq-lime" />
              <span className="h-3 w-3 rounded-full bg-quantiq-orange" />
            </div>
          </div>

          {/* Link Groups */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <FooterHeading>{group.title}</FooterHeading>

              <div className="mt-6 space-y-3">
                {group.links.map((link) => (
                  <FooterLink key={link.label} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </div>
            </div>
          ))}

          {/* Contact */}
          <div>
            <FooterHeading>Contact Us</FooterHeading>

            <div className="mt-6 flex flex-col gap-4">
              {contactItems.map((item) => {
                const Icon = item.icon;

                const content = (
                  <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition-all hover:border-quantiq-sky/30 hover:bg-white/[0.07]">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 group-hover:bg-quantiq-sky/20">
                      <Icon className="size-4 text-quantiq-sky" />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                        {item.label}
                      </p>

                      <p className="mt-1 text-sm leading-relaxed text-white/75">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );

                return item.href ? (
                  <Link key={item.label} href={item.href}>
                    {content}
                  </Link>
                ) : (
                  <div key={item.label}>{content}</div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-sm text-white/50 md:flex-row">
          <p>
            © {new Date().getFullYear()} QuantIQ Learning Institute. All rights
            reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-quantiq-sky">
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-quantiq-sky">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-sm font-extrabold uppercase tracking-[0.22em] text-white">
      {children}
    </h4>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex w-fit items-center gap-2 text-sm text-white/70 transition-colors hover:text-quantiq-sky">
      {children}
      <ArrowUpRight className="size-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
    </Link>
  );
}
