"use client";

import { Show, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

const navigation = [
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
  {
    label: "FAQ",
    href: "#faq",
  },
];

export default function EducatorLandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl"
          : "bg-white/85 backdrop-blur-md"
      }`}>
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          aria-label="Return to QuantIQ Learning Institute"
          className="flex items-center gap-3">
          <div className="relative h-12 w-40 shrink-0 sm:h-14 sm:w-48">
            <Image
              src="/images/quantiqlogo.png"
              alt="QuantIQ Learning Institute"
              fill
              priority
              sizes="(max-width: 640px) 160px, 192px"
              className="object-contain object-left"
            />
          </div>

          <div className="hidden border-l border-slate-300 pl-4 md:block">
            <p className="text-sm font-black text-[#071d4e]">Educator Studio</p>

            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              A Learning Institute Platform
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 xl:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-bold text-slate-600 transition hover:text-blue-700">
              {item.label}
            </Link>
          ))}

          <Link
            href="/resources"
            className="flex items-center gap-1 text-sm font-bold text-slate-600 transition hover:text-blue-700">
            Resources
            <ChevronDown className="h-4 w-4" />
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-black text-slate-700 transition hover:border-blue-500 hover:text-blue-700">
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="rounded-xl bg-gradient-to-r from-blue-700 to-violet-600 px-5 py-2.5 text-sm font-black text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-lg">
              Start Free Trial
            </Link>
          </Show>

          <Show when="signed-in">
            <Link
              href="/educator-studio/dashboard"
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-black text-slate-700 transition hover:border-blue-500 hover:text-blue-700">
              Open Studio
            </Link>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            />
          </Show>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 lg:hidden">
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto max-w-[1500px] px-6 py-6">
            <div className="mb-6 border-b border-slate-200 pb-6">
              <p className="text-lg font-black text-[#071d4e]">
                Educator Studio
              </p>

              <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                A QuantIQ Learning Institute Platform
              </p>
            </div>

            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
                  {item.label}
                </Link>
              ))}

              <Link
                href="/resources"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3 text-base font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
                Resources
              </Link>
            </nav>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <Show when="signed-out">
                <div className="grid gap-3">
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-800">
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-700 to-violet-600 px-5 py-3 text-sm font-black text-white">
                    Start Free Trial
                  </Link>
                </div>
              </Show>

              <Show when="signed-in">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <Link
                    href="/educator-studio/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="font-black text-blue-700">
                    Open Educator Studio
                  </Link>

                  <UserButton />
                </div>
              </Show>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
