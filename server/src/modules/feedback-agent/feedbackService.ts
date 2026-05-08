import { Feedback } from "./core/types";
import { InterviewTranscript } from "./core/types";
import { FeedbackAgent } from "./core/feedbackAgent";
import { mockTranscript } from "./mocks/mockTranscript";

export const generateFeedbackFromTranscript = async (
  transcript?: InterviewTranscript,
): Promise<Feedback> => {
  const agent = new FeedbackAgent();
  const inputTranscript = transcript ?? mockTranscript;

  return agent.generate(inputTranscript);
};
