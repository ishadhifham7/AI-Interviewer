import { RetrievedContent } from "../interfaces/research.interface";

interface CleanedContent {
  source: string;
  url: string;
  content: string;
}

const MIN_LINE_LENGTH = 25;
const MIN_CONTENT_LENGTH = 120;

const IMAGE_CDN_HINTS = [
  "framerusercontent",
  "cloudfront",
  "cloudflare",
  "gstatic",
  "googleusercontent",
  "ytimg",
  "imgix",
  "images.ctfassets",
  "cdn.",
  "static.",
];

const NAV_KEYWORDS = [
  "home",
  "about",
  "contact",
  "menu",
  "search",
  "sign in",
  "sign up",
  "log in",
  "register",
  "subscribe",
  "newsletter",
  "privacy",
  "terms",
  "cookie",
  "accessibility",
  "sitemap",
  "facebook",
  "instagram",
  "twitter",
  "linkedin",
  "youtube",
  "press",
  "blog",
  "docs",
  "developers",
  "support",
  "help",
  "faq",
  "account",
  "settings",
  "pricing",
  "book a demo",
  "get started",
  "try for free",
  "all rights reserved",
];

const PAREN_URL_REGEX = /\((?:https?:\/\/|www\.)[^\s)\]]+\)/gi;
const URL_REGEX = /\b(?:https?:\/\/|www\.)\S+/gi;
const HTTP_URL_REGEX = /https?:\/\/\S+/gi;
const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const DOMAIN_REGEX =
  /\b[a-z0-9.-]+\.(com|io|dev|net|org|co|ai|app|edu|gov|us|uk|de|fr|au|jp|cn|in|nl|se|no|fi|br|ca|es|it|ch|info|biz|me)\b/gi;
const DOMAIN_PATH_REGEX =
  /\b[a-z0-9.-]+\.(com|io|dev|net|org|co|ai|app|edu|gov|us|uk|de|fr|au|jp|cn|in|nl|se|no|fi|br|ca|es|it|ch|info|biz|me)(?:\/[\w\-._~%!$&'()*+,;=:@]+)+/gi;
const IMAGE_EXT_REGEX = /\b[^\s)\]]+\.(png|jpg|jpeg|gif|svg|webp)(\?.*)?\b/gi;

const stripHtml = (input: string): string => {
  let text = input;
  text = text.replace(/\r\n?/g, "\n");
  text = text.replace(/<!--[\s\S]*?-->/g, " ");
  text = text.replace(/<script[\s\S]*?<\/script>/gi, " ");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, " ");
  text = text.replace(/<img[^>]*>/gi, " ");
  text = text.replace(/<a\s+[^>]*>([\s\S]*?)<\/a>/gi, "$1");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(
    /<\/(p|div|section|article|li|ul|ol|header|footer|nav|h[1-6])>/gi,
    "\n",
  );
  text = text.replace(/<[^>]+>/g, " ");
  return text;
};

const stripMarkdown = (input: string): string => {
  let text = input;
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
  text = text.replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1");
  text = text.replace(/^\s*\[[^\]]+\]:\s*\S+\s*$/gm, " ");
  return text;
};

const stripUrls = (input: string): string => {
  let text = input;
  text = text.replace(EMAIL_REGEX, " ");
  text = text.replace(PAREN_URL_REGEX, " ");
  text = text.replace(HTTP_URL_REGEX, " ");
  text = text.replace(URL_REGEX, " ");
  text = text.replace(DOMAIN_PATH_REGEX, " ");
  text = text.replace(IMAGE_EXT_REGEX, " ");
  text = text.replace(DOMAIN_REGEX, " ");
  text = text.replace(/\(\s*\)/g, " ");
  return text;
};

const normalizeWhitespace = (input: string): string => {
  return input
    .replace(/[\t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const isMostlySymbols = (line: string): boolean => {
  const stripped = line.replace(/[A-Za-z0-9]/g, "").trim();
  if (!stripped) return false;
  return stripped.length / line.length > 0.5;
};

const isNavigationLine = (line: string): boolean => {
  const lower = line.toLowerCase();
  const keywordHits = NAV_KEYWORDS.filter((k) => lower.includes(k)).length;
  const separatorHits = (lower.match(/[|•·/]/g) || []).length;

  if (line.length < 80 && keywordHits >= 2) return true;
  if (separatorHits >= 2 && keywordHits >= 2) return true;

  const menuPattern =
    /^(home|about|contact|blog|careers|jobs|team|press|privacy|terms)(\s*[|•/]+\s*(home|about|contact|blog|careers|jobs|team|press|privacy|terms))+$/i;
  if (menuPattern.test(line.trim())) return true;

  const ctaPattern =
    /(book a demo|get started|try for free|sign up|log in|subscribe)/i;
  if (line.length < 70 && ctaPattern.test(line)) return true;

  return false;
};

const isImageOrEmbedLine = (line: string): boolean => {
  const lower = line.toLowerCase();
  if (lower.includes("<img") || lower.includes("data:image")) return true;
  if (IMAGE_EXT_REGEX.test(line)) return true;
  if (
    lower.includes("youtube") ||
    lower.includes("youtu.be") ||
    lower.includes("ytimg")
  )
    return true;
  return IMAGE_CDN_HINTS.some((hint) => lower.includes(hint));
};

const isLowSignalLine = (line: string): boolean => {
  if (line.length < MIN_LINE_LENGTH) return true;
  if (isMostlySymbols(line)) return true;
  if (isNavigationLine(line)) return true;
  if (isImageOrEmbedLine(line)) return true;
  return false;
};

const normalizeForDedup = (line: string): string => {
  return line
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const cleanRetrievedContent = (
  contents: RetrievedContent[],
): CleanedContent[] => {
  const cleanedResults: CleanedContent[] = [];

  for (const item of contents) {
    if (!item.content || typeof item.content !== "string") continue;

    let text = item.content;
    text = stripHtml(text);
    text = stripMarkdown(text);
    text = stripUrls(text);
    text = normalizeWhitespace(text);

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const seen = new Set<string>();
    const keptLines: string[] = [];

    for (const line of lines) {
      const cleanedLine = stripUrls(line).replace(/\s+/g, " ").trim();
      if (!cleanedLine) continue;
      if (isLowSignalLine(cleanedLine)) continue;

      const dedupKey = normalizeForDedup(cleanedLine);
      if (!dedupKey) continue;
      if (seen.has(dedupKey)) continue;

      seen.add(dedupKey);
      keptLines.push(cleanedLine);
    }

    const cleanedText = keptLines.join("\n\n").trim();
    if (cleanedText.length < MIN_CONTENT_LENGTH) continue;

    cleanedResults.push({
      source: item.source,
      url: item.url,
      content: cleanedText,
    });
  }

  return cleanedResults;
};
