import { InterviewQuestion } from "../interviewTypes";

const VALID_CATEGORIES = new Set(["screening", "project", "technical", "behavioural", "challenge"]);
const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard"]);

export class InterviewParser {
  //Strip markdown fences, parse JSON, and validate each question object.

  public static parse(rawResponse: string): InterviewQuestion[] | null {
    try {
      const cleaned = rawResponse
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const data = JSON.parse(cleaned);

      if (!Array.isArray(data) || data.length === 0) {
        console.warn("[InterviewParser] Response is not a non-empty array");
        return null;
      }

      const validated: InterviewQuestion[] = [];

      for (const item of data) {
        if (
          typeof item.id !== "number" ||
          typeof item.question !== "string" ||
          !item.question.trim() ||
          !VALID_CATEGORIES.has(item.category) ||
          !VALID_DIFFICULTIES.has(item.difficulty)
        ) {
          console.warn("[InterviewParser] Invalid question item skipped:", item);
          continue;
        }

        validated.push({
          id: item.id,
          category: item.category,
          question: item.question.trim(),
          difficulty: item.difficulty,
          hint: typeof item.hint === "string" ? item.hint.trim() : undefined,
        });
      }

      if (validated.length === 0) {
        console.warn("[InterviewParser] No valid questions after validation");
        return null;
      }

      return validated;
    } catch (error) {
      console.error("[InterviewParser] Failed to parse JSON:", error);
      return null;
    }
  }
}
