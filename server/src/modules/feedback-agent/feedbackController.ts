import { NextFunction, Request, Response } from "express";
import { generateFeedbackFromTranscript } from "./feedbackService";
import { InterviewTranscript } from "./core/types";

const isTranscript = (value: unknown): value is InterviewTranscript => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const transcript = value as InterviewTranscript;

  if (!Array.isArray(transcript.conversation)) {
    return false;
  }

  return transcript.conversation.every((entry) => {
    if (!entry || typeof entry !== "object") {
      return false;
    }

    const candidate = entry as { question?: unknown; answer?: unknown };

    return (
      typeof candidate.question === "string" &&
      typeof candidate.answer === "string"
    );
  });
};

export const generateFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = req.body?.transcript ?? req.body;
    const transcript = isTranscript(payload) ? payload : undefined;
    const feedback = await generateFeedbackFromTranscript(transcript);

    return res.status(200).json({
      success: true,
      feedback,
    });
  } catch (error) {
    return next(error);
  }
};
