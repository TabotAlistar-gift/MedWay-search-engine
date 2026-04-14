"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Activity } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import SignUpForm from "@/components/SignUpForm";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-[#1E88E5]/20">
      
      {/* Left Pane - Branding & Graphic */}
      <div className="hidden lg:flex w-1/2 bg-[#0F172A] relative overflow-hidden flex-col justify-between p-12">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] rounded-full bg-[#1E88E5]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-3xl" />

        {/* Logo Area */}
        <Link href="/" className="relative z-10 flex items-center gap-3 cursor-pointer group w-fit">
          <div className="relative flex items-center justify-center w-10 h-10">
            <div className="absolute w-full h-[4px] bg-[#1E88E5] rounded-full group-hover:scale-105 transition-transform" />
            <div className="absolute h-full w-[4px] bg-[#1E88E5] rounded-full group-hover:scale-105 transition-transform" />
            <div className="absolute p-4 rounded-full border border-[#1E88E5]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-3xl font-bold tracking-tight text-white">
            Med<span className="text-[#1E88E5]">Way</span>
          </span>
        </Link>

        {/* Hero Quote / Value Proposition */}
        <div className="relative z-10 space-y-6 max-w-lg mb-20 animate-in fade-in slide-in-from-left-8 duration-1000 delay-150 fill-mode-both">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Clarity in healthcare, <br />
            <span className="text-[#1E88E5]">when you need it most.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Join thousands of medical professionals and patients who rely on our structured, verified medical database every single day.
          </p>

          <div className="flex gap-4 pt-4">
            <div className="flex items-center gap-2 bg-[#1E293B] px-4 py-2 rounded-full border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-slate-300">Clinically Verified</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1E293B] px-4 py-2 rounded-full border border-slate-700">
              <Activity className="w-4 h-4 text-[#1E88E5]" />
              <span className="text-xs font-medium text-slate-300">Live Symptom Tracking</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="relative z-10 text-slate-500 text-sm">
          © {new Date().getFullYear()} MedWay. All rights reserved.
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <Link href="/" className="flex lg:hidden items-center gap-3 justify-center mb-12">
            <div className="relative flex items-center justify-center w-8 h-8">
              <div className="absolute w-full h-[3px] bg-[#1E88E5] rounded-full" />
              <div className="absolute h-full w-[3px] bg-[#1E88E5] rounded-full" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-800">
              Med<span className="text-[#1E88E5]">Way</span>
            </span>
          </Link>

          {isLogin ? (
            <LoginForm onToggleForm={() => setIsLogin(false)} />
          ) : (
            <SignUpForm onToggleForm={() => setIsLogin(true)} />
          )}

        </div>
      </div>
    </div>
  );
}
