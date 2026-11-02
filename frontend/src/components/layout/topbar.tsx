"use client";

import { FiMenu, FiSearch, FiBell } from "react-icons/fi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { currentUser } from "@/lib/demo-data";

export function Topbar({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-white/70 px-4 py-3.5 backdrop-blur-xl sm:px-6 no-print">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-ink-soft hover:bg-bg-alt lg:hidden"
        aria-label="Open menu"
      >
        <FiMenu size={20} />
      </button>

      <h1 className="font-display text-lg font-semibold text-ink sm:text-xl">{title}</h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-ink-faint sm:flex">
          <FiSearch size={16} />
          <input
            placeholder="Search…"
            className="w-40 bg-transparent placeholder:text-ink-faint focus:outline-none lg:w-56"
          />
        </div>
        <button className="relative rounded-xl border border-border bg-white p-2.5 text-ink-soft hover:text-navy">
          <FiBell size={17} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber" />
        </button>
        <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm">
          <AvatarFallback className="text-xs">{currentUser.avatarInitials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
