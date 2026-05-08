import { Feedback } from "./core/types";
import {
  FeedbackPersistenceResult,
  FeedbackRecordInput,
} from "./feedbackPersistenceTypes";
import { getFeedbackHistory, saveFeedbackRecord } from "./feedbackRepository";

const ensureStringArray = (value: unknown, field: string): string[] => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Invalid feedback field: ${field}`);
  }

  return value;
};

const buildFeedbackRecord = (
  feedback: Feedback,
  interviewId?: string,
): FeedbackRecordInput => {
  if (typeof feedback.overall_score !== "number") {
    throw new Error("Invalid feedback field: overall_score");
  }

  if (typeof feedback.interview_summary !== "string") {
    throw new Error("Invalid feedback field: interview_summary");
  }

  if (typeof feedback.final_mentor_advice !== "string") {
    throw new Error("Invalid feedback field: final_mentor_advice");
  }

  return {
    overall_score: feedback.overall_score,
    interview_summary: feedback.interview_summary,
    strengths: ensureStringArray(feedback.strengths, "strengths"),
    weaknesses: ensureStringArray(feedback.weaknesses, "weaknesses"),
    final_mentor_advice: feedback.final_mentor_advice,
    ...(interviewId ? { interviewId } : {}),
  };
};

export const persistFeedbackSnapshot = async (
  feedback: Feedback,
  interviewId?: string,
): Promise<FeedbackPersistenceResult> => {
  const record = buildFeedbackRecord(feedback, interviewId);
  const result = await saveFeedbackRecord(record);

  console.log("[Feedback Persistence] Saved", {
    id: result.id,
    interviewId: interviewId ?? null,
  });

  return result;
};

export const fetchFeedbackHistory = async () => {
  return getFeedbackHistory();
};
