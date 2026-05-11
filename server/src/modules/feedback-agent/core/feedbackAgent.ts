import { InterviewTranscript, Feedback } from "./types";
import { OllamaClient } from "../../shared/aiClient/ollamaClient";
import { buildPrompt } from "./promptBuilder";

export class FeedbackAgent {
  private client: OllamaClient;

  constructor() {
    this.client = new OllamaClient();
  }

  async generate(transcript: InterviewTranscript): Promise<Feedback> {
    // Step 1: build prompt optimized for Gemma 4
    const prompt = buildPrompt(transcript);

    // Step 2: Call Gemma 4 via Ollama
    try {
      const rawText = await this.client.generate(prompt, { temperature: 0.4 });
      return this.parseFeedbackResponse(rawText);
    } catch (error) {
      console.error("[FeedbackAgent] Failed to generate feedback with Gemma 4:", error);
      throw new Error("Failed to generate final feedback report");
    }
  }

  private parseFeedbackResponse(rawResponse: string): Feedback {
    try {
      // Strip markdown code fences if present
      const cleaned = rawResponse
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const data = JSON.parse(cleaned);

      // Basic validation to ensure the shape matches the Feedback type
      if (
        typeof data.overall_score !== "number" ||
        typeof data.interview_summary !== "string" ||
        !Array.isArray(data.strengths) ||
        !Array.isArray(data.weaknesses)
      ) {
        throw new Error("Invalid feedback format returned by AI");
      }

      return data as Feedback;
    } catch (error) {
      console.error("[FeedbackAgent] JSON parsing error:", error, "Raw:", rawResponse);
      throw new Error("Failed to parse the feedback report from the AI");
    }
  }
}
