import path from "path";
import { UploadCvResult } from "./cvTypes";

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
