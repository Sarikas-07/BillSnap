"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from "react-icons/fi";
import { useToast, type ToastVariant } from "./toast-provider";
import { cn } from "@/lib/utils";

const variantConfig: Record<ToastVariant, { icon: typeof FiInfo; classes: string }> = {
  success: { icon: FiCheckCircle, classes: "border-mint/30 bg-mint/5 text-mint" },
  error: { icon: FiAlertCircle, classes: "border-red-200 bg-red-50 text-red-500" },
  warning: { icon: FiAlertTriangle, classes: "border-amber/30 bg-amber/10 text-amber-2" },
  info: { icon: FiInfo, classes: "border-blue/30 bg-blue/5 text-blue" },
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end">
      <AnimatePresence>
        {toasts.map((t) => {
          const cfg = variantConfig[t.variant];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-white/95 p-4 shadow-lg backdrop-blur-sm"
              style={{ borderColor: undefined }}
            >
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", cfg.classes)}>
                <Icon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs text-ink-soft">{t.description}</p>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded-lg p-1 text-ink-faint hover:bg-bg-alt hover:text-ink"
                aria-label="Dismiss notification"
              >
                <FiX size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
