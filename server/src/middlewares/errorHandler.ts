// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import multer from "multer";

// Custom Error Interface (optional)
interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("❌ Error:", err.message);

  if (err instanceof multer.MulterError) {
    const uploadErrorMessage =
      err.code === "LIMIT_FILE_SIZE"
        ? "File is too large. Maximum allowed size is 5MB"
        : err.message;

    return res.status(400).json({
      success: false,
      error: uploadErrorMessage,
    });
  }

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(status).json({
    success: false,
    error: message,
  });
};
