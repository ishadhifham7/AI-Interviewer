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

// ── Per-Answer Live Score ────────────────────────────────────────────────────

export interface LiveScore {
  clarity: number; // 0-10
  relevance: number; // 0-10
  depth: number; // 0-10
  overall: number; // weighted average
  feedback: string; // one-line AI comment
}

// ── Answer Entry ─────────────────────────────────────────────────────────────

export interface AnswerEntry {
  questionId: number;
  question: string;
  answer: string;
  score?: LiveScore;
  answeredAt: string;
}

// ── Active Interview Session (stateful) ──────────────────────────────────────

export interface ActiveInterviewSession {
  sessionId: string;
  candidateName: string;
  targetRole: string;
  experience_level: "junior" | "mid" | "senior";
  questions: InterviewQuestion[];
  answers: AnswerEntry[];
  currentQuestionIndex: number;
  status: "active" | "completed";
  startedAt: string;
  completedAt?: string;
}

// ── Request Bodies ───────────────────────────────────────────────────────────

export interface StartSessionBody {
  cvData: GenerateInterviewBody["cvData"];
  targetRole?: string;
}

export interface SubmitAnswerBody {
  questionId: number;
  answer: string;
}

