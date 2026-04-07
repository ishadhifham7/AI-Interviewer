import { NextFunction, Request, Response } from "express";
import { uploadAndStructureCv } from "./cvService";

const createHttpError = (message: string, statusCode: number) => {
  const err = new Error(message) as Error & { statusCode?: number };
  err.statusCode = statusCode;
  return err;
};

export const uploadCv = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      throw createHttpError("No CV file uploaded", 400);
    }

    const uploadedCv = await uploadAndStructureCv(req.file);
    console.log(
      "[CV Structured JSON]",
      JSON.stringify(uploadedCv.cvData, null, 2),
    );

    return res.status(200).json({
      success: true,
      fileId: uploadedCv.fileId,
      cvData: uploadedCv.cvData,
      message: "CV uploaded successfully",
    });
  } catch (error) {
    return next(error);
  }
};
