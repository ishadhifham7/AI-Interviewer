import { tavily } from "../../../config/tavily";

import {
  ResearchSource,
  SourceFinderInput,
} from "../interfaces/research.interface";

import { classifySourceType } from "../utils/classifySourceType";

export const findCompanySources = async ({
  companyName,
  role,
}: SourceFinderInput): Promise<ResearchSource[]> => {
  const searchQueries = [
    `${companyName} careers`,
    `${companyName} about`,
    `${companyName} engineering blog`,
    `${companyName} company culture`,
    `${companyName} ${role}`,
  ].filter((query) => {
    const lower = query.toLowerCase();
    return !lower.includes("linkedin");
  });

  // Prevent duplicate URLs
  const uniqueSources = new Map<string, ResearchSource>();

  for (const query of searchQueries) {
    try {
      const response = await tavily.search(query, {
        maxResults: 3,
      });

      const results = response.results || [];

      for (const result of results) {
        if (!result.url) continue;

        const normalizedUrl = result.url.trim().toLowerCase();

        // Skip duplicate URLs
        if (uniqueSources.has(normalizedUrl)) {
          continue;
        }

        // Skip social/media junk
        if (
          normalizedUrl.includes("facebook") ||
          normalizedUrl.includes("instagram") ||
          normalizedUrl.includes("twitter") ||
          normalizedUrl.includes("linkedin")
        ) {
          continue;
        }

        uniqueSources.set(normalizedUrl, {
          type: classifySourceType(result.url),
          url: result.url,
        });
      }
    } catch (error) {
      console.error(`Failed Tavily search for query: ${query}`, error);
    }
  }

  return Array.from(uniqueSources.values());
};
