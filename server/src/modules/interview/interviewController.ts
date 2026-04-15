import { NextFunction, Request, Response } from "express";
import { generateInterviewSession } from "./interviewService";
import { GenerateInterviewBody } from "./interviewTypes";

const createHttpError = (message: string, statusCode: number) => {
  const err = new Error(message) as Error & { statusCode?: number };
  err.statusCode = statusCode;
  return err;
};

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

    const session = await generateInterviewSession(body.cvData);

    console.log(
      "[Interview] Generated session for:",
      session.candidateName,
      "| Questions:",
      session.totalQuestions,
    );

    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    return next(error);
  }
};
