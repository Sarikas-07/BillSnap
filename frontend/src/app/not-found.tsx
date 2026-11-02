"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiHome, FiArrowLeft, FiZap } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/10 blur-3xl" />

        <div className="relative mb-6 flex items-center justify-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl">
            <Image src="/brand/logo.png" alt="BillSnap" fill className="object-cover" />
          </div>
          <span className="font-display text-lg font-bold text-navy">BillSnap</span>
        </div>

        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="relative font-display text-[7rem] font-bold leading-none text-transparent bg-gradient-to-br from-blue to-amber-2 bg-clip-text sm:text-[9rem]"
        >
          404
        </motion.p>

        <div className="relative mx-auto mt-2 flex items-center justify-center gap-2 text-ink-faint">
          <FiZap className="animate-pulse-bolt" />
          <span className="text-sm">Circuit broken — this page doesn&apos;t exist</span>
          <FiZap className="animate-pulse-bolt" />
        </div>

        <h1 className="relative mt-4 font-display text-xl font-bold text-ink sm:text-2xl">
          We couldn&apos;t find that page
        </h1>
        <p className="relative mx-auto mt-2 max-w-sm text-sm text-ink-soft">
          The page may have moved, or the link might be outdated. Let&apos;s get you back to somewhere useful.
        </p>

        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="primary" asChild>
            <Link href="/">
              <FiHome /> Go to homepage
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <FiArrowLeft /> Back to dashboard
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
