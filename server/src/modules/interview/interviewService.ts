import { InterviewAIModel } from "./ai/interviewAIModel";
import { GenerateInterviewBody, InterviewSession } from "./interviewTypes";

export const generateInterviewSession = async (
  cvData: GenerateInterviewBody["cvData"],
): Promise<InterviewSession> => {
  const model = new InterviewAIModel();
  return model.generateQuestions(cvData);
};
