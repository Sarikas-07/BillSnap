"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiDownload, FiFileText, FiCheck, FiPrinter, FiLoader } from "react-icons/fi";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConsumptionAreaChart } from "@/components/dashboard/charts/consumption-area-chart";
import { reportsHistory, billSummary, billSlabs, currentUser } from "@/lib/demo-data";
import { formatINR } from "@/lib/utils";
import { downloadBillReport, printBillReport, type ReportData } from "@/lib/pdf/generate-report";
import { useToast } from "@/components/toast/toast-provider";

const reportIncludes = ["Device-wise usage", "Room-wise usage", "Daily consumption", "Bill breakdown", "Saving suggestions"];

export default function ReportsPage() {
  const [month, setMonth] = useState(reportsHistory[0].id);
  const [generating, setGenerating] = useState<"download" | "print" | null>(null);
  const { toast } = useToast();

  const selected = reportsHistory.find((r) => r.id === month) ?? reportsHistory[0];

  function buildReportData(): ReportData {
    return {
      month: selected.month,
      totalUnits: selected.totalUnits,
      totalBill: selected.totalBill,
      dailyUnits: billSummary.dailyUnits,
      carbonFootprintKg: selected.carbon,
      electricityCharge: billSummary.electricityCharge,
      fixedCharge: billSummary.fixedCharge,
      taxesFees: billSummary.taxesFees,
      dueDate: billSummary.dueDate,
      status: billSummary.status,
      slabs: billSlabs,
      customerName: currentUser.name,
      homeName: currentUser.homeName,
    };
  }

  async function handleDownload() {
    setGenerating("download");
    try {
      await downloadBillReport(buildReportData());
      toast({ title: "Report downloaded", description: `${selected.month} report saved as PDF.`, variant: "success" });
    } catch {
      toast({ title: "Couldn't generate PDF", description: "Please try again in a moment.", variant: "error" });
    } finally {
      setGenerating(null);
    }
  }

  async function handlePrint() {
    setGenerating("print");
    try {
      await printBillReport(buildReportData());
    } catch {
      toast({ title: "Couldn't open print preview", description: "Please try again in a moment.", variant: "error" });
    } finally {
      setGenerating(null);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Reports"
        title="Monthly Report"
        description="A full snapshot of usage, cost, and impact — ready to download or print."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                {reportsHistory.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handlePrint} disabled={generating !== null}>
              {generating === "print" ? <FiLoader className="animate-spin" /> : <FiPrinter />}
              Print
            </Button>
            <Button variant="primary" onClick={handleDownload} disabled={generating !== null}>
              {generating === "download" ? <FiLoader className="animate-spin" /> : <FiDownload />}
              Download PDF
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-ink-soft">Total units</p>
            <p className="mt-1 font-mono-data text-2xl font-bold text-navy">{selected.totalUnits} kWh</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-ink-soft">Total bill</p>
            <p className="mt-1 font-mono-data text-2xl font-bold text-navy">{formatINR(selected.totalBill)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-ink-soft">Carbon footprint</p>
            <p className="mt-1 font-mono-data text-2xl font-bold text-navy">{selected.carbon} kg CO₂</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Consumption trend</CardTitle>
            <CardDescription>Included in the downloaded report</CardDescription>
          </CardHeader>
          <CardContent>
            <ConsumptionAreaChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report includes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {reportIncludes.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2.5 text-sm text-ink-soft"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint/10 text-mint">
                  <FiCheck size={12} />
                </span>
                {item}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Past reports</CardTitle>
          <CardDescription>Download any previous month&apos;s certificate-style report</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border/70">
          {reportsHistory.map((r) => (
            <div key={r.id} className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue/10 text-blue">
                  <FiFileText size={18} />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{r.month}</p>
                  <p className="text-xs text-ink-faint">{r.totalUnits} kWh · {formatINR(r.totalBill)}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  setGenerating("download");
                  try {
                    await downloadBillReport({
                      month: r.month,
                      totalUnits: r.totalUnits,
                      totalBill: r.totalBill,
                      dailyUnits: billSummary.dailyUnits,
                      carbonFootprintKg: r.carbon,
                      electricityCharge: billSummary.electricityCharge,
                      fixedCharge: billSummary.fixedCharge,
                      taxesFees: billSummary.taxesFees,
                      dueDate: billSummary.dueDate,
                      status: billSummary.status,
                      slabs: billSlabs,
                      customerName: currentUser.name,
                      homeName: currentUser.homeName,
                    });
                    toast({ title: "Report downloaded", description: `${r.month} report saved as PDF.`, variant: "success" });
                  } catch {
                    toast({ title: "Couldn't generate PDF", variant: "error" });
                  } finally {
                    setGenerating(null);
                  }
                }}
                disabled={generating !== null}
              >
                <FiDownload size={14} /> Download
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

