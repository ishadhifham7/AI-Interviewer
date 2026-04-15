export type QuestionCategory =
  | "screening"
  | "project"
  | "technical"
  | "behavioural"
  | "challenge";

export type Difficulty = "easy" | "medium" | "hard";

export interface InterviewQuestion {
  id: number;
  category: QuestionCategory;
  question: string;
  difficulty: Difficulty;
  hint?: string;
}

export interface InterviewSession {
  candidateName: string;
  experience_level: string;
  questions: InterviewQuestion[];
  totalQuestions: number;
  generatedAt: string;
}

export interface GenerateInterviewBody {
  cvData: {
    name?: string;
    professional_summary?: string;
    skills?: string[];
    projects?: { name: string; technologies: string[]; description: string }[];
    experience?: { role: string; company: string; duration: string }[];
    education?: string[];
    achievements_and_volunteering?: string[];
    certifications?: string[];
    additional_information?: string;
    experience_level?: "junior" | "mid" | "senior";
  };
}
