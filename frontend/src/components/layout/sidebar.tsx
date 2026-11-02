"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiHome, FiGrid, FiPieChart, FiTrendingUp, FiUploadCloud,
  FiAlertTriangle, FiFileText, FiSettings, FiUser, FiLogOut, FiZap,
} from "react-icons/fi";
import { currentUser } from "@/lib/demo-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: FiHome },
  { label: "Rooms", href: "/dashboard/rooms", icon: FiGrid },
  { label: "Appliances", href: "/dashboard/appliances", icon: FiZap },
  { label: "Analysis", href: "/dashboard/analysis", icon: FiPieChart },
  { label: "Prediction", href: "/dashboard/prediction", icon: FiTrendingUp },
  { label: "Bill Upload", href: "/dashboard/bill-upload", icon: FiUploadCloud },
  { label: "Risk Analysis", href: "/dashboard/risk", icon: FiAlertTriangle },
  { label: "Reports", href: "/dashboard/reports", icon: FiFileText },
];

const bottomNav = [
  { label: "Settings", href: "/dashboard/settings", icon: FiSettings },
  { label: "Profile", href: "/dashboard/profile", icon: FiUser },
];

export function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  const pathname = usePathname();

  const NavLink = ({ item }: { item: (typeof nav)[number] }) => {
    const active = pathname === item.href;
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        onClick={onCloseMobile}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
          active ? "text-white" : "text-ink-soft hover:bg-bg-alt hover:text-navy"
        )}
      >
        {active && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-navy to-blue shadow-md"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
        <Icon className="relative z-10 h-[18px] w-[18px] shrink-0" />
        <span className="relative z-10">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm lg:hidden" onClick={onCloseMobile} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-white/90 backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 no-print",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 pb-2 pt-6">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl">
            <Image src="/brand/logo.png" alt="BillSnap" fill className="object-cover" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-bold text-navy">BillSnap</p>
            <p className="text-[11px] text-ink-faint">Smart Bill Tracker</p>
          </div>
        </div>

        <div className="mx-5 my-4 bolt-divider" />

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {nav.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        <div className="space-y-1 px-3 pb-3">
          {bottomNav.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>

        <div className="mx-3 mb-3 flex items-center gap-3 rounded-xl border border-border bg-bg-alt/60 p-3">
          <Avatar>
            <AvatarFallback>{currentUser.avatarInitials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{currentUser.name}</p>
            <p className="truncate text-xs text-ink-faint">{currentUser.plan}</p>
          </div>
          <Link href="/" className="rounded-lg p-2 text-ink-faint hover:bg-white hover:text-red-500" aria-label="Log out">
            <FiLogOut size={16} />
          </Link>
        </div>
      </aside>
    </>
  );
}
