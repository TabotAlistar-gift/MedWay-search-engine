"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { unifiedSearch, SearchResult } from "@/lib/services/search";

export default function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsLoading(true);
        const results = await unifiedSearch(searchQuery);
        setSuggestions(results);
        setIsLoading(false);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative w-full max-w-2xl z-40 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
      <form 
        onSubmit={handleSearch}
        className={`relative flex items-center w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border transition-all duration-300 ${showSuggestions ? 'border-[#1E88E5]/50 ring-4 ring-[#1E88E5]/10 shadow-[0_8px_30px_rgb(30,136,229,0.12)]' : 'border-slate-200 hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]'}`}
      >
        <Search className="absolute left-6 w-6 h-6 text-slate-400" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onFocus={() => {
            if (searchQuery.length > 0) setShowSuggestions(true);
          }}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          placeholder="Enter symptoms, conditions, or treatments..."
          className="w-full h-16 pl-16 pr-14 bg-transparent text-slate-800 text-lg placeholder:text-slate-400 focus:outline-none rounded-2xl"
        />
        <div className="absolute right-5">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-[#1E88E5] animate-spin" />
          ) : (
            <button type="submit" className="bg-slate-100/80 hover:bg-slate-200 text-slate-600 p-2 rounded-xl transition-colors">
              <Plus className="w-5 h-5 rotate-45" />
            </button>
          )}
        </div>
      </form>

      {/* Live Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden text-left animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Suggested Results</span>
            <span className="text-xs text-slate-400">Press Enter to search</span>
          </div>
          <div className="py-2">
            {suggestions.length > 0 ? (
              suggestions.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => router.push(`/search?q=${encodeURIComponent(item.title)}`)}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-slate-300 group-hover:text-[#1E88E5]" />
                    <span className="text-slate-700 font-medium truncate max-w-[300px]">{item.title}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                    {item.category}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-slate-400 italic">No suggestions found. Press enter to search.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
