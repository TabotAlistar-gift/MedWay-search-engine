"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, Activity, MessageSquare, Settings, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Saved Symptoms", href: "/dashboard/symptoms", icon: Activity },
    { name: "Medical History", href: "/dashboard/history", icon: FileText },
    { name: "Consultations", href: "/dashboard/consultations", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 min-h-screen flex flex-col items-center py-8">
      {/* Brand logo */}
      <Link href="/" className="mb-12 flex items-center gap-3 cursor-pointer group px-6 w-full">
        <div className="relative flex items-center justify-center w-8 h-8">
          <div className="absolute w-full h-[3px] bg-[#1E88E5] rounded-full group-hover:scale-105 transition-transform" />
          <div className="absolute h-full w-[3px] bg-[#1E88E5] rounded-full group-hover:scale-105 transition-transform" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">
          Med<span className="text-[#1E88E5]">Way</span>
        </span>
      </Link>

      {/* Nav Links */}
      <nav className="flex-1 w-full px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                isActive 
                  ? "bg-[#1E88E5]/10 text-[#1E88E5]" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout Bottom Section */}
      <div className="w-full mt-auto px-4 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg border border-indigo-200">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900">Jane Doe</span>
            <span className="text-xs text-slate-500">Premium Member</span>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors text-sm font-medium">
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>
    </aside>
  );
}
