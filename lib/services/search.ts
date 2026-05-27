

const OPENFDA_BASE_URL = "https://api.fda.gov/drug/label.json";
const PUBMED_BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
import { prisma } from "@/lib/prisma";
const WIKIPEDIA_BASE_URL = "https://en.wikipedia.org/w/api.php";
const CDC_API_BASE_URL = "https://tools.cdc.gov/api/v2/resources/media";
const WHO_SEARCH_BASE = "https://www.who.int/home/search";
const MAYO_SEARCH_BASE = "https://www.mayoclinic.org/search/search-results";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenerativeAI(key);
};

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: "Drug" | "Condition" | "Research" | "Symptom" | "Anatomy" | "History" | "Fact" | "Treatment";
  source: string;
  url?: string;
  lastModified?: string;
  isCurated?: boolean;
}

export interface SearchOverview {
  summary: string;
  keyPoints?: string[];
  sources: { name: string; url: string }[];
}

/**
 * Clean medical queries to extract the core condition/term
 */
export function cleanMedicalQuery(query: string): string {
  let q = query.toLowerCase().trim();
  
  // Remove common conversational prefixes
  const prefixes = [
    "what are the symptoms of", "what is the cause of", "what are", "what is", 
    "symptoms of", "signs of", "causes of", "treatment for", "how to treat",
    "when was the", "who is the", "who was the", "where was the", "who discovered",
    "when did", "how did", "is there a cure for", "can you cure",
    "the", "a", "an"
  ];
  
  for (const prefix of prefixes) {
    if (q.startsWith(prefix)) {
      q = q.substring(prefix.length).trim();
    }
  }
  
  // Remove question marks and extra spaces
  q = q.replace(/\?+$/, "").trim();
  
  return q;
}

/**
 * Search drugs using openFDA API
 */
export async function searchDrugs(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${OPENFDA_BASE_URL}?search=openfda.brand_name:${query}+openfda.generic_name:${query}&limit=5`);
    const data = await response.json();

    if (!data.results) return [];

    return data.results.map((item: any, index: number) => ({
      id: `fda-${index}-${item.id || item.setid}`,
      title: item.openfda?.brand_name?.[0] || item.openfda?.generic_name?.[0] || "Unknown Drug",
      description: item.indications_and_usage?.[0]?.substring(0, 200) + "..." || "No description available.",
      category: "Drug",
      source: "openFDA",
      lastModified: item.effective_time ? `${item.effective_time.substring(0,4)}-${item.effective_time.substring(4,6)}-${item.effective_time.substring(6,8)}` : undefined
    }));
  } catch (error) {
    console.error("Error searching drugs:", error);
    return [];
  }
}

/**
 * Search medical research using PubMed (NCBI)
 */
export async function searchResearch(query: string): Promise<SearchResult[]> {
  try {
    // 1. Search for IDs
    const searchRes = await fetch(`${PUBMED_BASE_URL}/esearch.fcgi?db=pubmed&term=${query}&retmode=json&retmax=5`);
    const searchData = await searchRes.json();
    const ids = searchData.esearchresult?.idlist;

    if (!ids || ids.length === 0) return [];

    // 2. Fetch summaries for those IDs
    const summaryRes = await fetch(`${PUBMED_BASE_URL}/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`);
    const summaryData = await summaryRes.json();

    return ids.map((id: string) => {
      const item = summaryData.result[id];
      return {
        id: `pubmed-${id}`,
        title: item.title,
        description: `Research paper published in ${item.fulljournalname} (${item.pubdate}).`,
        category: "Research",
        source: "PubMed",
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`
      };
    });
  } catch (error) {
    console.error("Error searching research:", error);
    return [];
  }
}

/**
 * Search general medical conditions and symptoms using Wikipedia
 */
export async function searchConditions(query: string): Promise<SearchResult[]> {
  try {
    // Precision search for Wikipedia: if country + disease is detected, target the specific pandemic/health page
    let wikiQuery = query;
    const countries = ["cameroon", "nigeria", "ghana", "india", "usa", "uk", "france", "kenya", "south africa"];
    const lowerQuery = query.toLowerCase();
    const foundCountry = countries.find(c => lowerQuery.includes(c));
    
    if (foundCountry && (lowerQuery.includes("corona") || lowerQuery.includes("covid") || lowerQuery.includes("pandemic"))) {
       wikiQuery = `COVID-19 pandemic in ${foundCountry.charAt(0).toUpperCase() + foundCountry.slice(1)}`;
    }

    const response = await fetch(`${WIKIPEDIA_BASE_URL}?action=query&list=search&srsearch=${encodeURIComponent(wikiQuery)}&format=json&origin=*&srlimit=5`);
    const data = await response.json();

    if (!data.query || !data.query.search) return [];

    return data.query.search.map((item: any) => {
      const title = item.title.toLowerCase();
      const snippet = item.snippet.replace(/<\/?[^>]+(>|$)/g, "");
      
      const symptomKeywords = ["symptom", "sign", "pain", "fever", "cough", "ache", "rash", "swelling", "nausea", "vomiting", "fatigue", "dizziness"];
      const isSymptom = symptomKeywords.some(kw => title.includes(kw) || snippet.toLowerCase().includes(kw));

      return {
        id: `wikipedia-${item.pageid}`,
        title: item.title,
        description: snippet + "...",
        category: isSymptom ? "Symptom" : "Condition",
        source: "Wikipedia",
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, "_"))}`,
        lastModified: item.timestamp ? item.timestamp.split("T")[0] : undefined
      };
    });
  } catch (error) {
    console.error("Error searching conditions:", error);
    return [];
  }
}

/**
 * Search expert sources like CDC and elite medical institutions
 */
export async function searchExpertSources(query: string): Promise<SearchResult[]> {
  try {
    // Search CDC specifically using their public API
    const response = await fetch(`${CDC_API_BASE_URL}?q=${encodeURIComponent(query)}&max=3`);
    const data = await response.json();

    const results: SearchResult[] = [];

    // Correctly handle the CDC API structure (it usually has results in data.results)
    const cdcResults = data.results || data.data || [];
    if (Array.isArray(cdcResults)) {
      results.push(...cdcResults.map((item: any) => ({
        id: `cdc-${item.id}`,
        title: item.name || item.title || "CDC Health Information",
        description: item.description?.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 200) + "..." || "Official CDC health guidelines and information.",
        category: "Condition" as const,
        source: "CDC (.gov)",
        url: item.targetUrl || item.sourceUrl || `https://www.cdc.gov/search/index.html?query=${encodeURIComponent(query)}`,
        lastModified: item.datePublished?.split("T")[0]
      })));
    }
    // 2. Always provide Expert results for WHO and Mayo Clinic for high-authority feel
    if (query.trim().length > 0) {
      const coreTerm = cleanMedicalQuery(query);
      const q = encodeURIComponent(coreTerm);
      const [mayoUrl] = await Promise.all([
        resolveMayoClinicUrl(query)
      ]);

      results.push({
        id: `who-${q}`,
        title: `${query.charAt(0).toUpperCase() + query.slice(1)} - WHO Health Guidelines`,
        description: `Official health standards, global statistics, and international response guidelines for ${query.toLowerCase()} provided by the World Health Organization.`,
        category: "Condition",
        source: "World Health Organization (WHO)",
        url: `${WHO_SEARCH_BASE}?indexCatalogue=genericsearchindex1&searchQuery=${q}&wordsMode=AllWords`
      });
      results.push({
        id: `mayo-${q}`,
        title: `${query.charAt(0).toUpperCase() + query.slice(1)} - Mayo Clinic Professional Guide`,
        description: `Detailed clinical overview covering symptoms, causes, and state-of-the-art treatment options for ${query.toLowerCase()} from Mayo Clinic experts.`,
        category: "Condition",
        source: "Mayo Clinic",
        url: mayoUrl
      });
    }

    return results;
  } catch (error) {
    console.error("Error searching expert sources:", error);
    return [];
  }
}

/**
 * Resolve the direct Mayo Clinic URL for a query
 */
export async function resolveMayoClinicUrl(query: string): Promise<string> {
  const q = encodeURIComponent(query);
  const searchUrl = `${MAYO_SEARCH_BASE}?q=${q}`;
  
  try {
    const response = await fetch(searchUrl);
    const text = await response.text();
    
    // Simple regex to find the first diseases-conditions link in the search results
    // Looking for patterns like: https://www.mayoclinic.org/diseases-conditions/.../syc-...
    const match = text.match(/https:\/\/www\.mayoclinic\.org\/diseases-conditions\/[a-zA-Z0-9-]+\/symptoms-causes\/syc-[0-9]+/);
    
    return match ? match[0] : searchUrl;
  } catch (error) {
    console.error("Error resolving Mayo Clinic URL:", error);
    return searchUrl;
  }
}

/**
 * Fetch overview content directly from Mayo Clinic
 */
export async function getMayoClinicOverview(query: string): Promise<SearchOverview | null> {
  try {
    const mayoUrl = await resolveMayoClinicUrl(query);
    if (!mayoUrl || mayoUrl.includes('search-results')) return null;

    const response = await fetch(mayoUrl);
    const html = await response.text();
    
    // Remove scripts and styles for cleaner parsing
    const cleanHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // 1. Extract Description (usually the first few paragraphs)
    const paragraphs = cleanHtml.match(/<p>([^<{100,}]+)<\/p>/g) || [];
    const description = paragraphs
      .map(p => p.replace(/<[^>]*>?/gm, '').trim())
      .filter(p => p.length > 100 && !p.includes('Mayo Clinic') && !p.includes('appointment'))
      .slice(0, 2)
      .join(' ');

    // 2. Extract Symptoms and Causes
    // We look for headings and the paragraphs following them
    const symptomsMatch = cleanHtml.match(/Symptoms<\/h[23]>.*?<p>(.*?)<\/p>/i);
    const causesMatch = cleanHtml.match(/Causes<\/h[23]>.*?<p>(.*?)<\/p>/i);
    
    const symptomsText = symptomsMatch ? symptomsMatch[1].replace(/<[^>]*>?/gm, '').trim() : "";
    const causesText = causesMatch ? causesMatch[1].replace(/<[^>]*>?/gm, '').trim() : "";

    // Build the structured summary
    let fullSummary = description;
    if (causesText) fullSummary += "\n\n**Causes:** " + causesText;
    if (symptomsText) fullSummary += "\n\n**Symptoms:** " + symptomsText;

    // Use Gemini to clean up the scraped text if available
    const genAI = getGenAI();
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are the MedWay Medical AI. I have scraped some clinical data from Mayo Clinic about "${query}". 
        It contains some noise like advertising disclaimers or unrelated sentences. 
        Please clean this up into a professional, authoritative medical summary. 
        Format it with clear bold headers for **Overview**, **Symptoms**, and **Causes**.
        
        Raw Data:
        ${fullSummary}`;
        
        const result = await model.generateContent(prompt);
        fullSummary = result.response.text();
      } catch (aiError) {
        console.error("Gemini cleanup failed, using raw scraped data:", aiError);
      }
    }

    // Ensure it's at least 5 lines if AI didn't run
    if (!genAI && fullSummary.length < 500 && description.length > 0) {
      // Add more paragraphs if needed to reach length
      const extra = paragraphs
        .map(p => p.replace(/<[^>]*>?/gm, '').trim())
        .filter(p => p.length > 100 && !fullSummary.includes(p.substring(0, 50)))
        .slice(0, 3)
        .join(' ');
      fullSummary += " " + extra;
    }

    if (fullSummary.length < 200) return null;

    // Extract Key Takeaways (Symptoms list)
    const listItems = cleanHtml.match(/<li>([^<{20,150}]+)<\/li>/g) || [];
    const keyPoints = listItems
      .map(li => li.replace(/<[^>]*>?/gm, '').trim())
      .filter(li => li.length > 20 && li.length < 150)
      .slice(0, 6);

    return {
      summary: fullSummary,
      keyPoints: keyPoints.length > 0 ? keyPoints : undefined,
      sources: [
        { name: "Mayo Clinic", url: mayoUrl },
        { name: "World Health Organization", url: `https://www.who.int/home/search?indexCatalogue=genericsearchindex1&searchQuery=${encodeURIComponent(query)}` }
      ]
    };
  } catch (error) {
    console.error("Error fetching Mayo Clinic overview:", error);
    return null;
  }
}

/**
 * Fetch a comprehensive overview for the search query, using results as context
 */
export async function getSearchOverview(query: string, results: SearchResult[] = []): Promise<SearchOverview | null> {
  if (!query || query.length < 3) return null;

  try {
    const coreTerm = cleanMedicalQuery(query);

    // Build a lean context from search results (top 5 only, short descriptions)
    const resultsContext = results.slice(0, 5).map((r, i) =>
      `[${i + 1}] ${r.source}: ${r.title} — ${r.description.substring(0, 120)}`
    ).join("\n");

    // === STEP 1: Fetch Wikipedia using the CLEANED term for accuracy ===
    let wikiContext = "";
    let wikiTitle = "";
    try {
      // Use coreTerm (e.g. "skin organ") not the full question for better article matching
      const searchTerm = coreTerm.length > 3 ? coreTerm : query;
      const wikiRes = await fetch(`${WIKIPEDIA_BASE_URL}?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&origin=*&srlimit=1`);
      const wikiData = await wikiRes.json();
      const topResult = wikiData.query?.search?.[0];
      if (topResult) {
        wikiTitle = topResult.title;
        const pageRes = await fetch(`${WIKIPEDIA_BASE_URL}?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(topResult.title)}&format=json&origin=*&redirects=1`);
        const pageData = await pageRes.json();
        const pages = pageData.query?.pages;
        const pageId = pages ? Object.keys(pages)[0] : "-1";
        if (pageId !== "-1" && pages[pageId].extract) {
          wikiContext = pages[pageId].extract.substring(0, 1000);
        }
      }
    } catch (_) {}

    // === STEP 2: Local DB context ===
    let localContext = "";
    try {
      const stopWords = ["what", "when", "where", "who", "why", "how", "is", "was", "the", "a", "an", "of", "in", "on", "at", "for", "and", "or"];
      const localTerms = coreTerm.toLowerCase().split(/\s+/).filter(w => w.length > 3 && !stopWords.includes(w));
      if (localTerms.length > 0) {
        const localMatch = await prisma.medicalKnowledge.findFirst({
          where: { OR: localTerms.map(term => ({ title: { contains: term } })) }
        });
        if (localMatch) {
          localContext = `${localMatch.title}: ${localMatch.content.substring(0, 500)}`;
        }
      }
    } catch (_) {}

    // === STEP 3: Build context (keep it short to avoid Gemini timeouts) ===
    const fullContext = [
      wikiContext ? `Wikipedia — ${wikiTitle}:\n${wikiContext}` : "",
      localContext,
      resultsContext
    ].filter(Boolean).join("\n\n").substring(0, 3000);

    // === STEP 4: Gemini — try multiple models ===
    const genAI = getGenAI();
    if (genAI) {
      const prompt = `You are MedWay, a medical AI. Answer this question directly and accurately.

Question: "${query}"

Instructions:
- Answer EXACTLY what was asked. Start with the direct answer immediately.
- Use the context below if it is relevant. If not, use your own knowledge.
- Do NOT mention Wikipedia or give generic introductions.

Format:
[Direct answer to the question — no section heading, just answer it clearly]

**Overview**
[Detailed explanation of the topic]

**Key Facts**
- [fact 1]
- [fact 2]
- [fact 3]

**Clinical Takeaway**
[Brief authoritative closing]

Context:
${fullContext}`;

      for (const modelName of ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"]) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const text = result.response.text();
          if (text && text.length > 80) {
            return {
              summary: text,
              sources: results.slice(0, 3).map(r => ({ name: r.source, url: r.url || "#" }))
            };
          }
        } catch (e) {
          console.error(`Model ${modelName} failed:`, e);
        }
      }
    }

    // === STEP 5: Wikipedia fallback — only if the article title seems relevant ===
    if (wikiContext && wikiContext.length > 200) {
      const titleLower = wikiTitle.toLowerCase();
      const queryWords = coreTerm.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const isRelevant = queryWords.some(w => titleLower.includes(w));
      if (isRelevant) {
        return {
          summary: `**${wikiTitle}**\n\n${wikiContext}`,
          sources: [{ name: "Wikipedia", url: `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}` }]
        };
      }
    }

    return null;

  } catch (error) {
    console.error("Error in getSearchOverview:", error);
    return null;
  }
}

/**
 * Search curated local knowledge base
 */
export async function searchLocalKnowledge(query: string): Promise<SearchResult[]> {
  try {
    const stopWords = ["what", "when", "where", "who", "why", "how", "is", "was", "the", "a", "an", "first", "drug", "found", "discovered", "of", "in", "on", "at", "treatment", "symptoms", "causes", "about"];
    const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w));
    
    // If no meaningful keywords, fall back to the cleaned query
    const searchTerms = keywords.length > 0 ? keywords : [cleanMedicalQuery(query)];

    // Fetch records matching at least TWO keywords if multiple exist, or just one
    const knowledge = await prisma.medicalKnowledge.findMany({
      where: {
        OR: searchTerms.map(term => ({
          OR: [
            { title: { contains: term } },
            { description: { contains: term } },
            { relatedTopics: { contains: term } }
          ]
        }))
      },
      take: 5
    });

    return knowledge.map(item => ({
      id: `local-${item.id}`,
      title: item.title,
      description: item.description,
      category: item.category as any,
      source: "MedWay Curated",
      isCurated: true,
      lastModified: item.updatedAt.toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error("Error searching local knowledge:", error);
    return [];
  }
}

/**
 * Get spelling suggestions / "Did you mean"
 */
export async function getSearchSuggestions(query: string): Promise<string | null> {
  if (!query || query.length < 3) return null;
  
  try {
    const term = query.toLowerCase();
    // Get all titles to find the closest match
    const titles = await prisma.medicalKnowledge.findMany({
      select: { title: true }
    });

    const suggestions = titles.map(t => t.title);
    
    // Simple fuzzy match
    for (const suggestion of suggestions) {
      if (suggestion.toLowerCase() === term) return null; // Exact match
      
      // If the query is a substantial part of the suggestion or vice versa
      if (suggestion.toLowerCase().includes(term) && suggestion.length < term.length + 5) {
        return suggestion;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function unifiedSearch(query: string): Promise<SearchResult[]> {
  if (!query) return [];

  // Clean the query for better API results
  let searchTerms = query.toLowerCase();
  
  // If user asks "what are the symptoms of malaria", we should search for "malaria symptoms"
  if (searchTerms.includes("symptoms of") || searchTerms.includes("signs of") || searchTerms.includes("what is") || searchTerms.includes("what are")) {
     searchTerms = searchTerms.replace(/what are the |what is the |what are |what is |the |symptoms of |signs of /g, "").trim();
     if (query.toLowerCase().includes("symptom") || query.toLowerCase().includes("sign")) {
       searchTerms += " symptoms";
     }
  }

  // 3. Detect Statistics & Geographic Intent
  const statsKeywords = ["how many", "death", "cases", "total", "rate", "statistics", "numbers"];
  const isStatsQuery = statsKeywords.some(kw => query.toLowerCase().includes(kw));
  
  // 4. Parallel fetching
  const [local, conditions, drugs, research, expert] = await Promise.all([
    searchLocalKnowledge(query),
    searchConditions(searchTerms),
    searchDrugs(query),
    searchResearch(query),
    searchExpertSources(query)
  ]);

  // 5. Intelligent Scoring & Sorting
  const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  let results: any[] = [...local, ...expert, ...conditions, ...drugs, ...research];
  
  results = results.map((r: SearchResult) => {
    let score = 0;
    const title = r.title.toLowerCase();
    const desc = r.description.toLowerCase();
    
    keywords.forEach(kw => {
      if (title.includes(kw)) score += 10;
      if (desc.includes(kw)) score += 2;
    });
    
    // Boost curated sources
    if (r.isCurated) score += 15;
    if (r.source.includes(".gov") || r.source.includes("WHO") || r.source.includes("Mayo")) score += 5;
    
    return { ...r, score };
  });

  results = results.sort((a: any, b: any) => (b.score || 0) - (a.score || 0));

  if (isStatsQuery) {
    // Additional boost for results that contain numbers if it's a stats query
    results = results.sort((a: any, b: any) => {
      const aHasNum = /\d/.test(a.description) ? 1 : 0;
      const bHasNum = /\d/.test(b.description) ? 1 : 0;
      return bHasNum - aHasNum;
    });
  }

  return results;
}

/**
 * Generate "People also ask" questions based on the query
 */
export function getRelatedQuestions(query: string): string[] {
  const q = query.toLowerCase();
  if (q.includes("corona") || q.includes("covid")) {
    const country = q.includes("cameroon") ? "Cameroon" : "this country";
    return [
      `What is the current death rate in ${country}?`,
      `When did the pandemic start in ${country}?`,
      `Which areas are most affected in ${country}?`,
      `What are the latest health guidelines for ${country}?`
    ];
  }
  if (q.includes("malaria")) {
    return [
      "What are the first signs of malaria?",
      "Can malaria be cured completely?",
      "How is malaria transmitted to humans?",
      "Which countries have the highest malaria rates?"
    ];
  }
  return [
    `What are the common symptoms of ${query}?`,
    `How is ${query} diagnosed by doctors?`,
    `What are the long-term effects of ${query}?`,
    `Is there a vaccine or cure for ${query}?`
  ];
}

/**
 * Fetch a specific item by its unique MedWay ID
 */
export async function getItemById(id: string): Promise<SearchResult | null> {
  if (!id) return null;

  try {
    if (id.startsWith("fda-")) {
      // Extract the real FDA ID (format: fda-{index}-{realId})
      const parts = id.split("-");
      if (parts.length < 3) return null;
      const realId = parts.slice(2).join("-");
      
      const response = await fetch(`${OPENFDA_BASE_URL}?search=id:"${realId}"+setid:"${realId}"&limit=1`);
      let data = await response.json();
      
      // If the combined search fails, try fallback to just id or setid
      if (!data.results || data.results.length === 0) {
        const fallbackRes = await fetch(`${OPENFDA_BASE_URL}?search=id:"${realId}"`);
        data = await fallbackRes.json();
        if (!data.results || data.results.length === 0) {
           const setidRes = await fetch(`${OPENFDA_BASE_URL}?search=setid:"${realId}"`);
           data = await setidRes.json();
        }
      }

      if (!data.results || data.results.length === 0) return null;
      const item = data.results[0];

      return {
        id: id,
        title: item.openfda?.brand_name?.[0] || item.openfda?.generic_name?.[0] || "Unknown Drug",
        description: item.indications_and_usage?.[0] || "No description available.",
        category: "Drug",
        source: "openFDA",
        lastModified: item.effective_time ? `${item.effective_time.substring(0,4)}-${item.effective_time.substring(4,6)}-${item.effective_time.substring(6,8)}` : undefined
      };
    } else if (id.startsWith("pubmed-")) {
      // Extract the real PubMed ID (format: pubmed-{realId})
      const realId = id.replace("pubmed-", "");
      
      const summaryRes = await fetch(`${PUBMED_BASE_URL}/esummary.fcgi?db=pubmed&id=${realId}&retmode=json`);
      const summaryData = await summaryRes.json();
      
      const item = summaryData.result?.[realId];
      if (!item) return null;

      return {
        id: id,
        title: item.title,
        description: `Research paper published in ${item.fulljournalname} (${item.pubdate}).`,
        category: "Research",
        source: "PubMed",
        url: `https://pubmed.ncbi.nlm.nih.gov/${realId}/`
      };
    } else if (id.startsWith("wikipedia-")) {
      // Extract the real Wikipedia Page ID
      const realId = id.replace("wikipedia-", "");
      
      const response = await fetch(`${WIKIPEDIA_BASE_URL}?action=query&prop=extracts&explaintext=true&pageids=${realId}&format=json&origin=*`);
      const data = await response.json();
      
      const page = data.query?.pages?.[realId];
      if (!page) return null;

      return {
        id: id,
        title: page.title,
        description: page.extract || "No description available.",
        category: "Condition",
        source: "Wikipedia",
        url: `https://en.wikipedia.org/?curid=${realId}`
      };
    } else if (id.startsWith("cdc-")) {
      const realId = id.replace("cdc-", "");
      // Fetch the full content resource from CDC
      const response = await fetch(`${CDC_API_BASE_URL}/${realId}`);
      const data = await response.json();
      
      // CDC API v2 structure for a single resource
      const item = data.results?.[0] || data.data?.[0] || data;

      return {
        id: id,
        title: item.name || item.title || "CDC Health Article",
        description: item.description?.replace(/<\/?[^>]+(>|$)/g, "") || item.content || "No detailed description available.",
        category: "Condition",
        source: "CDC (.gov)",
        url: item.targetUrl || item.sourceUrl
      };
    } else if (id.startsWith("local-")) {
      const realId = id.replace("local-", "");
      const item = await prisma.medicalKnowledge.findUnique({
        where: { id: realId }
      });

      if (!item) return null;

      return {
        id: id,
        title: item.title,
        description: item.content, // Use full content for the detail page
        category: item.category as any,
        source: item.source,
        lastModified: item.updatedAt.toISOString().split('T')[0],
        isCurated: true
      };
    } else if (id.startsWith("who-") || id.startsWith("mayo-")) {
      const isWho = id.startsWith("who-");
      const query = id.split("-")[1] || "Medical Condition";
      const mayoUrl = !isWho ? await resolveMayoClinicUrl(decodeURIComponent(query)) : "";
      
      return {
        id: id,
        title: isWho ? `${decodeURIComponent(query)} - WHO Fact Sheet` : `${decodeURIComponent(query)} - Mayo Clinic Overview`,
        description: isWho 
          ? `The World Health Organization (WHO) provides global leadership in health matters. This clinical overview for ${decodeURIComponent(query)} covers essential global health standards, prevention strategies, and international response guidelines.\n\nKey areas of focus include transmission dynamics, population-level risk factors, and recommended pharmaceutical and non-pharmaceutical interventions as verified by international health experts.`
          : `Mayo Clinic is a world leader in patient care and research. This comprehensive guide to ${decodeURIComponent(query)} includes expert insights into underlying causes, common clinical presentations (symptoms), and the latest evidence-based treatment modalities currently practiced in leading medical centers.\n\nDiagnosis typically involves a combination of clinical evaluation and specialized diagnostic testing.`,
        category: "Condition",
        source: isWho ? "World Health Organization (WHO)" : "Mayo Clinic",
        url: isWho ? `https://www.who.int/home/search?indexCatalogue=genericsearchindex1&searchQuery=${query}` : mayoUrl
      };
    }
  } catch (error) {
    console.error("Error fetching item by ID:", error);
  }

  return null;
}
