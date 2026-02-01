"use client";

import type React from "react";
import { Sidebar } from "@/components/sidebar";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard Overview";
    if (pathname === "/dashboard/kanban") return "Task Management";
    if (pathname === "/dashboard/notes") return "Notes & Documentation";
    if (pathname === "/dashboard/calendar") return "Calendar & Schedule";
    if (pathname === "/dashboard/settings") return "Settings & Preferences";
    return "Dashboard";
  };

  const getPageSubtext = () => {
    if (pathname === "/dashboard")
      return "A quick snapshot of what matters today.";
    if (pathname === "/dashboard/kanban")
      return "Plan, prioritize, and move work forward.";
    if (pathname === "/dashboard/notes")
      return "Capture ideas, docs, and decisions in one place.";
    if (pathname === "/dashboard/calendar")
      return "See deadlines and upcoming work at a glance.";
    if (pathname === "/dashboard/settings")
      return "Manage your preferences and workspace setup.";
    return "Stay organized and in control.";
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground grid-bg">
      <Sidebar />

      <main className="flex-1 overflow-auto p-4 md:p-6 pt-16 md:pt-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {/* Orbyte */}
              {getPageTitle()}
            </h1>
            <p className="text-muted-foreground">{getPageSubtext()}</p>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
