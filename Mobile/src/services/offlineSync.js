import AsyncStorage from "@react-native-async-storage/async-storage";
import { request } from "./api.js";

const OFFLINE_STATUS_KEY = "@ethioprep_offline_sync_status";

export async function getOfflineSyncStatus() {
  try {
    const raw = await AsyncStorage.getItem(OFFLINE_STATUS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function downloadOfflineBundle(userStream = "natural", onProgress) {
  try {
    if (onProgress) onProgress("Connecting to server...");

    const stream = userStream === "social" ? "social" : "natural";
    const bundle = await request(`/exams/offline-bundle?stream=${stream}`);

    if (!bundle || !Array.isArray(bundle.exams) || !Array.isArray(bundle.questions)) {
      throw new Error("Invalid offline bundle received from server.");
    }

    if (onProgress) onProgress(`Saving ${bundle.examCount} exams & ${bundle.questionCount} questions...`);

    // 1. Save Subjects
    if (Array.isArray(bundle.subjects) && bundle.subjects.length > 0) {
      await AsyncStorage.setItem("@ethioprep_cached_subjects", JSON.stringify(bundle.subjects)).catch(() => {});
    }

    // 2. Save Exams
    if (Array.isArray(bundle.exams) && bundle.exams.length > 0) {
      await AsyncStorage.setItem("@ethioprep_cached_exams", JSON.stringify(bundle.exams)).catch(() => {});
    }

    // 3. Map chapters by subject and save
    if (Array.isArray(bundle.chapters) && bundle.chapters.length > 0) {
      const chaptersBySubj = new Map();
      bundle.chapters.forEach((ch) => {
        const sId = String(ch.subjectId || "");
        if (!chaptersBySubj.has(sId)) chaptersBySubj.set(sId, []);
        chaptersBySubj.get(sId).push(ch);
      });
      for (const [sId, chs] of chaptersBySubj.entries()) {
        if (sId) {
          await AsyncStorage.setItem(`@ethioprep_cached_chapters_${sId}`, JSON.stringify(chs)).catch(() => {});
        }
      }
    }

    // 4. Group questions by exam and subject
    const questionsByExam = new Map();
    const questionsBySubject = new Map();

    bundle.questions.forEach((q) => {
      const eId = String(q.examId || "");
      if (eId) {
        if (!questionsByExam.has(eId)) questionsByExam.set(eId, []);
        questionsByExam.get(eId).push(q);
      }

      const sId = String(q.subjectId || "");
      if (sId) {
        if (!questionsBySubject.has(sId)) questionsBySubject.set(sId, []);
        questionsBySubject.get(sId).push(q);
      }
    });

    // 5. Save per-exam caches
    for (const exam of bundle.exams) {
      const eId = String(exam._id);
      const examQuestions = questionsByExam.get(eId) || [];
      if (examQuestions.length > 0) {
        await AsyncStorage.setItem(`@ethioprep_exam_cache_${eId}`, JSON.stringify(examQuestions)).catch(() => {});
        // Also construct a ready session
        const session = {
          attempt: {
            _id: `offline_seed_${eId}`,
            examId: eId,
            status: "in_progress",
            isOffline: true
          },
          exam: {
            ...exam,
            questions: examQuestions
          }
        };
        await AsyncStorage.setItem(`@ethioprep_cached_exam_session_${eId}_all`, JSON.stringify(session)).catch(() => {});
      }
    }

    // 6. Save per-subject practice questions
    for (const [sId, sQuestions] of questionsBySubject.entries()) {
      if (sId && sQuestions.length > 0) {
        await AsyncStorage.setItem(`@ethioprep_cached_practice_qs_${sId}_all`, JSON.stringify(sQuestions)).catch(() => {});
      }
    }

    // 7. Store sync status
    const statusObj = {
      syncedAt: new Date().toISOString(),
      examCount: bundle.examCount,
      questionCount: bundle.questionCount,
      stream
    };
    await AsyncStorage.setItem(OFFLINE_STATUS_KEY, JSON.stringify(statusObj));

    return {
      success: true,
      examCount: bundle.examCount,
      questionCount: bundle.questionCount
    };
  } catch (error) {
    console.error("Offline bundle download error:", error);
    throw error;
  }
}
