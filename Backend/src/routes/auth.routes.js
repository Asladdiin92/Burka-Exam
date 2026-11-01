import { Router } from "express";
import {
  forgotPassword,
  getProfile,
  loginUser,
  logout,
  me,
  refreshTokenHandler,
  registerUser,
  resendVerificationOTP,
  resetPassword,
  updatePassword,
  updateProfile,
  updateStream,
  verifyEmail,
  verifyResetOTP
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { authRateLimit } from "../middleware/rateLimit.middleware.js";

const router = Router();

// Public auth routes
router.post("/register", authRateLimit, registerUser);
router.post("/login", authRateLimit, loginUser);
router.post("/verify-email", authRateLimit, verifyEmail);
router.post("/resend-verification", authRateLimit, resendVerificationOTP);
router.post("/forgot-password", authRateLimit, forgotPassword);
router.post("/verify-reset-otp", authRateLimit, verifyResetOTP);
router.post("/reset-password", authRateLimit, resetPassword);
router.post("/refresh-token", refreshTokenHandler);
router.post("/logout", logout);

// Protected routes (require authentication)
router.get("/me", requireAuth, me);
router.get("/profile", requireAuth, getProfile);
router.patch("/profile", requireAuth, updateProfile);
router.patch("/password", requireAuth, updatePassword);
router.patch("/stream", requireAuth, updateStream);

export default router;
