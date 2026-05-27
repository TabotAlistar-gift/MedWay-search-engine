import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getItemById } from "@/lib/services/search";
import { Database, ExternalLink, Bookmark, Share2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Since this is dynamic, Next.js needs to know about `params`
export default async function ItemDetailsPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const item = await getItemById(resolvedParams.id);
  const backQuery = resolvedSearchParams.q;

  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-[#1E88E5]/20">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-24">
        <Link 
          href={backQuery ? `/search?q=${encodeURIComponent(backQuery)}` : "/search"} 
          className="text-sm font-bold text-slate-400 hover:text-[#1E88E5] transition-colors mb-12 inline-flex items-center gap-2"
        >
           ← Back to Search Results
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                item.category === 'Drug' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 
                item.category === 'Condition' ? 'border-amber-100 bg-amber-50 text-amber-600' :
                item.category === 'History' ? 'border-orange-100 bg-orange-50 text-orange-600' :
                item.category === 'Anatomy' ? 'border-pink-100 bg-pink-50 text-pink-600' :
                item.category === 'Fact' ? 'border-blue-100 bg-blue-50 text-blue-600' :
                'border-blue-100 bg-blue-50 text-blue-600'
              }`}>
                {item.category}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Database className="w-4 h-4" />
                Verified {item.source} Data
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 leading-[1.1]">
              {item.title}
            </h1>

            <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-lg prose-p:text-slate-600 prose-headings:text-slate-900 prose-headings:font-bold mb-12">
              {item.description.split('\n').map((paragraph, idx) => {
                if (paragraph.startsWith('### ')) {
                  return <h3 key={idx} className="text-2xl font-bold text-slate-900 mt-12 mb-6">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('## ')) {
                  return <h2 key={idx} className="text-3xl font-bold text-slate-900 mt-12 mb-6">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('- ')) {
                   return <li key={idx} className="ml-4 mb-2 text-slate-600 list-disc">{paragraph.replace('- ', '')}</li>;
                }
                return <p key={idx} className="mb-6">{paragraph}</p>;
              })}
            </div>

            {item.url && (
              <a 
                href={item.url} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                Access Full Clinical Source <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>

          <aside className="space-y-8">
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 pb-4 border-b border-slate-200">
                Authority & Verification
              </h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                    <Database className="w-5 h-5 text-[#1E88E5]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Primary Source</div>
                    <div className="text-xs text-slate-500">{item.source} Medical Database</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Integrity Check</div>
                    <div className="text-xs text-slate-500">Cross-referenced & Verified</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-200">
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Metadata</div>
                 <div className="text-xs text-slate-600 font-medium">Article ID: {item.id}</div>
                 {item.lastModified && <div className="text-xs text-slate-600 font-medium mt-1">Version Date: {item.lastModified}</div>}
              </div>
            </div>

            <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100">
               <h5 className="text-amber-800 font-bold text-sm mb-2">Medical Disclaimer</h5>
               <p className="text-amber-700/80 text-[13px] leading-relaxed">
                 Information on MedWay is sourced from high-authority databases but should not replace professional medical advice. Always consult a healthcare provider for diagnosis.
               </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
