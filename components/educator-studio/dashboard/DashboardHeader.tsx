"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Bell, Gift, Menu, Search } from "lucide-react";
import { useState } from "react";

import MobileDashboardNav from "./MobileDashboardNav";

export default function DashboardHeader() {
  const { user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = user?.fullName || user?.firstName || "Educator";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center border-b border-slate-200 bg-white px-5 sm:px-6 lg:px-7">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open dashboard menu"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden min-w-0 md:block">
              <p className="truncate text-lg font-black tracking-[-0.02em] text-[#0a2d73]">
                QuantIQ Educator Studio
              </p>
            </div>
          </div>

          <div className="hidden max-w-[500px] flex-1 px-4 lg:block xl:px-8">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                placeholder="Search lessons, resources, students..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-16 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500">
                ⌘ K
              </span>
            </label>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label="Rewards"
              className="hidden h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 sm:flex">
              <Gift className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100">
              <Bell className="h-5 w-5" />

              <span className="absolute right-1 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                3
              </span>
            </button>

            <div className="hidden h-8 w-px bg-slate-200 md:block" />

            <div className="hidden min-w-0 text-right md:block">
              <p className="max-w-36 truncate text-sm font-black text-[#071d4e]">
                {displayName}
              </p>

              <p className="mt-0.5 text-xs font-bold text-blue-700">
                Professional Plan
              </p>
            </div>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            />
          </div>
        </div>
      </header>

      <MobileDashboardNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
