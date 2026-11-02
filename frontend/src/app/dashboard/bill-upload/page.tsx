"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiFile, FiCheckCircle, FiLoader, FiX } from "react-icons/fi";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { billSummary, billSlabs } from "@/lib/demo-data";
import { useToast } from "@/components/toast/toast-provider";
import { formatINR } from "@/lib/utils";

type UploadState = "idle" | "uploading" | "processing" | "done";

export default function BillUploadPage() {
  const [state, setState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const startUpload = useCallback((name: string) => {
    setFileName(name);
    setState("uploading");
    toast({ title: "Uploading bill", description: name, variant: "info" });
    setTimeout(() => setState("processing"), 1200);
    setTimeout(() => {
      setState("done");
      toast({ title: "Bill processed", description: "All fields extracted successfully.", variant: "success" });
    }, 2600);
  }, [toast]);

  function reset() {
    setState("idle");
    setFileName(null);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Bill Upload"
        title="Upload your electricity bill"
        description="Snap a photo or upload a PDF — BillSnap extracts the slab-wise breakdown automatically."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            {state === "idle" && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files?.[0];
                  startUpload(f?.name ?? "electricity_bill_may.pdf");
                }}
                className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
                  dragOver ? "border-blue bg-blue/5" : "border-border bg-bg-alt/40"
                }`}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-navy text-white shadow-lg"
                >
                  <FiUploadCloud size={26} />
                </motion.div>
                <div>
                  <p className="font-display text-base font-semibold text-ink">Drag & drop your bill here</p>
                  <p className="mt-1 text-sm text-ink-soft">Supports PDF, JPG, PNG · up to 10 MB</p>
                </div>
                <label>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => startUpload(e.target.files?.[0]?.name ?? "electricity_bill_may.pdf")}
                  />
                  <Button variant="primary" asChild>
                    <span>Browse files</span>
                  </Button>
                </label>
              </div>
            )}

            {(state === "uploading" || state === "processing") && (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-bg-alt/40 p-12 text-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}>
                  <FiLoader size={30} className="text-blue" />
                </motion.div>
                <div>
                  <p className="font-display text-base font-semibold text-ink">
                    {state === "uploading" ? "Uploading" : "Reading your bill…"}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">{fileName}</p>
                </div>
              </div>
            )}

            <AnimatePresence>
              {state === "done" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-mint/30 bg-mint/5 p-12 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mint/15 text-mint">
                    <FiCheckCircle size={28} />
                  </div>
                  <div>
                    <p className="font-display text-base font-semibold text-ink">Bill processed successfully</p>
                    <div className="mt-1.5 flex items-center justify-center gap-2 text-sm text-ink-soft">
                      <FiFile size={14} /> {fileName}
                    </div>
                  </div>
                  <Button variant="outline" onClick={reset}>
                    <FiX size={14} /> Upload another
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extracted breakdown</CardTitle>
            <CardDescription>
              {state === "done" ? "From your most recent upload" : "Preview based on your last bill"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state === "uploading" || state === "processing" ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between rounded-xl bg-bg-alt/50 p-4">
                  <div>
                    <p className="text-xs text-ink-soft">Total bill</p>
                    <p className="font-mono-data text-2xl font-bold text-navy">{formatINR(billSummary.totalBill)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ink-soft">Total units</p>
                    <p className="font-mono-data text-lg font-semibold text-ink">{billSummary.totalUnits} kWh</p>
                  </div>
                </div>

                <table className="mt-4 w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-ink-faint">
                      <th className="pb-2 font-medium">Slab</th>
                      <th className="pb-2 font-medium">Units</th>
                      <th className="pb-2 font-medium">Rate</th>
                      <th className="pb-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billSlabs.map((s) => (
                      <tr key={s.slab} className="border-t border-border/70">
                        <td className="py-2.5 text-ink-soft">{s.slab} <span className="text-ink-faint">({s.range})</span></td>
                        <td className="py-2.5 text-ink-soft">{s.units}</td>
                        <td className="py-2.5 text-ink-soft">₹{s.rate}</td>
                        <td className="py-2.5 text-right font-mono-data text-ink">₹{s.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
