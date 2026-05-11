// src/routes/index.ts
import { Router } from "express";
import cvRoutes from "./modules/cv/cvRoutes";
import feedbackRoutes from "./modules/feedback-agent/feedbackRoutes";
import interviewRoutes from "./modules/interview/interviewRoutes";

const router = Router();

// CV Module Routes
router.use("/cv", cvRoutes);

// Feedback Agent Routes
router.use("/feedback", feedbackRoutes);

// Interview Module Routes
router.use("/interview", interviewRoutes);

export default router;

