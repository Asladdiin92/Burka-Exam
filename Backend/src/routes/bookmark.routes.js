import { Router } from "express";
import { createBookmark, deleteBookmark, listBookmarks } from "../controllers/bookmark.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, listBookmarks);
router.post("/", requireAuth, createBookmark);
router.delete("/:id", requireAuth, deleteBookmark);

export default router;
