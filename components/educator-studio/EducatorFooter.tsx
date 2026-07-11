import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

const productLinks = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "How It Works",
    href: "#how-it-works",
  },
  {
    label: "AI Assistant",
    href: "#nova",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
];

const resourceLinks = [
  {
    label: "Teacher Resources",
    href: "/resources",
  },
  {
    label: "Lesson Library",
    href: "/resources/lessons",
  },
  {
    label: "Help Center",
    href: "/support",
  },
  {
    label: "Contact Support",
    href: "/contact",
  },
];

const companyLinks = [
  {
    label: "QuantIQ Learning Institute",
    href: "/learning-institute",
  },
  {
    label: "QuantIQ Academy",
    href: "/academy",
  },
  {
    label: "About QuantIQ",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const legalLinks = [
  {
    label: "Privacy Policy",
    href: "/privacy",
  },
  {
    label: "Terms of Service",
    href: "/terms",
  },
  {
    label: "Cookie Policy",
    href: "/cookies",
  },
];

export default function EducatorFooter() {
  return (
    <footer className="bg-[#041334] text-white">
      <div className="mx-auto max-w-[1500px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Link
              href="/"
              aria-label="Go to QuantIQ Learning"
              className="inline-flex items-center">
              <div className="relative h-16 w-56 sm:h-20 sm:w-64">
                <Image
                  src="/images/logo.png"
                  alt="QuantIQ Learning Institute"
                  fill
                  sizes="(max-width: 640px) 224px, 256px"
                  className="object-contain object-left  "
                />
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-blue-100/75">
              QuantIQ Educator Studio gives teachers intelligent tools for
              lesson planning, resource creation, learning forecasts, and
              student support.
            </p>

            <div className="mt-7 flex items-center gap-3">
              {/* <SocialLink
                href="https://www.linkedin.com"
                label="LinkedIn"
                icon={Linkedin}
              />

              <SocialLink
                href="https://www.facebook.com"
                label="Facebook"
                icon={Facebook}
              />

              <SocialLink
                href="https://www.instagram.com"
                label="Instagram"
                icon={Instagram}
              /> */}

              <SocialLink
                href="mailto:hello@quantiqlearning.com"
                label="Email"
                icon={Mail}
              />
            </div>
          </div>

          <FooterColumn title="Educator Studio" links={productLinks} />

          <FooterColumn title="Resources" links={resourceLinks} />

          <FooterColumn title="QuantIQ" links={companyLinks} />
        </div>

        <div className="flex flex-col gap-5 pt-8 text-sm text-blue-100/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} QuantIQ Learning Institute. All rights
            reserved.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

type FooterColumnProps = {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
};

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white">
        {title}
      </h2>

      <nav className="mt-5 space-y-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block text-sm text-blue-100/65 transition hover:translate-x-1 hover:text-white">
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

type SocialLinkProps = {
  href: string;
  label: string;
  icon: React.ElementType;
};

function SocialLink({ href, label, icon: Icon }: SocialLinkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-blue-100 transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/10 hover:text-white">
      <Icon className="h-5 w-5" />
    </Link>
  );
}
