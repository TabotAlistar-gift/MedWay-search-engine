"use client";

import React, { useState } from "react";
import { Search, Activity, BookOpen, Star, Clock, ChevronRight, Bell } from "lucide-react";
import ActiveMedicalInsights from "@/components/ActiveMedicalInsights";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const recentActivity = [
    { type: "Symptom Checked", detail: "Chronic headache analysis", time: "2 hours ago", icon: Activity, color: "text-[#1E88E5]", bg: "bg-[#1E88E5]/10" },
    { type: "Article Saved", detail: "Managing Type 2 Diabetes", time: "Yesterday", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
    { type: "Treatment Viewed", detail: "Ibuprofen comprehensive guide", time: "2 days ago", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top action bar */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back, Jane. Here's your recent medical activity.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Quick search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-full py-2.5 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all w-64 shadow-sm"
            />
          </div>
          <button className="relative p-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
              <div className="w-10 h-10 rounded-xl bg-[#F0F7FF] text-[#1E88E5] flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-slate-900">12</span>
              <span className="text-sm font-medium text-slate-500 mt-1">Symptom Checks</span>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
                <Star className="w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-slate-900">8</span>
              <span className="text-sm font-medium text-slate-500 mt-1">Saved Articles</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center sm:block hidden">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-slate-900">24</span>
              <span className="text-sm font-medium text-slate-500 mt-1">Treatments Viewed</span>
            </div>
          </div>

          {/* Active Medical Insights Component */}
          <ActiveMedicalInsights />

          {/* New Symptom Scan CTA */}
          <div className="bg-gradient-to-r from-[#1E88E5] to-[#1565C0] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10 w-full md:w-2/3">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">New Feature</span>
              <h2 className="text-2xl font-bold mb-2">Smart Precision Diagnosis</h2>
              <p className="text-white/80 mb-6 text-sm leading-relaxed">Describe exactly how you feel in natural language, and our clinical engine will map your symptoms against verified databases instantly.</p>
              <button className="bg-white text-[#1E88E5] hover:bg-slate-50 px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all text-sm flex items-center gap-2 active:scale-95">
                Start Analysis <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Recent Activity */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Recent Activity</h3>
              <button className="text-sm font-semibold text-[#1E88E5] hover:underline">View all</button>
            </div>
            
            <div className="space-y-6">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex gap-4 group cursor-pointer">
                  <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.bg} ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1E88E5] transition-colors">{activity.type}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{activity.detail}</p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      <Clock className="w-3 h-3" /> {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
