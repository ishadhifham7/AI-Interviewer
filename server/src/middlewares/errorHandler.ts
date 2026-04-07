// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";

// Custom Error Interface (optional)
interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ Error:", err.message);

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    error: message,
  });
};