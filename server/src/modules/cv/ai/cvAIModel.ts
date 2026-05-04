// server/src/modules/cv/ai/cvModel.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";
import { buildCVPrompt } from "./cvAIPrompt";
import { CVParser } from "./cvParser";
import { CVData } from "../cvTypes";
dotenv.config();

export class CVModel {
  private genAI: GoogleGenerativeAI;
  private preferredModel: string;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not set in environment variables");
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.preferredModel = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  }
  // gemini-3.1-flash-lite-preview

  /**
   * Send PDF bytes directly to Gemini and return structured JSON output.
   */
  public async generateStructuredFromPdf(filePath: string): Promise<CVData> {
    const modelCandidates = [this.preferredModel];

    const triedModels = new Set<string>();
    let lastError: unknown;

    try {
      const pdfBuffer = fs.readFileSync(filePath);
      const pdfBase64 = pdfBuffer.toString("base64");
      const prompt = buildCVPrompt();

      for (const modelName of modelCandidates) {
        if (triedModels.has(modelName)) {
          continue;
        }
        triedModels.add(modelName);

        try {
          const model = this.genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent([
            {
              text: prompt,
            },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: pdfBase64,
              },
            },
          ]);

          const response = await result.response;
          const rawText = response.text();
          const parsed = CVParser.parse(rawText);

          if (!parsed) {
            throw new Error(
              "AI response could not be parsed into valid CV JSON",
            );
          }

          return parsed;
        } catch (modelError) {
          lastError = modelError;
          console.error(`[CVModel] Model ${modelName} failed:`, modelError);
        }
      }

      throw lastError;
    } catch (error: any) {
      console.error("[CVModel] API Error:", error.message || error);
      const aiError = new Error(
        "Failed to process CV PDF with Gemini",
      ) as Error & {
        statusCode?: number;
      };
      const errorMessage = String(error?.message || "");

      if (
        error?.status === 429 ||
        errorMessage.includes("RESOURCE_EXHAUSTED") ||
        errorMessage.includes("quota")
      ) {
        aiError.statusCode = 503;
        aiError.message =
          "AI service quota exceeded. Please check Gemini API billing/quota and retry.";
      } else if (
        error?.status === 503 ||
        errorMessage.includes("UNAVAILABLE") ||
        errorMessage.includes("high demand")
      ) {
        aiError.statusCode = 503;
        aiError.message =
          "Gemini model is temporarily unavailable due to high demand. Please retry in a few moments.";
      } else if (error?.status === 404) {
        aiError.statusCode = 500;
        aiError.message =
          "No supported Gemini model was found. Set GEMINI_MODEL to a valid model name.";
      } else {
        aiError.statusCode = 500;
      }

      throw aiError;
    }
  }
}
