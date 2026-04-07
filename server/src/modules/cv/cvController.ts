import { NextFunction, Request, Response } from "express";
import { buildUploadedCvResult } from "./cvService";

const createHttpError = (message: string, statusCode: number) => {
  const err = new Error(message) as Error & { statusCode?: number };
  err.statusCode = statusCode;
  return err;
};

export const uploadCv = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw createHttpError("No CV file uploaded", 400);
    }

    const uploadedCv = buildUploadedCvResult(req.file);

    return res.status(200).json({
      success: true,
      fileId: uploadedCv.fileId,
      message: "CV uploaded successfully",
    });
  } catch (error) {
    return next(error);
  }
};
