import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import multer from "multer";

const TEMP_CV_UPLOAD_DIR = path.join(process.cwd(), "tmp", "cv-uploads");
const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;

fs.mkdirSync(TEMP_CV_UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, TEMP_CV_UPLOAD_DIR);
  },
  filename: (_req, _file, cb) => {
    const fileId = `${Date.now()}-${randomUUID()}`;
    cb(null, `${fileId}.pdf`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const isPdfMime = file.mimetype === "application/pdf";
  const hasPdfExtension =
    path.extname(file.originalname).toLowerCase() === ".pdf";

  if (!isPdfMime || !hasPdfExtension) {
    const err = new Error("Only PDF files are allowed") as Error & {
      statusCode?: number;
    };
    err.statusCode = 400;
    cb(err);
    return;
  }

  cb(null, true);
};

export const cvUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_CV_SIZE_BYTES,
    files: 1,
  },
});

export { TEMP_CV_UPLOAD_DIR, MAX_CV_SIZE_BYTES };
