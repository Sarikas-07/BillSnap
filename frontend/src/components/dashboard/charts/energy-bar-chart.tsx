"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { weeklyProduction } from "@/lib/demo-data";

export function EnergyBarChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={weeklyProduction} barGap={6}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f4" />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a0bf", fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a0bf", fontSize: 12 }} width={28} />
        <Tooltip
          cursor={{ fill: "rgba(46,111,242,0.06)" }}
          contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f4", fontSize: 12 }}
        />
        <Bar dataKey="usage" name="Usage (kWh)" fill="#2E6FF2" radius={[8, 8, 0, 0]} />
        <Bar dataKey="saved" name="Saved (kWh)" fill="#FDB813" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
