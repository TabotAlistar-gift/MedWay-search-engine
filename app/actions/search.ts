"use server";

import { prisma } from "@/lib/prisma";
import { unifiedSearch, getSearchOverview, getSearchSuggestions, SearchResult, SearchOverview } from "@/lib/services/search";


export async function saveSearchQuery(query: string, resultsCount: number) {
  if (!query || query.trim() === "") return;

  try {
    await prisma.searchQuery.create({
      data: {
        query: query.trim(),
        resultsCount,
        // userId: null // Anonymous for now, will attach user ID once auth is built
      },
    });
  } catch (error) {
    console.error("Failed to save search query:", error);
  }
}

export async function getRecentSearches(): Promise<string[]> {
  try {
    // Fetch the 5 most recent unique search queries
    const recentSearches = await prisma.searchQuery.findMany({
      orderBy: { createdAt: "desc" },
      take: 20, // Take more to allow filtering out duplicates in JS if needed
    });

    // Extract unique queries
    const uniqueQueries = Array.from(new Set<string>(recentSearches.map((s: { query: string }) => s.query))).slice(0, 5);
    return uniqueQueries;
  } catch (error) {
    console.error("Failed to fetch recent searches:", error);
    return [];
  }
}

export async function toggleSavedInsight(insight: {
  insightId: string;
  title: string;
  description?: string;
  category: string;
  source: string;
  url?: string;
}) {
  // Note: In a real app, we'd get the userId from the session.
  // For this demo/final project, we'll use a hardcoded demo user ID if one exists,
  // or create a default "demo-user" to show the functionality.
  
  const demoUserId = "demo-user-123";

  try {
    // Ensure the demo user exists
    await prisma.user.upsert({
      where: { email: "demo@medway.int" },
      update: {},
      create: {
        id: demoUserId,
        email: "demo@medway.int",
        name: "Demo User",
        passwordHash: "demo-hash",
      }
    });

    const existing = await prisma.savedInsight.findUnique({
      where: {
        userId_insightId: {
          userId: demoUserId,
          insightId: insight.insightId
        }
      }
    });

    if (existing) {
      await prisma.savedInsight.delete({
        where: { id: existing.id }
      });
      return { saved: false };
    } else {
      await prisma.savedInsight.create({
        data: {
          ...insight,
          userId: demoUserId
        }
      });
      return { saved: true };
    }
  } catch (error) {
    console.error("Failed to toggle saved insight:", error);
    throw new Error("Could not save insight");
  }
}

export async function getSavedInsightIds(): Promise<string[]> {
  const demoUserId = "demo-user-123";
  try {
    const saved = await prisma.savedInsight.findMany({
      where: { userId: demoUserId },
      select: { insightId: true }
    });
    return saved.map(s => s.insightId);
  } catch (error) {
    return [];
  }
}

/**
 * Perform a unified search across all medical sources
 */
export async function performUnifiedSearch(query: string) {
  try {
    const results = await unifiedSearch(query);
    // Log the search for analytics
    await saveSearchQuery(query, results.length);
    return results;
  } catch (error) {
    console.error("Search action failed:", error);
    return [];
  }
}

/**
 * Get an AI-analyzed overview of a medical query
 */
export async function getAIOverview(query: string, results: SearchResult[] = []): Promise<SearchOverview | null> {
  try {
    return await getSearchOverview(query, results);
  } catch (error) {
    console.error("AI Overview action failed:", error);
    return null;
  }
}

/**
 * Get search suggestions/spelling corrections
 */
export async function getAISuggestions(query: string): Promise<string | null> {
  try {
    return await getSearchSuggestions(query);
  } catch (error) {
    return null;
  }
}


