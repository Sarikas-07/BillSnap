"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiZap, FiActivity, FiTrendingUp, FiDollarSign, FiArrowRight } from "react-icons/fi";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { EnergyBarChart } from "@/components/dashboard/charts/energy-bar-chart";
import { RoomUsagePie } from "@/components/dashboard/charts/room-usage-pie";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currentUser, rooms, savingsTips } from "@/lib/demo-data";

export default function DashboardHome() {
  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title={`Hello, ${currentUser.name.split(" ")[0]} 👋`}
        description={`Here's what's happening at ${currentUser.homeName} today.`}
        action={
          <Button variant="primary" asChild>
            <Link href="/dashboard/bill-upload">Upload latest bill <FiArrowRight /></Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Current Load" value="24.5" unit="kW" trend={4.2} icon={FiActivity} accent="blue" delay={0} />
        <KpiCard label="System Health" value="98.4" unit="%" trend={0.6} icon={FiZap} accent="mint" delay={0.05} />
        <KpiCard label="Monthly Usage" value="285" unit="kWh" trend={-6.1} icon={FiTrendingUp} accent="amber" delay={0.1} />
        <KpiCard label="Estimated Bill" value="2,345" unit="₹" trend={-3.4} icon={FiDollarSign} accent="navy" delay={0.15} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Energy Production</CardTitle>
              <CardDescription>Weekly overview of usage vs. savings</CardDescription>
            </div>
            <Badge variant="success">2.34k saved this week</Badge>
          </CardHeader>
          <CardContent>
            <EnergyBarChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage by Room</CardTitle>
            <CardDescription>Share of this month&apos;s consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <RoomUsagePie />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Rooms at a glance</CardTitle>
            <Link href="/dashboard/rooms" className="text-xs font-medium text-blue hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {rooms.slice(0, 4).map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-bg-alt/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">{room.name}</p>
                  <span className="text-xs text-ink-faint">{room.devices} devices</span>
                </div>
                <p className="mt-1 font-mono-data text-lg font-semibold text-navy">{room.usageKwh} kWh</p>
                <Progress value={(room.usageKwh / 100) * 100} className="mt-2 h-1.5" />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top savings tip</CardTitle>
            <CardDescription>Personalised for your home</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {savingsTips.slice(0, 2).map((tip) => (
              <div key={tip.title} className="rounded-xl border border-border bg-bg-alt/50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">{tip.title}</p>
                  <Badge variant={tip.impact === "High Impact" ? "danger" : "warning"}>{tip.impact}</Badge>
                </div>
                <p className="mt-1.5 text-xs text-ink-soft">{tip.detail}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/analysis">See all savings tips</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
