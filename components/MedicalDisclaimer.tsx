"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function MedicalDisclaimer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("medway-disclaimer-accepted");
    if (!accepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("medway-disclaimer-accepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:p-6 pointer-events-none animate-in fade-in duration-500">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-xl border border-amber-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden pointer-events-auto ring-1 ring-black/5">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Important Medical Disclaimer</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              MedWay is a digital search engine designed to provide medical information for <strong>informational and educational purposes only</strong>. 
              The content provided is not intended to be a substitute for professional medical advice, diagnosis, or treatment. 
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </div>
          <div className="bg-slate-50 p-6 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-slate-100">
            <button 
              onClick={handleAccept}
              className="w-full whitespace-nowrap bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg active:scale-95"
            >
              I Understand
            </button>
            <p className="text-[10px] text-slate-400 mt-3 text-center uppercase tracking-widest font-bold">
              Requires acknowledgement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
