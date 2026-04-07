// src/routes/index.ts
import { Router } from "express";
import cvRoutes from "./modules/cv/cvRoutes";

const router = Router();

// CV Module Routes
router.use("/cv", cvRoutes);

// Future modules:
// import interviewRoutes from "../modules/interview/routes/interviewRoutes";
// router.use("/interview", interviewRoutes);

export default router;
