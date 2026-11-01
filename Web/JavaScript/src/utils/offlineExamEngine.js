/**
 * Pure offline exam & service-worker cache engine for EthioPrep.
 * Shared across the Service Worker, client API fallback, and unit tests.
 */

const STATIC_PRECACHE_PATHS = new Set([
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icon.svg",
  "/pwa-192x192.png",
  "/pwa-512x512.png",
  "/pwa-maskable-512x512.png",
  "/apple-touch-icon.png"
]);

const CACHEABLE_API_GET_PREFIXES = [
  "/api/question-bank/subjects",
  "/api/question-bank/chapters",
  "/api/question-bank/questions",
  "/api/exams",
  "/api/notes",
  "/api/bookmarks",
  "/api/progress",
  "/api/payments",
  "/api/analytics",
  "/api/users",
  "/api/health"
];

/**
 * Classifies an incoming HTTP request for the Service Worker fetch strategy.
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string} pathname - URL pathname
 * @param {string} [hostname] - Optional hostname for external font/asset detection
 * @returns {"static-precache" | "static-asset" | "api-get" | "exam-start-post" | "exam-submit-post" | "auth-post" | "bypass"}
 */
export function classifyRequestForSwCache(method, pathname, hostname = "") {
  const upperMethod = String(method || "GET").toUpperCase();
  const cleanPath = String(pathname || "/");
  const cleanHost = String(hostname || "").toLowerCase();

  if (upperMethod === "GET") {
    if (STATIC_PRECACHE_PATHS.has(cleanPath)) {
      return "static-precache";
    }
    if (
      cleanHost.includes("fonts.googleapis.com") ||
      cleanHost.includes("fonts.gstatic.com") ||
      cleanPath.startsWith("/assets/") ||
      /\.(?:js|mjs|css|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf)$/i.test(cleanPath)
    ) {
      return "static-asset";
    }
    if (CACHEABLE_API_GET_PREFIXES.some((prefix) => cleanPath === prefix || cleanPath.startsWith(`${prefix}/`))) {
      return "api-get";
    }
    return "bypass";
  }

  if (upperMethod === "POST") {
    if (/^\/api\/exams\/[^/]+\/start\/?$/.test(cleanPath)) {
      return "exam-start-post";
    }
    if (/^\/api\/exams\/attempts\/[^/]+\/submit\/?$/.test(cleanPath)) {
      return "exam-submit-post";
    }
    if (cleanPath === "/api/auth/login" || cleanPath === "/api/auth/refresh-token") {
      return "auth-post";
    }
  }

  return "bypass";
}

/**
 * Builds a deterministic synthetic GET cache path for an exam start session.
 * @param {string} examId
 * @param {object} [params]
 * @param {string} [params.chapterId]
 * @param {boolean} [params.allYears]
 * @returns {string}
 */
export function buildExamStartCacheKey(examId, params = {}) {
  const cleanExamId = String(examId || "").trim();
  const query = new URLSearchParams();
  if (params.chapterId) {
    query.set("chapterId", String(params.chapterId));
  }
  if (params.allYears === true || params.allYears === "true") {
    query.set("allYears", "true");
  }
  const qs = query.toString();
  return `/__sw_exam_start__/${cleanExamId}${qs ? `?${qs}` : ""}`;
}

/**
 * Synthesizes a complete offline exam attempt session from the cached offline bundle
 * when the user starts an exam or unit while offline.
 * @param {object} bundle - Cached offline bundle ({ exams, questions, chapters, subjects })
 * @param {string} examId - Target exam ID
 * @param {object} [options] - Optional { chapterId, allYears }
 * @returns {{ attempt: object, exam: object } | null}
 */
export function synthesizeOfflineExamStart(bundle, examId, options = {}) {
  if (!bundle || !Array.isArray(bundle.exams)) return null;
  const targetExam =
    bundle.exams.find((e) => String(e._id) === String(examId)) ||
    bundle.exams[0];
  if (!targetExam) return null;

  const allQuestions = Array.isArray(bundle.questions) ? bundle.questions : [];
  const allChapters = Array.isArray(bundle.chapters) ? bundle.chapters : [];
  const chapterId = options.chapterId ? String(options.chapterId) : "";
  const allYears = Boolean(options.allYears === true || options.allYears === "true");

  const examQuestionIdSet = new Set((targetExam.questionIds || []).map(String));
  let matchedQuestions = [];

  if (chapterId && allYears) {
    matchedQuestions = allQuestions.filter((q) => String(q.chapterId) === chapterId);
  } else if (chapterId) {
    matchedQuestions = allQuestions.filter(
      (q) =>
        String(q.chapterId) === chapterId &&
        (examQuestionIdSet.has(String(q._id)) || String(q.examId) === String(targetExam._id))
    );
    if (matchedQuestions.length === 0) {
      matchedQuestions = allQuestions.filter((q) => String(q.chapterId) === chapterId);
    }
  } else {
    matchedQuestions = allQuestions.filter(
      (q) => examQuestionIdSet.has(String(q._id)) || String(q.examId) === String(targetExam._id)
    );
  }

  // Fallback to same-subject questions if specific exam questions weren't in the subset
  if (matchedQuestions.length === 0) {
    const targetSubjId =
      typeof targetExam.subjectId === "object" && targetExam.subjectId
        ? String(targetExam.subjectId._id || "")
        : String(targetExam.subjectId || "");
    if (targetSubjId) {
      matchedQuestions = allQuestions.filter((q) => String(q.subjectId) === targetSubjId);
    }
  }

  if (matchedQuestions.length === 0 && allQuestions.length > 0) {
    matchedQuestions = allQuestions.slice(0, 15);
  }

  const chapterDoc = chapterId
    ? allChapters.find((ch) => String(ch._id) === chapterId)
    : null;

  const normalizedQuestions = matchedQuestions.map((q) => ({
    ...q,
    prompt: q.prompt || q.stem || "",
    stem: q.stem || q.prompt || "",
    imageUrl: q.imageUrl || undefined,
    explanationImageUrl: q.explanationImageUrl || undefined,
    examYear: Number(q.examYear || targetExam.examYear || 2016),
    topic: q.topic || q.chapterTitle || chapterDoc?.title || "General Topic",
    chapterTitle: q.chapterTitle || chapterDoc?.title || q.topic || "General Topic",
    options: (q.options || []).map((opt, idx) => {
      const key =
        typeof opt === "object" && opt !== null && opt.key
          ? String(opt.key)
          : String.fromCharCode(65 + idx);
      return {
        ...(typeof opt === "object" && opt !== null ? opt : { text: String(opt) }),
        key,
        imageUrl: opt?.imageUrl || q.optionImages?.[key] || undefined
      };
    })
  }));

  const examCopy = {
    ...targetExam,
    offline: true,
    questions: normalizedQuestions
  };

  if (chapterDoc) {
    examCopy.title = allYears
      ? `${chapterDoc.title} (All Years)`
      : `${targetExam.title} • ${chapterDoc.title}`;
    examCopy.chapterName = chapterDoc.title;
    examCopy.chapterId = String(chapterDoc._id);
    examCopy.allYears = allYears;
  }

  const attempt = {
    _id: `offline_attempt_${targetExam._id}_${Date.now()}`,
    examId: String(targetExam._id),
    ...(chapterId ? { chapterId } : {}),
    status: "in_progress",
    offline: true,
    startedAt: new Date().toISOString()
  };

  return {
    attempt,
    exam: examCopy
  };
}

/**
 * Grades an exam attempt locally when offline using cached question definitions.
 * @param {Array<object>} questions - Cached questions containing _id, correctAnswer, options, explanation
 * @param {Array<object>} submittedAnswers - Array of { questionId, selectedOptionKeys, response }
 * @param {number} [passingScore=50] - Passing percentage threshold
 * @returns {object} Graded attempt object compatible with Backend submitExamAttempt
 */
export function gradeOfflineExamAttempt(questions = [], submittedAnswers = [], passingScore = 50) {
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const safeAnswers = Array.isArray(submittedAnswers) ? submittedAnswers : [];
  const questionsById = new Map(safeQuestions.map((q) => [String(q._id), q]));

  const gradedAnswers = safeAnswers.map((ans) => {
    const q = questionsById.get(String(ans.questionId));
    const submittedKey = ans.selectedOptionKeys?.[0] ?? ans.response ?? "";
    const expectedKey = q?.correctAnswer ?? "A";
    const isCorrect =
      Boolean(q) &&
      String(submittedKey).trim() !== "" &&
      String(submittedKey).trim().toLowerCase() === String(expectedKey).trim().toLowerCase();

    return {
      questionId: ans.questionId,
      selectedOptionKeys: Array.isArray(ans.selectedOptionKeys) ? ans.selectedOptionKeys : [],
      response: submittedKey,
      isCorrect,
      pointsAwarded: isCorrect ? 1 : 0,
      answeredAt: new Date().toISOString()
    };
  });

  const gradedById = new Map(gradedAnswers.map((a) => [String(a.questionId), a]));
  const totalQuestions = safeQuestions.length;
  const score = gradedAnswers.reduce((sum, a) => sum + a.pointsAwarded, 0);
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 10000) / 100 : 0;

  const questionResults = safeQuestions.map((q) => {
    const graded = gradedById.get(String(q._id));
    const selectedAnswer = graded?.selectedOptionKeys?.[0] ?? graded?.response ?? "";
    const options = Array.isArray(q.options) ? q.options : [];
    const resolveOptionText = (key) => {
      if (!key) return undefined;
      const idx = options.findIndex((opt, i) =>
        typeof opt === "object" && opt !== null && opt.key
          ? String(opt.key).toUpperCase() === String(key).toUpperCase()
          : String.fromCharCode(65 + i) === String(key).toUpperCase()
      );
      if (idx < 0) return undefined;
      const found = options[idx];
      return typeof found === "object" ? found.text || found.label : String(found);
    };

    const correctKey = q.correctAnswer || "A";
    return {
      questionId: String(q._id),
      selectedAnswer,
      selectedAnswerText: resolveOptionText(selectedAnswer) || selectedAnswer,
      correctAnswer: correctKey,
      correctAnswerText: resolveOptionText(correctKey) || correctKey,
      explanation: q.explanation || "Verified curriculum explanation cached for offline review.",
      isCorrect: Boolean(graded?.isCorrect)
    };
  });

  return {
    status: "submitted",
    offline: true,
    score,
    percentage,
    passed: percentage >= Number(passingScore || 50),
    totalMarks: totalQuestions,
    submittedAt: new Date().toISOString(),
    answers: gradedAnswers,
    questionResults
  };
}

/**
 * Resolves per-question answer feedback based on the student's chosen answer display mode
 * ("after_finishing" vs "right_away") and current exam state.
 *
 * @param {object} params
 * @param {object} params.question - Question object with _id, correctAnswer, options, explanation
 * @param {string} [params.selectedKey] - Option key currently selected by the student (e.g. "A")
 * @param {object} [params.examResult] - Submitted exam result object (if exam is finished)
 * @param {"after_finishing" | "right_away"} [params.showAnswerMode="after_finishing"] - When to show correct answers
 * @returns {{
 *   showFeedback: boolean,
 *   isCorrect: boolean,
 *   correctKey: string,
 *   selectedAnswerText: string,
 *   correctAnswerText: string,
 *   explanation: string,
 *   review: object | null
 * }}
 */
export function resolveQuestionFeedback({
  question,
  selectedKey = "",
  examResult = null,
  showAnswerMode = "after_finishing"
} = {}) {
  const safeQuestion = question || {};
  const options = Array.isArray(safeQuestion.options) ? safeQuestion.options : [];
  const submittedReview = Array.isArray(examResult?.questionResults)
    ? examResult.questionResults.find((r) => String(r.questionId) === String(safeQuestion._id))
    : null;

  const rawCorrect =
    submittedReview?.correctAnswer ||
    (Array.isArray(safeQuestion.correctAnswers)
      ? safeQuestion.correctAnswers[0]
      : safeQuestion.correctAnswer) ||
    "A";
  const correctKey = String(rawCorrect).trim();
  const cleanSelected = String(selectedKey || submittedReview?.selectedAnswer || "").trim();

  const formatOptionLabel = (key) => {
    if (!key) return "";
    const idx = options.findIndex((opt, i) =>
      typeof opt === "object" && opt !== null && opt.key
        ? String(opt.key).trim().toUpperCase() === String(key).trim().toUpperCase()
        : String.fromCharCode(65 + i) === String(key).trim().toUpperCase()
    );
    if (idx < 0) return String(key);
    const found = options[idx];
    const optKey =
      typeof found === "object" && found !== null && found.key
        ? String(found.key)
        : String.fromCharCode(65 + idx);
    const optText =
      typeof found === "object" && found !== null
        ? found.text || found.label || ""
        : String(found);
    return optText ? `${optKey}. ${optText}` : optKey;
  };

  const hasExamFinished = Boolean(examResult);
  const isRightAwayTriggered = showAnswerMode === "right_away" && cleanSelected !== "";
  const showFeedback = hasExamFinished || isRightAwayTriggered;

  if (!showFeedback) {
    return {
      showFeedback: false,
      isCorrect: true,
      correctKey,
      selectedAnswerText: "",
      correctAnswerText: "",
      explanation: safeQuestion.explanation || "",
      review: null
    };
  }

  const isCorrect = submittedReview
    ? Boolean(submittedReview.isCorrect)
    : cleanSelected !== "" && cleanSelected.toUpperCase() === correctKey.toUpperCase();

  const selectedAnswerText =
    submittedReview?.selectedAnswerText ||
    (cleanSelected ? formatOptionLabel(cleanSelected) : "Not answered");
  const correctAnswerText =
    submittedReview?.correctAnswerText || formatOptionLabel(correctKey) || correctKey;
  const explanation =
    safeQuestion.explanation || submittedReview?.explanation || "";

  const review = submittedReview || {
    questionId: safeQuestion._id,
    selectedKey: cleanSelected,
    selectedAnswer: cleanSelected,
    selectedAnswerText,
    correctKey,
    correctAnswer: correctKey,
    correctAnswerText,
    isCorrect,
    explanation
  };

  return {
    showFeedback: true,
    isCorrect,
    correctKey,
    selectedAnswerText,
    correctAnswerText,
    explanation,
    review
  };
}

