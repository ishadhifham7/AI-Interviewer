import { InterviewAIModel } from "./ai/interviewAIModel";
import { InterviewEvaluator } from "./ai/interviewEvaluator";
import { getNextQuestion as getNextAdaptedQuestion } from "./interviewAdaptor";
import {
  createSession,
  getSession,
  updateSession,
  deleteSession,
} from "./interviewSessionStore";
import { saveInterviewSession, getInterviewHistory } from "./interviewRepository";
import {
  GenerateInterviewBody,
  ActiveInterviewSession,
  InterviewQuestion,
  LiveScore,
} from "./interviewTypes";

// Initialize AI services
const model = new InterviewAIModel();
const evaluator = new InterviewEvaluator();

/**
 * Legacy method (kept for backwards compatibility during migration).
 */
export const generateInterviewSession = async (
  cvData: GenerateInterviewBody["cvData"],
) => {
  return model.generateQuestions(cvData);
};

/**
 * 1. Start a new stateful interview session.
 */
export const startSession = async (
  cvData: GenerateInterviewBody["cvData"],
  targetRole?: string,
): Promise<ActiveInterviewSession> => {
  // Generate the initial questions using Gemma 4
  const generated = await model.generateQuestions(cvData);

  // Initialize the session state
  const session = createSession({
    candidateName: cvData.name || "Candidate",
    targetRole: targetRole || "General Candidate",
    experience_level: cvData.experience_level || "junior",
    questions: generated.questions,
    answers: [],
    currentQuestionIndex: 0,
    status: "active",
    startedAt: new Date().toISOString(),
  });

  return session;
};

/**
 * 2. Get the next question for an active session.
 */
export const getNextQuestion = async (
  sessionId: string,
): Promise<InterviewQuestion | null> => {
  const session = getSession(sessionId);
  if (!session) throw new Error("Session not found");
  if (session.status === "completed") throw new Error("Session is already completed");

  // Run the adaptor logic to pick the best next question based on performance
  const nextQ = getNextAdaptedQuestion(session);
  return nextQ;
};

/**
 * 3. Submit an answer, evaluate it, and advance the session.
 */
export const submitAnswer = async (
  sessionId: string,
  questionId: number,
  answerText: string,
): Promise<{ score: LiveScore; nextQuestion: InterviewQuestion | null }> => {
  const session = getSession(sessionId);
  if (!session) throw new Error("Session not found");
  if (session.status === "completed") throw new Error("Session is already completed");

  const questionIndex = session.questions.findIndex((q) => q.id === questionId);
  if (questionIndex === -1) throw new Error("Question not found in this session");

  const question = session.questions[questionIndex];

  // Evaluate the answer using Gemma 4
  const score = await evaluator.evaluate(
    question.question,
    answerText,
    question.category,
  );

  // Record the answer and score
  const updatedAnswers = [
    ...session.answers,
    {
      questionId,
      question: question.question,
      answer: answerText,
      score,
      answeredAt: new Date().toISOString(),
    },
  ];

  // Update session state
  updateSession(sessionId, {
    answers: updatedAnswers,
    currentQuestionIndex: session.currentQuestionIndex + 1,
  });

  // Check if we have a next question
  const updatedSession = getSession(sessionId)!;
  const nextQuestion = getNextAdaptedQuestion(updatedSession);

  if (!nextQuestion) {
    // Automatically complete if there are no more questions
    await completeSession(sessionId);
  }

  return { score, nextQuestion };
};

/**
 * 4. Complete a session early or explicitly.
 */
export const completeSession = async (
  sessionId: string,
): Promise<ActiveInterviewSession> => {
  const session = getSession(sessionId);
  if (!session) throw new Error("Session not found");

  // If already completed and removed, we might not find it, 
  // or it might still be in the process. We assume getSession found it.
  
  const completedSession = updateSession(sessionId, {
    status: "completed",
    completedAt: new Date().toISOString(),
  });

  if (!completedSession) {
      throw new Error("Failed to update session status to completed");
  }

  // Persist to Firestore
  await saveInterviewSession(completedSession);
  
  // Clean up memory
  deleteSession(sessionId);

  return completedSession;
};

/**
 * 5. Get the history of completed sessions.
 */
export const getHistory = async () => {
    return await getInterviewHistory();
}


