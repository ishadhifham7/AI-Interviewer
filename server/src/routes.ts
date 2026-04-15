// src/routes/index.ts
import { Router } from "express";
import cvRoutes from "./modules/cv/cvRoutes";
import interviewRoutes from "./modules/interview/interviewRoutes";

const router = Router();

// CV Module Routes
router.use("/cv", cvRoutes);

// Future modules:
// import interviewRoutes from "../modules/interview/routes/interviewRoutes";
// Interview Module Routes
router.use("/interview", interviewRoutes);


export default router;
