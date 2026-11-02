"use client";

import { motion } from "framer-motion";
import { FiTrendingUp, FiCalendar, FiTarget } from "react-icons/fi";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PredictionChart } from "@/components/dashboard/charts/prediction-chart";
import { formatINR } from "@/lib/utils";

const confidenceFactors = [
  { label: "Seasonal temperature rise", weight: "High", note: "Summer months typically add 8-12% to AC-driven load." },
  { label: "Historical billing pattern", weight: "High", note: "Last 4 cycles show a steady upward trend." },
  { label: "New appliances added", weight: "Medium", note: "Water heater usage increased in April." },
  { label: "Tariff slab changes", weight: "Low", note: "No DISCOM rate revision expected this quarter." },
];

export default function PredictionPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Forecast"
        title="Prediction Dashboard"
        description="BillSnap projects your next few bills using your historical usage and seasonal patterns."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-blue/20 bg-gradient-to-br from-blue/5 to-transparent">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 text-blue">
                <FiTrendingUp size={16} /> <span className="text-xs font-medium">Next month</span>
              </div>
              <p className="mt-2 font-mono-data text-2xl font-bold text-navy">{formatINR(2410)}</p>
              <p className="mt-1 text-xs text-ink-soft">Projected for June 2026</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          <Card className="border-amber/30 bg-gradient-to-br from-amber/10 to-transparent">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 text-amber-2">
                <FiCalendar size={16} /> <span className="text-xs font-medium">Peak month ahead</span>
              </div>
              <p className="mt-2 font-mono-data text-2xl font-bold text-navy">{formatINR(2610)}</p>
              <p className="mt-1 text-xs text-ink-soft">Expected in August 2026</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Card className="border-mint/30 bg-gradient-to-br from-mint/10 to-transparent">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 text-mint">
                <FiTarget size={16} /> <span className="text-xs font-medium">Model confidence</span>
              </div>
              <p className="mt-2 font-mono-data text-2xl font-bold text-navy">91%</p>
              <p className="mt-1 text-xs text-ink-soft">Based on 4 prior billing cycles</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Actual vs. predicted bill</CardTitle>
          <CardDescription>Solid line is billed history, dashed line is the forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <PredictionChart />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>What&apos;s driving this forecast</CardTitle>
          <CardDescription>Factors the prediction model is weighing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {confidenceFactors.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start justify-between gap-4 rounded-xl border border-border bg-bg-alt/40 p-4"
            >
              <div>
                <p className="text-sm font-medium text-ink">{f.label}</p>
                <p className="mt-1 text-xs text-ink-soft">{f.note}</p>
              </div>
              <Badge variant={f.weight === "High" ? "danger" : f.weight === "Medium" ? "warning" : "outline"}>{f.weight}</Badge>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
