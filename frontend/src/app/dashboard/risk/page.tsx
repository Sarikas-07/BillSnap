"use client";

import { motion } from "framer-motion";
import { FiAlertTriangle, FiShield, FiCheckCircle } from "react-icons/fi";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { riskFactors, riskScore } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const severityStyle: Record<string, { badge: "danger" | "warning" | "outline"; ring: string }> = {
  High: { badge: "danger", ring: "border-red-200 bg-red-50/50" },
  Medium: { badge: "warning", ring: "border-amber/30 bg-amber/5" },
  Low: { badge: "outline", ring: "border-border bg-bg-alt/40" },
};

export default function RiskPage() {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (riskScore / 100) * circumference;

  return (
    <div>
      <PageHeader
        eyebrow="Safety"
        title="Risk Analysis"
        description="BillSnap continuously checks your circuit load, appliance age, and usage patterns for safety risks."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center py-8">
          <CardContent className="flex flex-col items-center">
            <div className="relative h-40 w-40">
              <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
                <circle cx="70" cy="70" r={radius} fill="none" stroke="#eef3fb" strokeWidth="12" />
                <motion.circle
                  cx="70" cy="70" r={radius} fill="none" stroke="url(#riskGradient)" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#17B892" />
                    <stop offset="100%" stopColor="#2E6FF2" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono-data text-3xl font-bold text-navy">{riskScore}</span>
                <span className="text-xs text-ink-faint">/ 100</span>
              </div>
            </div>
            <p className="mt-4 font-display text-base font-semibold text-ink">Low overall risk</p>
            <p className="mt-1 max-w-[220px] text-center text-xs text-ink-soft">Your home is safer than 74% of similar households on BillSnap.</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Risk summary</CardTitle>
            <CardDescription>{riskFactors.length} factors monitored this cycle</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "High severity", count: riskFactors.filter((r) => r.severity === "High").length, icon: FiAlertTriangle, color: "text-red-500 bg-red-50" },
              { label: "Medium severity", count: riskFactors.filter((r) => r.severity === "Medium").length, icon: FiShield, color: "text-amber-2 bg-amber/10" },
              { label: "Low severity", count: riskFactors.filter((r) => r.severity === "Low").length, icon: FiCheckCircle, color: "text-mint bg-mint/10" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border p-4 text-center">
                <div className={cn("mx-auto flex h-10 w-10 items-center justify-center rounded-xl", s.color)}>
                  <s.icon size={18} />
                </div>
                <p className="mt-2 text-xl font-bold text-ink">{s.count}</p>
                <p className="text-xs text-ink-soft">{s.label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 space-y-4">
        {riskFactors.map((r, i) => {
          const style = severityStyle[r.severity];
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className={cn("border", style.ring)}>
                <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <FiAlertTriangle
                      className={cn("mt-0.5 shrink-0", r.severity === "High" ? "text-red-500" : r.severity === "Medium" ? "text-amber-2" : "text-ink-faint")}
                      size={18}
                    />
                    <div>
                      <p className="font-display text-sm font-semibold text-ink">{r.title}</p>
                      <p className="mt-1 text-sm text-ink-soft">{r.description}</p>
                      <p className="mt-2 text-xs font-medium text-blue">Recommendation: {r.recommendation}</p>
                    </div>
                  </div>
                  <Badge variant={style.badge} className="shrink-0">{r.severity}</Badge>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
