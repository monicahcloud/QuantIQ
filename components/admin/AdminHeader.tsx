"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Bell, Menu, Search } from "lucide-react";

export default function AdminHeader() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-6 lg:px-10">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
          QuantIQ Administration
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
        </p>
      </div>

      <div className="hidden max-w-md flex-1 px-10 xl:block">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="search"
            placeholder="Search the Education Engine..."
            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
          <Bell className="h-5 w-5" />
        </button>

        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-11 w-11",
            },
          }}
        />
      </div>
    </header>
  );
}
