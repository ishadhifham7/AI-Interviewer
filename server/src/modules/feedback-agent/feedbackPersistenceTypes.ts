export type FeedbackSnapshot = {
  overall_score: number;
  interview_summary: string;
  strengths: string[];
  weaknesses: string[];
  final_mentor_advice: string;
};

export type FeedbackRecord = FeedbackSnapshot & {
  interviewId?: string;
  createdAt: FirebaseFirestore.Timestamp;
};

export type FeedbackRecordInput = FeedbackSnapshot & {
  interviewId?: string;
};

export type FeedbackPersistenceResult = {
  id: string;
};
