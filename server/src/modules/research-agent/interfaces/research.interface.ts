export type ResearchSourceType =
  | "careers"
  | "about"
  | "engineering_blog"
  | "general";

export interface ResearchSource {
  type: ResearchSourceType;
  url: string;
}

export interface SourceFinderInput {
  companyName: string;
  role: string;
}
