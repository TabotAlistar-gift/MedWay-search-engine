import React from "react";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-slate-200 bg-white text-center flex flex-col items-center">
      <div className="flex gap-6 mb-4 text-sm font-medium text-slate-500">
        <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-slate-900 transition-colors">Medical Disclaimer</a>
      </div>
      <p className="text-slate-400 text-xs flex items-center gap-2">
        <ShieldCheck className="w-3 h-3" /> Database Last Updated: April 2026
      </p>
    </footer>
  );
}
