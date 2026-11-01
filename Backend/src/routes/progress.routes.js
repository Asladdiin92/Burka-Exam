import { Router } from "express";
import { getLeaderboard, listProgress, upsertProgress } from "../controllers/progress.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/leaderboard", requireAuth, getLeaderboard);
router.get("/", requireAuth, listProgress);
router.put("/", requireAuth, upsertProgress);
router.post("/", requireAuth, upsertProgress);

export default router;
