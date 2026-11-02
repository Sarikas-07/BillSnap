"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { consumptionTrend } from "@/lib/demo-data";

export function ConsumptionAreaChart({ height = 280 }: { height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={consumptionTrend}>
        <defs>
          <linearGradient id="consumptionFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2E6FF2" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#2E6FF2" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f4" />
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#94a0bf", fontSize: 11 }} interval={2} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a0bf", fontSize: 12 }} width={28} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f4", fontSize: 12 }} />
        <Area type="monotone" dataKey="units" name="Units (kWh)" stroke="#2E6FF2" strokeWidth={2.5} fill="url(#consumptionFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
