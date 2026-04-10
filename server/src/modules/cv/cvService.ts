import path from "path";
import { CVFull, UploadCvResult } from "./cvTypes";
import { CVModel } from "./ai/cvAIModel";

export const buildUploadedCvResult = (
  file: Express.Multer.File,
): UploadCvResult => {
  const fileId = path.parse(file.filename).name;

  return {
    fileId,
    filePath: file.path,
    originalName: file.originalname,
    size: file.size,
  };
};

export const uploadAndStructureCv = async (
  file: Express.Multer.File,
): Promise<CVFull> => {
  const cvModel = new CVModel();
  const uploadMeta = buildUploadedCvResult(file);
  const cvData = await cvModel.generateStructuredFromPdf(file.path);

  return {
    ...uploadMeta,
    cvData,
  };
};
