"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // In production, forward this to an error-tracking service (Sentry, etc.)
    console.error("[Dashboard error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/40 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-500">
        <FiAlertTriangle size={24} />
      </span>
      <h2 className="mt-5 font-display text-xl font-bold text-ink">Something went wrong loading this page</h2>
      <p className="mt-2 max-w-md text-sm text-ink-soft">
        {error.message || "An unexpected error occurred. Try again, or head back to the dashboard home."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button variant="primary" onClick={() => reset()}>
          <FiRefreshCw /> Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <FiHome /> Back to dashboard
          </Link>
        </Button>
      </div>
      {error.digest && <p className="mt-4 text-xs text-ink-faint">Error reference: {error.digest}</p>}
    </div>
  );
}
