import express from "express";
import { testResearch } from "../controllers/research.controller";

const router = express.Router();

router.post("/test", testResearch);

export default router;
