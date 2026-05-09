// src/routes/index.ts
import { Router } from "express";
import cvRoutes from "./modules/cv/cvRoutes";
import feedbackRoutes from "./modules/feedback-agent/feedbackRoutes";
import researchRoutes from "./modules/research-agent/routes/research.routes";

const router = Router();

// CV Module Routes
router.use("/cv", cvRoutes);

// Feedback Agent Routes
router.use("/feedback", feedbackRoutes);

// Research Agent Routes
router.use("/research", researchRoutes);

// Future modules:
// import interviewRoutes from "../modules/interview/routes/interviewRoutes";
// router.use("/interview", interviewRoutes);

export default router;
