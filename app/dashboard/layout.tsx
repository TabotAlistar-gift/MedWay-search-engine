import React from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | MedWay",
  description: "Your personal medical overview",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      <DashboardSidebar />
      <main className="flex-1 h-full overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
