import { Router } from "express";
import { generateFeedback } from "./feedbackController";

const router = Router();

router.post("/generate", generateFeedback);

export default router;
