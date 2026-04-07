import { Router } from "express";
import { cvUpload } from "../../middlewares/fileUpload";
import { uploadCv } from "./cvController";

const router = Router();

router.post("/upload", cvUpload.single("cv"), uploadCv);

export default router;
