import { ResearchSourceType } from "../interfaces/research.interface";

export const classifySourceType = (url: string): ResearchSourceType => {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("career") || lowerUrl.includes("job")) {
    return "careers";
  }

  if (lowerUrl.includes("about")) {
    return "about";
  }

  if (lowerUrl.includes("blog") || lowerUrl.includes("engineering")) {
    return "engineering_blog";
  }

  return "general";
};
