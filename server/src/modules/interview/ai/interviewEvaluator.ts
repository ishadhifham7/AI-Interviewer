import { OllamaClient } from "../../shared/aiClient/ollamaClient";
import { buildEvalPrompt } from "./interviewAIPrompt";
import { LiveScore } from "../interviewTypes";

export class InterviewEvaluator {
  private client: OllamaClient;

  constructor() {
    this.client = new OllamaClient();
  }

  /**
   * Evaluate a candidate's answer using Gemma 4.
   * Returns a parsed LiveScore object.
   */
  public async evaluate(
    question: string,
    answer: string,
    category: string,
  ): Promise<LiveScore> {
    const prompt = buildEvalPrompt(question, answer, category);

    try {
      // Lower temperature for evaluation to ensure more consistent formatting
      const rawText = await this.client.generate(prompt, { temperature: 0.2 });
      return this.parseEvaluation(rawText);
    } catch (error) {
      console.error("[InterviewEvaluator] Failed to evaluate answer:", error);
      // Fallback score if AI evaluation fails, to avoid breaking the interview flow
      return {
        clarity: 5,
        relevance: 5,
        depth: 5,
        overall: 5,
        feedback: "We could not process the evaluation for this answer.",
      };
    }
  }

  /**
   * Parse the JSON response from Gemma 4.
   */
  private parseEvaluation(rawResponse: string): LiveScore {
    try {
      // Strip out markdown code fences if Gemma added them despite the prompt
      const cleaned = rawResponse
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const data = JSON.parse(cleaned);

      // Validate the expected fields
      if (
        typeof data.clarity !== "number" ||
        typeof data.relevance !== "number" ||
        typeof data.depth !== "number" ||
        typeof data.overall !== "number" ||
        typeof data.feedback !== "string"
      ) {
        throw new Error("Invalid evaluation format returned by AI");
      }

      return {
        clarity: Math.min(10, Math.max(0, data.clarity)),
        relevance: Math.min(10, Math.max(0, data.relevance)),
        depth: Math.min(10, Math.max(0, data.depth)),
        overall: Math.min(10, Math.max(0, data.overall)),
        feedback: data.feedback.trim(),
      };
    } catch (error) {
      console.error("[InterviewEvaluator] JSON parsing error:", error, "Raw:", rawResponse);
      throw error;
    }
  }
}
