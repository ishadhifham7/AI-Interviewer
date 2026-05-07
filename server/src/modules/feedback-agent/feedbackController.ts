import { NextFunction, Request, Response } from "express";
import { generateFeedbackFromTranscript } from "./feedbackService";
import { InterviewTranscript } from "./core/types";
import {
  fetchFeedbackHistory,
  persistFeedbackSnapshot,
} from "./feedbackPersistenceService";

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
    const interviewId =
      typeof req.body?.interviewId === "string"
        ? req.body.interviewId
        : undefined;
    const feedback = await generateFeedbackFromTranscript(transcript);
    const record = await persistFeedbackSnapshot(feedback, interviewId);

    return res.status(200).json({
      success: true,
      feedback,
      recordId: record.id,
    });
  } catch (error) {
    return next(error);
  }
};

export const getFeedbackHistory = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const history = await fetchFeedbackHistory();

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    return next(error);
  }
};
