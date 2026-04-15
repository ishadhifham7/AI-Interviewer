import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { buildInterviewPrompt } from "./interviewAIPrompt";
import { InterviewParser } from "./interviewParser";
import { GenerateInterviewBody, InterviewSession } from "../interviewTypes";
dotenv.config();

export class InterviewAIModel {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_INTERVIEW_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_INTERVIEW_API_KEY not set in environment variables");
    }

    console.log("[InterviewModel] Using API key: GEMINI_INTERVIEW_API_KEY");
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  }


  //Generate an interview session using the CV data.

  public async generateQuestions(
    cvData: GenerateInterviewBody["cvData"],
  ): Promise<InterviewSession> {
    const cvDataJson = JSON.stringify(cvData, null, 2);
    const prompt = buildInterviewPrompt(cvDataJson);

    let lastError: unknown;

    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rawText = response.text();

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
      console.error(`[InterviewModel] Model ${this.modelName} failed:`, error);
    }

    console.error("[InterviewModel] API Error:", (lastError as any)?.message || lastError);

    const aiError = new Error("Failed to generate interview questions") as Error & {
      statusCode?: number;
    };

    const errorMessage = String((lastError as any)?.message || "");

    if (
      (lastError as any)?.status === 429 ||
      errorMessage.includes("RESOURCE_EXHAUSTED") ||
      errorMessage.includes("quota")
    ) {
      aiError.statusCode = 503;
      aiError.message =
        "Interview AI service quota exceeded. Please check GEMINI_INTERVIEW_API_KEY billing/quota and retry.";
    } else if (
      (lastError as any)?.status === 503 ||
      errorMessage.includes("UNAVAILABLE") ||
      errorMessage.includes("high demand")
    ) {
      aiError.statusCode = 503;
      aiError.message =
        "Interview AI model is temporarily unavailable. Please retry in a few moments.";
    } else if ((lastError as any)?.status === 404) {
      aiError.statusCode = 500;
      aiError.message =
        "No supported Gemini model was found. Set GEMINI_MODEL to a valid model name.";
    } else {
      aiError.statusCode = 500;
    }

    throw aiError;
  }
}
