"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { devices as initialDevices, deviceTypes, rooms } from "@/lib/demo-data";
import { useToast } from "@/components/toast/toast-provider";

export default function AppliancesPage() {
  const [devices, setDevices] = useState(initialDevices);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const filtered = devices.filter(
    (d) => d.name.toLowerCase().includes(query.toLowerCase()) || d.room.toLowerCase().includes(query.toLowerCase())
  );

  function toggleDevice(id: number) {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, status: !d.status } : d)));
    const device = devices.find((d) => d.id === id);
    if (device) {
      toast({ title: device.status ? "Device turned off" : "Device turned on", description: device.name, variant: "info" });
    }
  }

  function addDemoDevice() {
    setDevices((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: "New Appliance",
        room: "Living Room",
        power: "800 W",
        hoursDaily: 3,
        monthlyUnits: "72 kWh",
        status: true,
      },
    ]);
    setOpen(false);
    toast({ title: "Appliance added", description: "New Appliance is now being tracked.", variant: "success" });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Appliances"
        title="Appliance Management"
        description="Every device wired into BillSnap, its power draw, and how long it runs each day."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="primary">
                <FiPlus /> Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a new device</DialogTitle>
                <DialogDescription>Tell BillSnap what it is and how you use it — the rest is calculated for you.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label>Device type</Label>
                  <Select defaultValue={deviceTypes[0]}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {deviceTypes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Room</Label>
                  <Select defaultValue={rooms[0].name}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {rooms.map((r) => (
                        <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Power rating (W)</Label>
                  <Input type="number" defaultValue={800} />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Hours used daily</Label>
                  <Input type="number" defaultValue={3} step={0.5} />
                </div>
              </div>
              <Button variant="primary" className="mt-6 w-full" onClick={addDemoDevice}>
                Add device
              </Button>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-72">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search devices or rooms…" className="pl-10" />
            </div>
            <p className="text-xs text-ink-faint">{filtered.length} of {devices.length} devices</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-faint">
                  <th className="pb-3 font-medium">Device</th>
                  <th className="pb-3 font-medium">Room</th>
                  <th className="pb-3 font-medium">Power</th>
                  <th className="pb-3 font-medium">Hours/day</th>
                  <th className="pb-3 font-medium">Monthly units</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border/70 last:border-0 hover:bg-bg-alt/40"
                  >
                    <td className="py-3.5 font-medium text-ink">{d.name}</td>
                    <td className="py-3.5 text-ink-soft">{d.room}</td>
                    <td className="py-3.5 text-ink-soft">{d.power}</td>
                    <td className="py-3.5 text-ink-soft">{d.hoursDaily} hrs</td>
                    <td className="py-3.5 font-mono-data text-ink-soft">{d.monthlyUnits}</td>
                    <td className="py-3.5">
                      <Switch checked={d.status} onCheckedChange={() => toggleDevice(d.id)} />
                    </td>
                    <td className="py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button className="rounded-lg p-2 text-ink-faint hover:bg-bg-alt hover:text-blue"><FiEdit2 size={14} /></button>
                        <button
                          className="rounded-lg p-2 text-ink-faint hover:bg-red-50 hover:text-red-500"
                          onClick={() => {
                            setDevices((prev) => prev.filter((x) => x.id !== d.id));
                            toast({ title: "Appliance removed", description: d.name, variant: "warning" });
                          }}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
