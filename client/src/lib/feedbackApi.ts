import api from "./api";
import { Feedback } from "../types/feedback";

type FeedbackResponse = {
  success: boolean;
  feedback: Feedback;
};

export const generateInterviewFeedback = async (): Promise<Feedback> => {
  const response = await api.post<FeedbackResponse>("/feedback/generate", {});

  return response.data.feedback;
};
