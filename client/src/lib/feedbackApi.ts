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

type HistoryResponse = {
  success: boolean;
  history: any[]; // Or define the type properly
};

export const getInterviewHistory = async (): Promise<any[]> => {
  const response = await api.get<HistoryResponse>("/feedback/history");
  return response.data.history;
};
