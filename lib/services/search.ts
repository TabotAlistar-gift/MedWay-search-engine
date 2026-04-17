/**
 * MedWay Search Service
 * Handles integration with verified medical databases.
 */

const OPENFDA_BASE_URL = "https://api.fda.gov/drug/label.json";
const PUBMED_BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: "Drug" | "Condition" | "Research" | "Symptom";
  source: string;
  url?: string;
  lastModified?: string;
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
 * Unified search function
 */
export async function unifiedSearch(query: string): Promise<SearchResult[]> {
  if (!query) return [];

  // Parallel fetching
  const [drugs, research] = await Promise.all([
    searchDrugs(query),
    searchResearch(query)
  ]);

  return [...drugs, ...research];
}
