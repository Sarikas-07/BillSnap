"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  FiZap, FiPieChart, FiTrendingUp, FiShield, FiUploadCloud, FiGrid, FiArrowRight, FiCheck, FiPlayCircle,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { SnapBot } from "@/components/layout/snapbot";
import { DemoModal } from "@/components/demo/demo-modal";

const HeroScene = dynamic(() => import("@/components/landing/hero-scene").then((m) => m.HeroScene), {
  ssr: false,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const features = [
  { icon: FiGrid, title: "Room-by-room view", text: "See exactly how much every room contributes to your monthly bill." },
  { icon: FiZap, title: "Appliance tracking", text: "Add appliances with power ratings and usage hours to model real consumption." },
  { icon: FiPieChart, title: "Usage analysis", text: "Interactive charts break consumption down by day, room, and device." },
  { icon: FiTrendingUp, title: "Bill prediction", text: "Forecast next month's bill before the meter reading even arrives." },
  { icon: FiUploadCloud, title: "Bill upload", text: "Snap or upload your paper bill to auto-fill your slab-wise breakdown." },
  { icon: FiShield, title: "Risk analysis", text: "Get flagged on overloaded circuits, ageing appliances, and phantom loads." },
];

const steps = [
  { title: "Add your rooms & appliances", text: "Tell BillSnap what you own — AC, fridge, fans, geysers — in under two minutes." },
  { title: "Watch usage build in real time", text: "Daily and monthly consumption updates automatically across every dashboard." },
  { title: "Get savings & risk guidance", text: "SnapBot and the risk engine flag the appliances actually driving your bill up." },
];

export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl">
              <Image src="/brand/logo.png" alt="BillSnap logo" fill className="object-cover" />
            </div>
            <span className="font-display text-lg font-bold text-navy">BillSnap</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
            <a href="#features" className="hover:text-navy">Features</a>
            <a href="#how-it-works" className="hover:text-navy">How it works</a>
            <a href="#pricing" className="hover:text-navy">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-2 lg:pt-24">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-blue shadow-sm">
            <FiZap size={13} /> Now tracking 12,000+ Indian homes
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] text-ink sm:text-5xl lg:text-[3.4rem]">
            Bringing <span className="bg-gradient-to-r from-blue to-amber-2 bg-clip-text text-transparent">transparency</span> to your electricity costs.
          </h1>
          <p className="mt-5 max-w-lg text-base text-ink-soft sm:text-lg">
            BillSnap turns your meter readings into room-by-room, appliance-by-appliance clarity —
            so you always know what&apos;s driving your bill, and what to do about it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button variant="primary" size="lg" asChild>
              <Link href="/signup">
                Start tracking free <FiArrowRight />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">View live demo</Link>
            </Button>
            <Button variant="ghost" size="lg" onClick={() => setDemoOpen(true)}>
              <FiPlayCircle /> Try Demo
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
            {["No credit card needed", "Setup in 2 minutes", "Works with any DISCOM"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <FiCheck className="text-mint" /> {t}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative h-[380px] sm:h-[440px] lg:h-[500px]"
        >
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-navy via-blue to-amber-2 opacity-[0.06] blur-2xl" />
          <div className="glass relative h-full rounded-[32px] shadow-lg">
            <HeroScene />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass absolute -bottom-5 left-1/2 w-[85%] -translate-x-1/2 rounded-2xl px-5 py-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-soft">This month&apos;s estimate</p>

                <p className="font-mono-data text-xl font-semibold text-navy">₹2,345</p>
              </div>
              <span className="rounded-full bg-mint/10 px-2.5 py-1 text-xs font-medium text-mint">-3.4% vs last month</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Logos / stat strip */}
      <section className="border-y border-border bg-white/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 text-center sm:px-8 md:grid-cols-4">
          {[
            { k: "12,000+", v: "Homes onboarded" },
            { k: "₹1.4Cr", v: "Savings identified" },
            { k: "98.4%", v: "Avg. system health" },
            { k: "4.8/5", v: "Average rating" },
          ].map((s) => (
            <div key={s.v}>
              <p className="font-display text-2xl font-bold text-navy sm:text-3xl">{s.k}</p>
              <p className="text-xs text-ink-soft sm:text-sm">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue">Everything in one place</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">A control room for your electricity bill</h2>
          <p className="mt-3 text-ink-soft">Six focused tools, one shared source of truth — your actual usage.</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              transition={{ delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue/15 to-amber/10 text-blue">
                <f.icon size={20} />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gradient-to-b from-navy to-navy-2 py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber">Getting set up</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">From blank dashboard to full clarity</h2>
          </motion.div>

          <div className="relative mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-white/10 md:block" />
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.12 }}
                className="relative"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue to-amber-2 font-display text-lg font-bold text-white shadow-lg">
                  {i + 1}
                </div>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-white/70">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue via-navy to-navy-2 px-8 py-14 text-center text-white shadow-xl"
        >
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-mint/20 blur-3xl" />
          <h2 className="relative font-display text-3xl font-bold sm:text-4xl">Know your bill before it arrives.</h2>
          <p className="relative mx-auto mt-3 max-w-lg text-white/75">
            Join thousands of households already using BillSnap to cut waste and avoid surprise bills.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="amber" size="lg" asChild>
              <Link href="/signup">Create free account</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href="/dashboard">Explore dashboard</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="relative h-7 w-7 overflow-hidden rounded-lg">
              <Image src="/brand/logo.png" alt="BillSnap" fill className="object-cover" />
            </div>
            <span className="font-display text-sm font-semibold text-navy">BillSnap</span>
          </div>
          <p className="text-xs text-ink-faint">© 2026 BillSnap. Bringing transparency to electricity costs.</p>
        </div>
      </footer>

      <SnapBot />
      <DemoModal open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
