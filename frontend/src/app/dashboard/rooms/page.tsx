"use client";

import { motion } from "framer-motion";
import { FiPlus, FiZap, FiArrowRight } from "react-icons/fi";
import { Sofa, CookingPot, Bed, WashingMachine, ShowerHead, Table2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { rooms } from "@/lib/demo-data";
import { formatINR } from "@/lib/utils";

const iconMap = {
  sofa: Sofa,
  cooking: CookingPot,
  bed: Bed,
  washer: WashingMachine,
  shower: ShowerHead,
  desk: Table2,
};

export default function RoomsPage() {
  const maxUsage = Math.max(...rooms.map((r) => r.usageKwh));

  return (
    <div>
      <PageHeader
        eyebrow="Rooms"
        title="Room Dashboard"
        description="Break your home's usage down room by room to spot where energy really goes."
        action={
          <Button variant="primary">
            <FiPlus /> Add room
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room, i) => {
          const Icon = iconMap[room.icon as keyof typeof iconMap] ?? Sofa;
          const intensity = room.usageKwh / maxUsage;
          return (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full overflow-hidden">
                <div className="relative h-24 bg-gradient-to-br from-navy to-blue">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 0, transparent 40%)" }} />
                  <div className="absolute bottom-3 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                    <Icon size={22} />
                  </div>
                  <Badge className="absolute right-3 top-3" variant={intensity > 0.7 ? "warning" : "outline"}>
                    {intensity > 0.7 ? "High usage" : "Normal"}
                  </Badge>
                </div>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-semibold text-ink">{room.name}</h3>
                    <span className="text-xs text-ink-faint">{room.devices} devices</span>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-ink-soft">Monthly usage</p>
                      <p className="font-mono-data text-xl font-semibold text-navy">{room.usageKwh} kWh</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-ink-soft">Est. cost</p>
                      <p className="font-mono-data text-sm font-semibold text-ink">{formatINR(room.monthlyCost)}</p>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-bg-alt">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${intensity * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-blue to-amber"
                    />
                  </div>
                  <Button variant="ghost" size="sm" className="mt-3 w-full justify-between px-3">
                    Manage devices <FiArrowRight size={14} />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: rooms.length * 0.06 }}
          whileHover={{ y: -4 }}
        >
          <button className="flex h-full min-h-[240px] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-white/40 text-ink-faint transition-colors hover:border-blue hover:text-blue">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-alt">
              <FiPlus size={20} />
            </span>
            <span className="text-sm font-medium">Add a new room</span>
          </button>
        </motion.div>
      </div>

      <Card className="mt-6">
        <CardContent className="flex flex-col items-center gap-4 py-6 text-center sm:flex-row sm:text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber/15 text-amber-2">
            <FiZap size={22} />
          </div>
          <div className="flex-1">
            <p className="font-display text-base font-semibold text-ink">Living Room is your biggest consumer</p>
            <p className="text-sm text-ink-soft">It accounts for 32% of this month&apos;s bill — mostly the AC and TV. Consider a smart plug schedule.</p>
          </div>
          <Button variant="outline">View analysis</Button>
        </CardContent>
      </Card>
    </div>
  );
}
