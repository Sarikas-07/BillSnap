"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiZap, FiShield, FiTrendingUp } from "react-icons/fi";

const highlights = [
  { icon: FiZap, text: "Live appliance-level tracking" },
  { icon: FiTrendingUp, text: "Bill prediction before your meter reading" },
  { icon: FiShield, text: "Risk alerts for unsafe circuits" },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-20">
        <Link href="/" className="mb-10 flex items-center gap-2.5">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl">
            <Image src="/brand/logo.png" alt="BillSnap" fill className="object-cover" />
          </div>
          <span className="font-display text-lg font-bold text-navy">BillSnap</span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mx-auto w-full max-w-sm">
          {children}
        </motion.div>
      </div>

      {/* Visual side */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-navy via-navy-2 to-blue lg:block">
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-amber/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-72 w-72 rounded-full bg-mint/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-center px-14 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber">Intelligent eco system</p>
          <h2 className="mt-3 max-w-md font-display text-3xl font-bold leading-tight">
            Every device, every room, every rupee — accounted for.
          </h2>
          <div className="mt-10 space-y-4">
            {highlights.map((h, i) => (
              <motion.div
                key={h.text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.12 }}
                className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-amber">
                  <h.icon size={18} />
                </span>
                <span className="text-sm text-white/85">{h.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm"
          >
            <p className="text-sm text-white/70">Estimated bill for May 2026</p>
            <div className="mt-1 flex items-end justify-between">
              <p className="font-mono-data text-3xl font-bold">₹2,345</p>
              <span className="rounded-full bg-mint/15 px-2.5 py-1 text-xs text-mint">Good standing</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
