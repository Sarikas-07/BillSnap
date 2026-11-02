"use client";

import { motion } from "framer-motion";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  unit,
  trend,
  icon: Icon,
  accent = "blue",
  delay = 0,
}: {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  icon: IconType;
  accent?: "blue" | "amber" | "mint" | "navy";
  delay?: number;
}) {
  const accentMap = {
    blue: "from-blue/15 to-blue/5 text-blue",
    amber: "from-amber/20 to-amber/5 text-amber-2",
    mint: "from-mint/15 to-mint/5 text-mint",
    navy: "from-navy/10 to-navy/5 text-navy",
  };

  const positive = (trend ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-70 blur-2xl", accentMap[accent])} />
      <div className="relative flex items-start justify-between">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br", accentMap[accent])}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span
            className={cn(
              "flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-medium",
              positive ? "bg-mint/10 text-mint" : "bg-red-50 text-red-500"
            )}
          >
            {positive ? <FiArrowUpRight size={12} /> : <FiArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="relative mt-4 text-sm text-ink-soft">{label}</p>
      <p className="relative mt-1 font-mono-data text-2xl font-semibold text-ink">
        {unit === "₹" ? "₹" : ""}
        {value}
        {unit && unit !== "₹" ? <span className="ml-1 text-sm font-normal text-ink-faint">{unit}</span> : null}
      </p>
    </motion.div>
  );
}
