"use client";

import React, { useEffect, useState } from "react";
import { SearchResult, getRelatedQuestions, SearchOverview } from "@/lib/services/search";

import { ExternalLink, Database, AlertCircle, Bookmark, Share2, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import { saveSearchQuery, toggleSavedInsight, getSavedInsightIds, performUnifiedSearch, getAIOverview, getAISuggestions } from "@/app/actions/search";


export default function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [overview, setOverview] = useState<SearchOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | "Drug" | "Research" | "Condition" | "Symptom">("All");
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const relatedQuestions = getRelatedQuestions(query);

  useEffect(() => {
    async function fetchResults() {
      console.log("Searching for:", query);
      setIsLoading(true);
      try {
        // 1. First fetch results and other metadata in parallel
        const [data, savedData, suggestionData] = await Promise.all([
          performUnifiedSearch(query),
          getSavedInsightIds(),
          getAISuggestions(query)
        ]);

        console.log("Results received:", data.length);
        setResults(data);
        setSavedIds(new Set(savedData));
        setSuggestion(suggestionData);
        saveSearchQuery(query, data.length).catch(console.error);

        // 2. NOW call the AI Agent with the results context for a smart summary
        const overviewData = await getAIOverview(query, data);
        setOverview(overviewData);
      } catch (error) {
        console.error("Critical fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (query) {
      fetchResults();
    } else {
      setIsLoading(false);
    }
  }, [query]);

  const filteredResults = results.filter(r =>
    activeTab === "All" || r.category === activeTab
  );

  const handleToggleSave = async (result: SearchResult) => {
    setIsSaving(result.id);
    try {
      const { saved } = await toggleSavedInsight({
        insightId: result.id,
        title: result.title,
        description: result.description,
        category: result.category,
        source: result.source,
        url: result.url
      });

      setSavedIds(prev => {
        const next = new Set(prev);
        if (saved) next.add(result.id);
        else next.delete(result.id);
        return next;
      });
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(null);
    }
  };

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
      {/* Did you mean suggestion */}
      {suggestion && (
        <div className="text-[15px] text-slate-600 mb-2">
          Did you mean: <Link href={`/search?q=${encodeURIComponent(suggestion)}`} className="text-[#d93025] italic hover:underline font-medium">{suggestion}</Link>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
        {["All", "Condition", "Drug", "History", "Anatomy", "Fact", "Research"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === tab
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

      {/* Knowledge Overview Style - Minimal Version */}
      {overview && activeTab === "All" && (
        <div className="py-8 animate-in fade-in slide-in-from-top-4 duration-700 mb-8 border-b border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Clinical Intelligence Agent</span>
               </div>
               <h2 className="text-[9px] font-medium tracking-[0.2em] uppercase text-slate-400">Analysis Report</h2>
            </div>
          </div>

          <div className="space-y-8 text-slate-600 text-[15px] leading-[1.8] whitespace-pre-line">
            <div className={`font-normal text-slate-700 tracking-normal leading-[1.8] ${!showFullOverview ? 'line-clamp-5' : ''}`}>
              {overview.summary.split(/(\*\*.*?\*\*)/).map((part, i) =>
                part.startsWith('**') && part.endsWith('**')
                  ? <strong key={i} className="text-slate-900 font-bold text-[17px] block mb-4">{part.slice(2, -2)}</strong>
                  : part
              )}
            </div>

            {showFullOverview && overview.keyPoints && overview.keyPoints.length > 0 && (
              <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-top-2 duration-500">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Key Details</h4>
                <ul className="grid grid-cols-1 gap-y-4">
                  {overview.keyPoints.map((point, i) => (
                    <li key={i} className="flex gap-4 items-start text-[14px]">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      <span className="font-medium text-slate-600 leading-normal">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setShowFullOverview(!showFullOverview)}
              className="mt-4 flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-all active:scale-95 py-2"
            >
              {showFullOverview ? 'Show less' : 'Show more'}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`transition-transform duration-300 ${showFullOverview ? 'rotate-180' : ''}`}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Results List - Clean Google-Style List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          {filteredResults.map((result, index) => (
            <React.Fragment key={result.id}>
              <div className="group flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[13px] text-slate-500 mb-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-sm ${result.source.includes('CDC') ? 'bg-blue-600 text-white' :
                      result.source.includes('WHO') ? 'bg-cyan-500 text-white' :
                        result.source.includes('Mayo Clinic') ? 'bg-[#004a99] text-white' :
                          result.source.includes('Wikipedia') ? 'bg-slate-800 text-white' :
                            result.source.includes('FDA') ? 'bg-slate-100 text-slate-900 border border-slate-200' :
                              result.source.includes('PubMed') ? 'bg-blue-50 text-blue-800 border border-blue-100' :
                                'bg-slate-100 text-slate-500'
                    }`}>
                    {result.source.includes('WHO') ? 'WHO' :
                      result.source.includes('Mayo') ? 'MC' :
                        result.source.substring(0, 3)}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-800 tracking-tight">{result.source}</span>
                    <span className="text-slate-300 mx-0.5">›</span>
                    <span className="truncate max-w-[200px] text-slate-400">medway.int › {result.category.toLowerCase()}</span>
                  </div>
                  <span className={`ml-auto px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${result.category === 'Drug' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' :
                      result.category === 'Condition' ? 'border-amber-100 bg-amber-50 text-amber-600' :
                        result.category === 'Symptom' ? 'border-purple-100 bg-purple-50 text-purple-600' :
                          result.category === 'History' ? 'border-orange-100 bg-orange-50 text-orange-600' :
                            result.category === 'Anatomy' ? 'border-pink-100 bg-pink-50 text-pink-600' :
                              result.category === 'Fact' ? 'border-blue-100 bg-blue-50 text-blue-600' :
                                'border-slate-100 bg-slate-50 text-slate-600'
                    }`}>
                    {result.category}
                  </span>
                </div>

                {/* Title and Actions */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {result.url ? (
                      <a href={result.url} className="inline-block">
                        <h3 className="text-xl md:text-2xl font-medium text-[#1a0dab] group-hover:underline decoration-1 underline-offset-4">
                          {result.title}
                        </h3>
                      </a>
                    ) : (
                      <Link href={`/item/${result.id}?q=${encodeURIComponent(query)}`} className="inline-block">
                        <h3 className="text-xl md:text-2xl font-medium text-[#1a0dab] group-hover:underline decoration-1 underline-offset-4">
                          {result.title}
                        </h3>
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleSave(result)}
                      disabled={isSaving === result.id}
                      className={`p-2 rounded-full transition-all hover:bg-slate-100 ${savedIds.has(result.id) ? 'text-[#1E88E5]' : 'text-slate-400'}`}
                      title={savedIds.has(result.id) ? "Saved to dashboard" : "Save to dashboard"}
                    >
                      {savedIds.has(result.id) ? (
                        <Bookmark className="w-5 h-5 fill-current" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                    <button className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Snippet */}
                <p className="text-slate-600 text-[15px] leading-relaxed line-clamp-3">
                  {result.description}
                </p>

                {/* Related Topics */}
                {(result as any).relatedTopics && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Related:</span>
                    {(result as any).relatedTopics.split(',').map((topic: string, i: number) => (
                      <Link 
                        key={i} 
                        href={`/search?q=${encodeURIComponent(topic.trim())}`}
                        className="text-[11px] font-medium text-[#1E88E5] hover:underline"
                      >
                        {topic.trim()}{i < (result as any).relatedTopics.split(',').length - 1 ? ',' : ''}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* People Also Ask Section - Inserted after 1st result */}
              {index === 0 && relatedQuestions.length > 0 && activeTab === "All" && (
                <div className="border-y border-slate-100 py-8 my-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">People also ask</h3>
                  <div className="space-y-0">
                    {relatedQuestions.map((q, idx) => (
                      <div key={idx} className="border-b border-slate-100 last:border-0 py-4 flex items-center justify-between group cursor-pointer">
                        <span className="text-slate-700 text-[15px] group-hover:text-[#1E88E5] transition-colors">{q}</span>
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#1E88E5]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </React.Fragment>
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
