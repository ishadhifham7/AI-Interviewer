import { Router } from "express";
import { generateInterviewQuestions } from "./interviewController";

const router = Router();

router.post("/generate", generateInterviewQuestions);

export default router;
