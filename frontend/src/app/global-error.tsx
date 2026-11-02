"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Global error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#f5f8fd] px-6 font-sans">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#0c1730]">BillSnap hit a snag</h1>
          <p className="mt-2 text-sm text-[#5b6787]">
            Something went wrong at the application level. Please try reloading the page.
          </p>
          <button
            onClick={() => reset()}
            className="mt-6 rounded-xl bg-[#2e6ff2] px-5 py-2.5 text-sm font-medium text-white hover:brightness-110"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
