import { Router } from "express";
import {
  generateInterviewQuestions,
  startSession,
  getNextQuestion,
  submitAnswer,
  completeSession,
  getHistory,
} from "./interviewController";

const router = Router();

// Legacy batch generation
router.post("/generate", generateInterviewQuestions);

// Stateful interview session flow
router.post("/session/start", startSession);
router.get("/session/:sessionId/next", getNextQuestion);
router.post("/session/:sessionId/answer", submitAnswer);
router.post("/session/:sessionId/complete", completeSession);
router.get("/history", getHistory);

export default router;
