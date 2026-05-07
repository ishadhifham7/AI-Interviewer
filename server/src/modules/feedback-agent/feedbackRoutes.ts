import { Router } from "express";
import { generateFeedback, getFeedbackHistory } from "./feedbackController";

const router = Router();

router.post("/generate", generateFeedback);
router.get("/history", getFeedbackHistory);

export default router;
