import { Router } from "express";
import { chatWithTutor } from "../controllers/ai.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/chat", optionalAuth, chatWithTutor);

export default router;
