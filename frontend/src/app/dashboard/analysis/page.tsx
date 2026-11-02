"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ConsumptionAreaChart } from "@/components/dashboard/charts/consumption-area-chart";
import { EnergyBarChart } from "@/components/dashboard/charts/energy-bar-chart";
import { RoomUsagePie } from "@/components/dashboard/charts/room-usage-pie";
import { rooms, savingsTips } from "@/lib/demo-data";
import { motion } from "framer-motion";

export default function AnalysisPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Analysis"
        title="Analysis Dashboard"
        description="Slice your consumption by day, room, or device to understand exactly where energy is used."
      />

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily Consumption</TabsTrigger>
          <TabsTrigger value="room">By Room</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Consumption trend</CardTitle>
              <CardDescription>Daily units drawn across the current billing cycle</CardDescription>
            </CardHeader>
            <CardContent>
              <ConsumptionAreaChart height={320} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="room" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Room-wise split</CardTitle>
              <CardDescription>Share of total consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <RoomUsagePie />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Room ranking</CardTitle>
              <CardDescription>Highest consumers this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...rooms].sort((a, b) => b.usageKwh - a.usageKwh).map((r, i) => (
                <div key={r.id} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-alt text-xs font-semibold text-ink-soft">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-ink">{r.name}</span>
                      <span className="font-mono-data text-ink-soft">{r.usageKwh} kWh</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-bg-alt">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(r.usageKwh / rooms[0].usageKwh) * 100}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        className="h-full rounded-full bg-gradient-to-r from-blue to-mint"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Weekly usage vs. savings</CardTitle>
              <CardDescription>Where automated savings kicked in this week</CardDescription>
            </CardHeader>
            <CardContent>
              <EnergyBarChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {savingsTips.map((tip, i) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="h-full">
              <CardContent className="pt-5">
                <Badge variant={tip.impact === "High Impact" ? "danger" : tip.impact === "Medium Impact" ? "warning" : "outline"}>
                  {tip.impact}
                </Badge>
                <p className="mt-3 font-display text-sm font-semibold text-ink">{tip.title}</p>
                <p className="mt-1.5 text-xs text-ink-soft">{tip.detail}</p>
                <p className="mt-3 text-xs font-medium text-mint">Potential saving: ₹{tip.saving}/month</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
