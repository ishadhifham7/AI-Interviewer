import { firecrawl } from "../../../config/firecrawl";

import {
  ResearchSource,
  RetrievedContent,
} from "../interfaces/research.interface";

export const retrieveCompanyContent = async (
  sources: ResearchSource[],
): Promise<RetrievedContent[]> => {
  const retrievedContent: RetrievedContent[] = [];

  for (const source of sources) {
    try {
      const response = await firecrawl.scrape(source.url, {
        formats: ["markdown"],
      });

      const markdown = response.markdown;

      // Skip empty content
      if (
        !markdown ||
        typeof markdown !== "string" ||
        markdown.trim().length < 100
      ) {
        console.warn(`Insufficient content from URL: ${source.url}`);
        continue;
      }

      retrievedContent.push({
        source: source.type,
        url: source.url,
        content: markdown,
      });
    } catch (error) {
      console.error(`Failed to retrieve content from: ${source.url}`, error);
    }
  }

  return retrievedContent;
};
