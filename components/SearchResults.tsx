"use client";

import React, { useEffect, useState } from "react";
import { SearchResult, unifiedSearch } from "@/lib/services/search";
import { ExternalLink, Database, AlertCircle, Bookmark, Share2 } from "lucide-react";

export default function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | "Drug" | "Research">("All");

  useEffect(() => {
    async function fetchResults() {
      setIsLoading(true);
      if (query) {
        const data = await unifiedSearch(query);
        setResults(data);
      }
      setIsLoading(false);
    }
    fetchResults();
  }, [query]);

  const filteredResults = results.filter(r => 
    activeTab === "All" || r.category === activeTab
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-48 bg-white border border-slate-100 rounded-2xl animate-pulse flex flex-col p-6 gap-4">
            <div className="w-1/3 h-6 bg-slate-100 rounded" />
            <div className="w-full h-4 bg-slate-50 rounded" />
            <div className="w-2/3 h-4 bg-slate-50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-slate-100 p-6 rounded-full mb-6">
          <AlertCircle className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No results found</h2>
        <p className="text-slate-500 max-w-md">
          We couldn't find any verified medical data for "{query}". Try searching for symptoms, drug names, or specific conditions.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Filters */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        {["All", "Drug", "Research"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab 
              ? "bg-[#1E88E5] text-white shadow-md shadow-[#1E88E5]/20" 
              : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
        <div className="ml-auto text-xs font-bold text-slate-400 uppercase tracking-widest">
            {filteredResults.length} Results
        </div>
      </div>

      {/* Results List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {filteredResults.map((result) => (
            <div 
              key={result.id} 
              className="group bg-white border border-slate-200 hover:border-[#1E88E5]/30 hover:shadow-xl transition-all duration-300 rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    result.category === 'Drug' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {result.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <Database className="w-3 h-3" />
                    {result.source}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-[#1E88E5] transition-colors mb-4">
                {result.title}
              </h3>

              <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3">
                {result.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="text-xs text-slate-400">
                   {result.lastModified && `Updated: ${result.lastModified}`}
                </div>
                {result.url && (
                  <a 
                    href={result.url} 
                    target="_blank" 
                    className="flex items-center gap-2 text-[#1E88E5] font-bold text-sm hover:underline"
                  >
                    View Full Source <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#1E88E5] to-[#42A5F5] rounded-3xl p-8 text-white shadow-xl">
                <h4 className="text-xl font-bold mb-4">MedWay Intelligence</h4>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                    Our search engine cross-references data from the FDA, NIH, and peer-reviewed clinical journals to provide you with the most reliable health information.
                </p>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        Verified Data Sources
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        No Advertisements
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        Patient-Friendly Summaries
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8">
                <h4 className="text-lg font-bold text-slate-900 mb-4">Need Help?</h4>
                <p className="text-slate-500 text-sm mb-6">
                    If you're looking for professional assistance or have specific clinical questions, we recommend consulting our list of certified partners.
                </p>
                <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
                    Find a Doctor
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
