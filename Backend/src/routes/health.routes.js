import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (_request, response) => {
  const databaseState = mongoose.connection.readyState === 1 ? "connected" : "in-memory-fallback";

  response.status(200).json({
    status: "ok",
    service: "ethioprep-api",
    database: databaseState,
    timestamp: new Date().toISOString()
  });
});

export default router;
