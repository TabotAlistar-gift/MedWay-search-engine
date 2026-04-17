import React, { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchResults from "@/components/SearchResults";
import SearchBar from "@/components/SearchBar";

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || "";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-[#1E88E5]/20">
      <Header />
      
      {/* Top Search Bar (Smaller) */}
      <div className="pt-24 pb-8 px-6 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-grow max-w-2xl">
            <Suspense fallback={<div className="h-16 bg-slate-100 animate-pulse rounded-2xl" />}>
               <SearchBar />
            </Suspense>
          </div>
          <div className="hidden lg:block text-slate-400 text-sm italic">
            Searching verified databases for "{query}"
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <Suspense fallback={<div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-white border border-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>}>
          <SearchResults query={query} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
