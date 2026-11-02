"use client";

import { motion } from "framer-motion";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
    >
      <div>
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue">{eyebrow}</p>}
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
        {description && <p className="mt-1 max-w-xl text-sm text-ink-soft">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
