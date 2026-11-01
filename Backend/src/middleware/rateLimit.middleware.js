import rateLimit from "express-rate-limit";

// Strict rate limiting for authentication endpoints (prevent brute force)
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: { error: "Too many authentication attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  validate: false
});

// Moderate rate limiting for payment submission (prevent spam)
export const paymentRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 payment submissions per hour
  message: { error: "Too many payment submissions. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  validate: false
});

// Strict rate limiting for sync endpoint (prevent abuse)
export const syncRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 sync requests per minute
  message: { error: "Too many sync requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  validate: false
});

// General API rate limiting (prevent overall abuse)
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per window
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  validate: false
});
