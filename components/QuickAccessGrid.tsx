import React from "react";
import { Activity, BookOpen, ShieldCheck, ChevronRight } from "lucide-react";

export default function QuickAccessGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
      
      {/* Symptom Checker - Blue Tinted */}
      <div className="group relative bg-[#F0F7FF] border border-[#E0EFFF] p-8 rounded-[24px] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500 text-[#1E88E5]">
          <Activity className="w-32 h-32 -mt-10 -mr-10" />
        </div>
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#1E88E5] mb-6 inline-flex">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#1E88E5] transition-colors">Symptom Checker</h3>
          <p className="text-slate-600 mb-6 text-sm leading-relaxed">Map your symptoms to potential conditions instantly for quick diagnosis help.</p>
          <div className="flex items-center text-[#1E88E5] font-semibold text-sm group-hover:gap-2 transition-all">
            Start Check <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>

      {/* Treatment Guide - White Card */}
      <div className="group relative bg-white border border-slate-200 p-8 rounded-[24px] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 mb-6 inline-flex">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Treatment Guide</h3>
        <p className="text-slate-500 mb-6 text-sm leading-relaxed">Discover verified recovery paths, standard medications, and alternative therapies.</p>
        <div className="flex items-center text-slate-700 font-semibold text-sm group-hover:text-[#1E88E5] group-hover:gap-2 transition-all">
          Explore Treatments <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>

      {/* Verified Sources - Subtle Gray Card */}
      <div className="group relative bg-slate-50 border border-slate-200/60 p-8 rounded-[24px] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
         <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 mb-6 inline-flex">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Verified Sources</h3>
        <p className="text-slate-500 mb-6 text-sm leading-relaxed">Access our clinical database curated by medical professionals and institutions.</p>
        <div className="flex items-center text-slate-700 font-semibold text-sm group-hover:text-emerald-600 group-hover:gap-2 transition-all">
          View Database <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>

    </div>
  );
}
