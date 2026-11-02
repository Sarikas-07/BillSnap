"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { roomUsageSplit } from "@/lib/demo-data";

export function RoomUsagePie() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={roomUsageSplit}
          dataKey="value"
          nameKey="name"
          innerRadius={62}
          outerRadius={92}
          paddingAngle={3}
          cornerRadius={6}
        >
          {roomUsageSplit.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f4", fontSize: 12 }} />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-xs text-ink-soft">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
