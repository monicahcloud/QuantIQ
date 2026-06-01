"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/shared/Logo";
import { navLinks } from "@/app/data/site";

export function Navbar() {
  return (
    <header className="sticky left-0 top-0 z-50 w-full bg-[#01132d]">
      <div className="flex h-24 items-center justify-between px-4 sm:h-28 sm:px-6 lg:pl-2 lg:pr-6 xl:pr-10">
        {/* LOGO */}
        <Link href="/" className="flex shrink-0 items-center">
          <Logo className="h-20 w-auto object-contain sm:h-24 lg:h-25" />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {navLinks.map((item, index) =>
            item.subLinks ? (
              <div key={item.label} className="group relative">
                <button className="text-xs font-bold uppercase tracking-[0.18em] text-white/85 transition-colors duration-200 hover:text-quantiq-sky">
                  {item.label}
                </button>

                <div className="invisible absolute left-0 top-full z-50 mt-4 w-80 rounded-2xl border border-white/10 bg-[#01132d] p-3 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  {item.subLinks.map((subLink) => (
                    <Link
                      key={subLink.label}
                      href={subLink.href}
                      className="block rounded-xl px-4 py-3 text-sm font-bold text-white/85 transition hover:bg-white/10 hover:text-quantiq-sky">
                      {subLink.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={`text-xs font-bold uppercase tracking-[0.18em] transition-colors duration-200 hover:text-quantiq-sky ${
                  index === 0
                    ? "border-b-2 border-quantiq-sky pb-2 text-white"
                    : "text-white/85"
                }`}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* DESKTOP CTA */}
        <Button className="hidden rounded-full bg-quantiq-sky px-8 py-6 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-quantiq-sky/30 transition-all hover:bg-quantiq-sky/90 hover:shadow-quantiq-sky/50 lg:inline-flex">
          Get Started
        </Button>

        {/* MOBILE / TABLET MENU */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white"
                aria-label="Open menu">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[88vw] border-l border-white/10 bg-[#01132d] px-6 text-white sm:max-w-sm">
              <SheetHeader className="text-left">
                <SheetTitle className="text-white">
                  <Logo className="h-20 w-auto object-contain" />
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-10 flex flex-col gap-2">
                {navLinks.map((item, index) =>
                  item.subLinks ? (
                    <div key={item.label} className="space-y-2">
                      <div className="rounded-2xl px-4 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white/85">
                        {item.label}
                      </div>

                      {item.subLinks.map((subLink) => (
                        <Link
                          key={subLink.href}
                          href={subLink.href}
                          className="ml-4 block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-quantiq-sky transition-colors hover:bg-white/10">
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`rounded-2xl px-4 py-4 text-sm font-bold uppercase tracking-[0.16em] transition-colors hover:bg-white/10 hover:text-quantiq-sky ${
                        index === 0
                          ? "bg-white/10 text-quantiq-sky"
                          : "text-white/85"
                      }`}>
                      {item.label}
                    </Link>
                  ),
                )}
              </nav>

              <Button className="mt-8 w-full rounded-full bg-quantiq-sky py-6 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-quantiq-sky/30 hover:bg-quantiq-sky/90">
                Get Started
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
