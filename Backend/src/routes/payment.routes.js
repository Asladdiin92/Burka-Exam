import { Router } from "express";
import { cashDashboard, listPayments, submitPayment, verifyPayment } from "../controllers/payment.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validateObjectId } from "../middleware/validateObjectId.middleware.js";
import { paymentRateLimit } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.get("/", requireAuth, listPayments);
router.post("/", requireAuth, paymentRateLimit, submitPayment);
router.patch("/:id/verify", requireAuth, validateObjectId("id"), requireRole("cash_manager", "admin"), verifyPayment);
router.get("/dashboard", requireAuth, requireRole("cash_manager", "admin"), cashDashboard);

export default router;
