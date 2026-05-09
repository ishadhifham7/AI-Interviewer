import { tavily as createTavily } from "@tavily/core";

export const tavily = createTavily({
  apiKey: process.env.TAVILY_API_KEY!,
});
