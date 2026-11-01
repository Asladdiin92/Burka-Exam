import { Router } from "express";
import {
  createChapter,
  createQuestion,
  createSubject,
  deactivateChapter,
  deactivateQuestion,
  deactivateSubject,
  getChaptersBySubject,
  getQuestions,
  getSubjects,
  reactivateChapter,
  reactivateQuestion,
  reactivateSubject,
  updateChapter,
  updateQuestion,
  updateSubject
} from "../controllers/questionBank.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validateObjectId } from "../middleware/validateObjectId.middleware.js";

const router = Router();

router.get("/subjects", requireAuth, getSubjects);
router.post("/subjects", requireAuth, requireRole("teacher", "content_manager", "admin"), createSubject);
router.patch("/subjects/:subjectId", requireAuth, validateObjectId("subjectId"), requireRole("teacher", "content_manager", "admin"), updateSubject);
router.patch("/subjects/:subjectId/deactivate", requireAuth, validateObjectId("subjectId"), requireRole("teacher", "content_manager", "admin"), deactivateSubject);
router.patch("/subjects/:subjectId/reactivate", requireAuth, validateObjectId("subjectId"), requireRole("teacher", "content_manager", "admin"), reactivateSubject);

router.get("/subjects/:subjectId/chapters", requireAuth, validateObjectId("subjectId"), getChaptersBySubject);
router.post("/subjects/:subjectId/chapters", requireAuth, validateObjectId("subjectId"), requireRole("teacher", "content_manager", "admin"), createChapter);
router.patch("/chapters/:chapterId", requireAuth, validateObjectId("chapterId"), requireRole("teacher", "content_manager", "admin"), updateChapter);
router.patch("/chapters/:chapterId/deactivate", requireAuth, validateObjectId("chapterId"), requireRole("teacher", "content_manager", "admin"), deactivateChapter);
router.patch("/chapters/:chapterId/reactivate", requireAuth, validateObjectId("chapterId"), requireRole("teacher", "content_manager", "admin"), reactivateChapter);

router.get("/questions", requireAuth, getQuestions);
router.post("/questions", requireAuth, requireRole("teacher", "content_manager", "admin"), createQuestion);
router.patch("/questions/:questionId", requireAuth, validateObjectId("questionId"), requireRole("teacher", "content_manager", "admin"), updateQuestion);
router.patch("/questions/:questionId/deactivate", requireAuth, validateObjectId("questionId"), requireRole("teacher", "content_manager", "admin"), deactivateQuestion);
router.patch("/questions/:questionId/reactivate", requireAuth, validateObjectId("questionId"), requireRole("teacher", "content_manager", "admin"), reactivateQuestion);

export default router;
