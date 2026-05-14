import { NextFunction, Request, Response } from "express";
import * as interviewService from "./interviewService";
import { GenerateInterviewBody, StartSessionBody, SubmitAnswerBody } from "./interviewTypes";

const createHttpError = (message: string, statusCode: number) => {
  const err = new Error(message) as Error & { statusCode?: number };
  err.statusCode = statusCode;
  return err;
};

// ── Legacy Route ─────────────────────────────────────────────────────────────

export const generateInterviewQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as GenerateInterviewBody;
    if (!body?.cvData || typeof body.cvData !== "object") {
      throw createHttpError("Missing or invalid cvData in request body", 400);
    }
    const session = await interviewService.generateInterviewSession(body.cvData);
    return res.status(200).json({ success: true, session });
  } catch (error) {
    return next(error);
  }
};

// ── Stateful Routes ──────────────────────────────────────────────────────────

export const startSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as StartSessionBody;
    if (!body?.cvData || typeof body.cvData !== "object") {
      throw createHttpError("Missing or invalid cvData in request body", 400);
    }

    const session = await interviewService.startSession(body.cvData, body.targetRole);
    
    return res.status(201).json({
      success: true,
      sessionId: session.sessionId,
      session,
    });
  } catch (error) {
    return next(error);
  }
};

export const getNextQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) throw createHttpError("Session ID is required", 400);

    const nextQuestion = await interviewService.getNextQuestion(sessionId);
    
    return res.status(200).json({
      success: true,
      question: nextQuestion,
      isComplete: nextQuestion === null,
    });
  } catch (error) {
    return next(error);
  }
};

export const submitAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sessionId } = req.params;
    const body = req.body as SubmitAnswerBody;

    if (!sessionId) throw createHttpError("Session ID is required", 400);
    if (!body?.questionId || !body?.answer) {
      throw createHttpError("questionId and answer are required", 400);
    }

    const result = await interviewService.submitAnswer(
      sessionId,
      body.questionId,
      body.answer,
    );

    return res.status(200).json({
      success: true,
      score: result.score,
      nextQuestion: result.nextQuestion,
      isComplete: result.nextQuestion === null,
    });
  } catch (error) {
    return next(error);
  }
};

export const completeSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) throw createHttpError("Session ID is required", 400);

    const session = await interviewService.completeSession(sessionId);
    
    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    return next(error);
  }
};

export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const history = await interviewService.getHistory();
    
    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    return next(error);
  }
};
