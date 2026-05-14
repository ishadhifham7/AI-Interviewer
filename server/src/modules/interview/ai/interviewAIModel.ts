import { OllamaClient } from "../../shared/aiClient/ollamaClient";
import { buildInterviewPrompt } from "./interviewAIPrompt";
import { InterviewParser } from "./interviewParser";
import { GenerateInterviewBody, InterviewSession } from "../interviewTypes";

export class InterviewAIModel {
  private client: OllamaClient;

  constructor() {
    this.client = new OllamaClient();
    console.log(
      "[InterviewModel] Using Gemma 4 via Ollama at:",
      process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    );
  }

  //Generate an interview session using the CV data.

  public async generateQuestions(
    cvData: GenerateInterviewBody["cvData"],
  ): Promise<InterviewSession> {
    const cvDataJson = JSON.stringify(cvData, null, 2);
    const prompt = buildInterviewPrompt(cvDataJson);

    let lastError: unknown;

    try {
      const rawText = await this.client.generate(prompt, {
        temperature: 0.7,
      });

      const questions = InterviewParser.parse(rawText);

      if (!questions) {
        throw new Error("AI response could not be parsed into valid interview questions");
      }

      return {
        candidateName: cvData.name || "Candidate",
        experience_level: cvData.experience_level || "junior",
        questions,
        totalQuestions: questions.length,
        generatedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      lastError = error;
      console.error("[InterviewModel] Gemma 4 generation failed:", error);
    }

    console.error("[InterviewModel] Error:", (lastError as any)?.message || lastError);

    const aiError = new Error("Failed to generate interview questions") as Error & {
      statusCode?: number;
    };

    const errorMessage = String((lastError as any)?.message || "");

    if (errorMessage.includes("ECONNREFUSED") || errorMessage.includes("Cannot reach")) {
      aiError.statusCode = 503;
      aiError.message =
        "Cannot reach Ollama server. Ensure Ollama is running with: ollama serve";
    } else if (errorMessage.includes("not found")) {
      aiError.statusCode = 500;
      aiError.message =
        "Gemma model not found in Ollama. Pull it with: ollama pull gemma3";
    } else {
      aiError.statusCode = 500;
    }

    throw aiError;
  }
}
