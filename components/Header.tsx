import React from "react";
import Link from "next/link";
// import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center w-8 h-8">
            {/* Precision Grid Logo - Thin geometric blue cross */}
            <div className="absolute w-full h-[3px] bg-[#1E88E5] rounded-full group-hover:scale-105 transition-transform" />
            <div className="absolute h-full w-[3px] bg-[#1E88E5] rounded-full group-hover:scale-105 transition-transform" />
            <div className="absolute p-3 rounded-full border border-[#1E88E5]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-800">
            Med<span className="text-[#1E88E5]">Way</span>
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
            About
          </a>
          <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
            Medical Database
          </a>
          <Link href="/login" className="bg-[#1E88E5] hover:bg-[#1565C0] text-white px-6 py-2.5 rounded-full font-medium shadow-sm transition-all hover:shadow-md active:scale-95">
            Login / Join
          </Link>
        </nav>
      </div>
    </header>
  );
}
