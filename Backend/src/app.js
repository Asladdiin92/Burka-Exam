import cors from "cors";
import express from "express";
import helmet from "helmet";
import fs from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import examRoutes from "./routes/exam.routes.js";
import healthRoutes from "./routes/health.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import questionBankRoutes from "./routes/questionBank.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";
import userRoutes from "./routes/user.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import { apiRateLimit } from "./middleware/rateLimit.middleware.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.middleware.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const webDistDir = resolve(currentDir, "../../Web/dist");
const webIndexHtml = resolve(webDistDir, "index.html");

export const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    frameguard: false
  })
);
app.use(
  cors({
    origin: env.clientOrigins,
    credentials: true
  })
);
app.use("/api", apiRateLimit);
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/question-bank", questionBankRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

app.use((req, res, next) => {
  if (req.path === "/sw.js") {
    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Service-Worker-Allowed", "/");
  } else if (req.path === "/manifest.webmanifest") {
    res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
  }
  next();
});
app.use(express.static(webDistDir));

app.get("/{*splat}", (request, response, next) => {
  if (request.path.startsWith("/api")) {
    return next();
  }
  if (fs.existsSync(webIndexHtml)) {
    return response.sendFile(webIndexHtml);
  }
  return response.json({
    name: "Burka Exam API",
    version: "0.1.0",
    documentation: "/api/health"
  });
});

app.use(notFoundHandler);
app.use(errorHandler);
