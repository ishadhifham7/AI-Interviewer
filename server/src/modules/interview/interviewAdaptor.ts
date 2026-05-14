import { ActiveInterviewSession, InterviewQuestion } from "./interviewTypes";

/**
 * Deterministic adaptor logic to select the next question.
 * Uses the LiveScore of the last answer to adjust difficulty or category focus.
 */
export const getNextQuestion = (
  session: ActiveInterviewSession,
): InterviewQuestion | null => {
  const remainingQuestions = session.questions.slice(session.currentQuestionIndex);
  
  // If no questions are left, the interview is over
  if (remainingQuestions.length === 0) {
    return null;
  }

  const lastAnswer = session.answers.at(-1);

  // If there's no previous answer (first question) or no score, just return the next in sequence
  if (!lastAnswer?.score) {
    return remainingQuestions[0];
  }

  const { overall } = lastAnswer.score;
  const lastCategory = session.questions[session.currentQuestionIndex - 1]?.category;

  // Rule 1: Poor performance (< 4) -> Try to find an easier question, or stick to the same category
  if (overall < 4) {
    const easierOrSame = remainingQuestions.find(
      (q) => q.difficulty === "easy" || q.category === lastCategory,
    );
    return easierOrSame ?? remainingQuestions[0];
  }

  // Rule 2: Excellent performance (>= 8) -> Try to find a harder question
  if (overall >= 8) {
    const harder = remainingQuestions.find((q) => q.difficulty === "hard");
    return harder ?? remainingQuestions[0];
  }

  // Rule 3: Average performance -> Return next question in default sequence
  return remainingQuestions[0];
};
