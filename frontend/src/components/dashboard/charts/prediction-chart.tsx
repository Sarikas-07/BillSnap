"use client";

import { ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { predictionData } from "@/lib/demo-data";

export function PredictionChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={predictionData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f4" />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a0bf", fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a0bf", fontSize: 12 }} width={40} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f4", fontSize: 12 }} />
        <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-ink-soft">{v}</span>} />
        <Line type="monotone" dataKey="actual" name="Actual Bill (₹)" stroke="#0F2043" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
        <Line
          type="monotone"
          dataKey="predicted"
          name="Predicted Bill (₹)"
          stroke="#FDB813"
          strokeWidth={2.5}
          strokeDasharray="6 6"
          dot={{ r: 4 }}
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
