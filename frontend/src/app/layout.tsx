import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CursorGlow } from "@/components/layout/cursor-glow";
import { ToastProvider } from "@/components/toast/toast-provider";
import { Toaster } from "@/components/toast/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BillSnap — Bringing Transparency to Electricity Costs",
  description:
    "BillSnap helps you track, understand, and predict your electricity usage and bills, room by room, appliance by appliance.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-bg text-ink`}
      >
        <ToastProvider>
          <CursorGlow />
          {children}
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
