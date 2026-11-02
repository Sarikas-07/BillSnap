"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { SnapBot } from "@/components/layout/snapbot";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/rooms": "Room Dashboard",
  "/dashboard/appliances": "Appliance Management",
  "/dashboard/analysis": "Analysis Dashboard",
  "/dashboard/prediction": "Prediction Dashboard",
  "/dashboard/bill-upload": "Bill Upload",
  "/dashboard/risk": "Risk Analysis",
  "/dashboard/reports": "Reports",
  "/dashboard/settings": "Settings",
  "/dashboard/profile": "Profile",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const title = titles[pathname] ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      <SnapBot />
    </div>
  );
}
