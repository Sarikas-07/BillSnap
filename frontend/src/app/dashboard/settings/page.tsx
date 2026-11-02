"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { currentUser } from "@/lib/demo-data";
import { useToast } from "@/components/toast/toast-provider";

const toggleSettings = [
  { key: "billAlerts", label: "Bill alerts", desc: "Notify me when my estimated bill crosses a threshold." },
  { key: "riskAlerts", label: "Risk alerts", desc: "Notify me about circuit or appliance safety risks." },
  { key: "weeklyDigest", label: "Weekly digest", desc: "A weekly summary of usage and savings by email." },
  { key: "snapbotTips", label: "SnapBot proactive tips", desc: "Let SnapBot surface saving tips automatically." },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    billAlerts: true, riskAlerts: true, weeklyDigest: false, snapbotTips: true,
  });

  return (
    <div>
      <PageHeader eyebrow="Preferences" title="Settings" description="Manage your account, notifications, and home configuration." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Home details</CardTitle>
              <CardDescription>Used to tailor slab rates and prediction models</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Home name</Label>
                <Input defaultValue={currentUser.homeName} />
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Input defaultValue={currentUser.address} />
              </div>
              <div className="space-y-1.5">
                <Label>DISCOM provider</Label>
                <Select defaultValue="mseb">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mseb">MSEB — Maharashtra</SelectItem>
                    <SelectItem value="bses">BSES — Delhi</SelectItem>
                    <SelectItem value="tneb">TNEB — Tamil Nadu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Billing cycle start</Label>
                <Select defaultValue="1">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st of the month</SelectItem>
                    <SelectItem value="15">15th of the month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose what BillSnap should keep you posted on</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {toggleSettings.map((t, i) => (
                <div key={t.key}>
                  <div className="flex items-center justify-between py-3.5">
                    <div>
                      <p className="text-sm font-medium text-ink">{t.label}</p>
                      <p className="text-xs text-ink-soft">{t.desc}</p>
                    </div>
                    <Switch
                      checked={toggles[t.key]}
                      onCheckedChange={(v) => setToggles((prev) => ({ ...prev, [t.key]: v }))}
                    />
                  </div>
                  {i < toggleSettings.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">Theme</p>
                  <p className="text-xs text-ink-soft">BillSnap Stage 1 ships with the white theme</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["White", "Sage", "Slate"].map((theme, i) => (
                  <button
                    key={theme}
                    className={`rounded-xl border p-3 text-xs font-medium transition-colors ${
                      i === 0 ? "border-blue bg-blue/5 text-blue" : "border-border text-ink-faint hover:bg-bg-alt"
                    }`}
                    disabled={i !== 0}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-red-50/40">
            <CardHeader>
              <CardTitle className="text-red-600">Danger zone</CardTitle>
              <CardDescription>These actions are permanent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                Export all my data
              </Button>
              <Button variant="destructive" className="w-full">
                Delete account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          variant="primary"
          size="lg"
          onClick={() =>
            toast({ title: "Settings saved", description: "Your preferences have been updated.", variant: "success" })
          }
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}
