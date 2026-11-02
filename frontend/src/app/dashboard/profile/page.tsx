"use client";

import { motion } from "framer-motion";
import { FiEdit2, FiMail, FiPhone, FiMapPin, FiZap } from "react-icons/fi";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { currentUser, rooms, devices } from "@/lib/demo-data";

const stats = [
  { label: "Rooms tracked", value: rooms.length },
  { label: "Devices connected", value: devices.length },
  { label: "Months on BillSnap", value: 8 },
  { label: "Total saved", value: "₹4,120" },
];

export default function ProfilePage() {
  return (
    <div>
      <PageHeader eyebrow="Account" title="Profile" description="Your personal details and household summary." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-8 text-center">
            <Avatar className="h-24 w-24 text-2xl ring-4 ring-blue/10">
              <AvatarFallback className="text-2xl">{currentUser.avatarInitials}</AvatarFallback>
            </Avatar>
            <h3 className="mt-4 font-display text-xl font-bold text-ink">{currentUser.name}</h3>
            <Badge variant="navy" className="mt-2">{currentUser.plan}</Badge>
            <div className="mt-6 w-full space-y-3 text-left">
              <div className="flex items-center gap-2.5 text-sm text-ink-soft">
                <FiMail size={15} className="text-ink-faint" /> {currentUser.email}
              </div>
              <div className="flex items-center gap-2.5 text-sm text-ink-soft">
                <FiPhone size={15} className="text-ink-faint" /> +91 98765 43210
              </div>
              <div className="flex items-center gap-2.5 text-sm text-ink-soft">
                <FiMapPin size={15} className="text-ink-faint" /> {currentUser.address}
              </div>
            </div>
            <Button variant="outline" className="mt-6 w-full">
              <FiEdit2 size={14} /> Edit profile photo
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal information</CardTitle>
              <CardDescription>Keep these up to date for accurate billing estimates</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input defaultValue={currentUser.name} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input defaultValue={currentUser.email} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input defaultValue="+91 98765 43210" />
              </div>
              <div className="space-y-1.5">
                <Label>Household size</Label>
                <Input defaultValue="4 members" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Household summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-border bg-bg-alt/40 p-4 text-center"
                >
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-blue/10 text-blue">
                    <FiZap size={14} />
                  </div>
                  <p className="mt-2 font-mono-data text-lg font-bold text-ink">{s.value}</p>
                  <p className="text-xs text-ink-soft">{s.label}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="primary" size="lg">Save profile</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
