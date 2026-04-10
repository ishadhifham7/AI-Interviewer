// server/src/modules/cv/ai/cvParser.ts
import { CVData } from "../cvTypes";

export class CVParser {
  /**
   * Extract JSON from raw AI output, validate, and return object
   * @param rawResponse string AI raw text
   * @returns structured CV object
   */
  public static parse(rawResponse: string): CVData | null {
    try {
      // Remove possible ```json ... ``` blocks
      const cleaned = rawResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // Parse JSON
      const data = JSON.parse(cleaned);

      // Optional: basic validation
      if (
        typeof data.name !== "string" ||
        !Array.isArray(data.skills) ||
        !Array.isArray(data.projects) ||
        !Array.isArray(data.experience) ||
        !Array.isArray(data.education) ||
        !["junior", "mid", "senior"].includes(data.experience_level)
      ) {
        console.warn("[CVParser] Validation failed");
        return null;
      }

      return data as CVData;
    } catch (error) {
      console.error("[CVParser] Failed to parse JSON:", error);
      return null;
    }
  }
}
