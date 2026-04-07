import { Router, Request, Response } from "express";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("cv"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No CV file uploaded",
    });
  }

  return res.status(200).json({
    success: true,
    message: "CV uploaded successfully",
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
});

export default router;
