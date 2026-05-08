// src/routes/index.ts
import { Router } from "express";
import cvRoutes from "./modules/cv/cvRoutes";
import feedbackRoutes from "./modules/feedback-agent/feedbackRoutes";

const router = Router();

// CV Module Routes
router.use("/cv", cvRoutes);

// Feedback Agent Routes
router.use("/feedback", feedbackRoutes);

// Future modules:
// import interviewRoutes from "../modules/interview/routes/interviewRoutes";
// Interview Module Routes
router.use("/interview", interviewRoutes);


export default router;
