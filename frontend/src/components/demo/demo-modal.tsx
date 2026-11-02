"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiX, FiGrid, FiZap, FiPieChart, FiTrendingUp, FiUploadCloud, FiAlertTriangle, FiPlay,
} from "react-icons/fi";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const DEMO_VIDEO_URL = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL;

const tourSteps = [
  { icon: FiGrid, title: "Room Dashboard", text: "See exactly how every room contributes to your bill, at a glance." },
  { icon: FiZap, title: "Appliance Management", text: "Add appliances with real power ratings — usage is calculated automatically." },
  { icon: FiPieChart, title: "Analysis Dashboard", text: "Slice consumption by day, room, or device with interactive charts." },
  { icon: FiTrendingUp, title: "Prediction Dashboard", text: "Forecast next month's bill before the meter reading even arrives." },
  { icon: FiUploadCloud, title: "Bill Upload", text: "Snap or upload your bill — OCR extracts every field automatically." },
  { icon: FiAlertTriangle, title: "Risk Analysis", text: "Get flagged on overloaded circuits and ageing appliances before they become a problem." },
];

export function DemoModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open || DEMO_VIDEO_URL) return;
    const interval = setInterval(() => setStep((s) => (s + 1) % tourSteps.length), 2800);
    return () => clearInterval(interval);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        {DEMO_VIDEO_URL ? (
          <video
            src={DEMO_VIDEO_URL}
            controls
            autoPlay
            className="aspect-video w-full bg-black"
          />
        ) : (
          <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-navy via-navy-2 to-blue">
            <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-amber/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-mint/20 blur-3xl" />

            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 z-10 rounded-lg bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white"
              aria-label="Close demo"
            >
              <FiX size={16} />
            </button>

            <div className="flex h-full flex-col items-center justify-center px-10 text-center text-white">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <FiPlay size={16} />
              </span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-amber-2 shadow-lg">
                    {(() => {
                      const Icon = tourSteps[step].icon;
                      return <Icon size={22} />;
                    })()}
                  </span>
                  <h3 className="font-display text-xl font-bold">{tourSteps[step].title}</h3>
                  <p className="mt-2 max-w-md text-sm text-white/75">{tourSteps[step].text}</p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex gap-1.5">
                {tourSteps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-amber" : "w-1.5 bg-white/30"}`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between bg-white px-6 py-4">
          <p className="text-sm text-ink-soft">
            {DEMO_VIDEO_URL ? "Full product walkthrough" : "Interactive preview — full demo video coming soon"}
          </p>
          <a href="/dashboard" className="text-sm font-medium text-blue hover:underline">
            Explore the live dashboard →
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
