import { Router } from "express";
import { getAdminAnalytics, getAnalyticsSummary, getStudentAnalytics, getWeeklyQuizTrends, trackEvent } from "../controllers/analytics.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/events", requireAuth, trackEvent);
router.get("/summary", requireAuth, requireRole("admin"), getAnalyticsSummary);
router.get("/admin", requireAuth, requireRole("admin"), getAdminAnalytics);
router.get("/student", requireAuth, getStudentAnalytics);
router.get("/weekly-performance", requireAuth, getWeeklyQuizTrends);

export default router;
