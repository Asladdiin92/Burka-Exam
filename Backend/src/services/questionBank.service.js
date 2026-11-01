import { Chapter } from "../models/Chapter.js";
import { Question } from "../models/Question.js";
import { Subject } from "../models/Subject.js";

export async function getActiveSubjects() {
  return Subject.find({ isActive: true }).sort({ name: 1 });
}

export async function createSubject({ name, code, description, gradeLevel, track }) {
  const normalizedCode = String(code).trim().toUpperCase();
  const existing = await Subject.findOne({ code: normalizedCode });
  if (existing) {
    const error = new Error("A subject with that code already exists.");
    error.status = 409;
    throw error;
  }

  return Subject.create({
    name: String(name).trim(),
    code: normalizedCode,
    description,
    gradeLevel,
    track,
    isActive: true
  });
}

export async function getChaptersBySubject(subjectId) {
  return Chapter.find({ subjectId, isActive: true }).sort({ order: 1 });
}

export async function queryQuestions({ subjectId, chapterId, difficulty, examYear, limit = 50 }) {
  const filter = { status: "published" };
  if (subjectId) filter.subjectId = subjectId;
  if (chapterId) filter.chapterId = chapterId;
  if (difficulty) filter.difficulty = difficulty;
  if (examYear) filter.examYear = Number(examYear);

  return Question.find(filter).sort({ createdAt: -1 }).limit(Math.min(limit, 100));
}
