export type InterviewQA = {
  question: string;
  answer: string;
};

export type InterviewTranscript = {
  conversation: InterviewQA[];
};

export type QuestionAnalysis = {
  question: string;
  evaluation: string;
  score: number;
  what_went_wrong: string;
  improvement_suggestion: string;
};

export type Feedback = {
  overall_score: number;
  interview_summary: string;
  strengths: string[];
  weaknesses: string[];
  question_analysis: QuestionAnalysis[];
  communication_analysis: {
    clarity: number;
    structure: number;
    technical_depth: number;
  };
  final_mentor_advice: string;
  next_steps: string[];
};
