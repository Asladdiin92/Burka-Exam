import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../services/api.js";
import {
  formatMathText,
  parseOptionContent,
  parseQuestionSegments,
  splitPassageAndQuestion
} from "../utils/questionContentParser.js";
import { PracticeModeSimulator } from "./PracticeModeSimulator.jsx";

const COLORS = {
  background: "#f6f8fa",
  surface: "#ffffff",
  surfaceMuted: "#eef2f5",
  surfaceAlt: "#e6ecf0",
  primary: "#00c896",
  primaryDark: "#059669",
  primaryLight: "#34d399",
  primaryBg: "#e6f9f4",
  secondary: "#0ea5e9",
  text: "#172126",
  textSecondary: "#37434a",
  textMuted: "#5e6d75",
  border: "#e1e7ec",
  borderLight: "#eef2f5",
  success: "#10b981",
  successBg: "#ecfdf5",
  warning: "#f59e0b",
  warningBg: "#fffbeb",
  danger: "#ef4444",
  dangerBg: "#fef2f2",
  info: "#0ea5e9",
  infoBg: "#f0f9ff",
  purple: "#14b8a6",
  purpleBg: "#f0fdfa",
  gold: "#f59e0b",
  silver: "#94a3b8",
  bronze: "#d97706",
  onPrimary: "#ffffff"
};

const TABS = [
  { id: "home", label: "Home" },
  { id: "exams", label: "Exams" },
  { id: "ai", label: "AI Tutor" },
  { id: "notes", label: "Study Notes" },
  { id: "practice", label: "Practice" },
  { id: "payments", label: "Pay" },
  { id: "profile", label: "Profile" }
];

const GRADES = [9, 10, 11, 12];

const PAYMENT_METHODS = [
  {
    id: "telebirr",
    name: "Telebirr",
    shortName: "Telebirr",
    accountNumber: "0915200879",
    accountName: "Burka Muhammed",
    category: "Mobile Wallet",
    themeColor: "#008542",
    themeBg: "rgba(0, 133, 66, 0.10)"
  },
  {
    id: "cbe_birr",
    name: "CBE Birr",
    shortName: "CBE Birr",
    accountNumber: "0915200879",
    accountName: "Burka Muhammed",
    category: "Mobile Wallet",
    themeColor: "#7B2D8E",
    themeBg: "rgba(123, 45, 142, 0.10)"
  },
  {
    id: "cbe",
    name: "Commercial Bank of Ethiopia (CBE)",
    shortName: "CBE Bank",
    accountNumber: "1000466852841",
    accountName: "Burka Muhammed",
    category: "Bank Transfer",
    themeColor: "#6b1480",
    themeBg: "rgba(107, 20, 128, 0.10)"
  },
  {
    id: "coop",
    name: "Cooperative Bank of Oromia (Coop)",
    shortName: "Coop Bank",
    accountNumber: "1005100022147",
    accountName: "Burka Mohammed",
    category: "Bank Transfer",
    themeColor: "#005a9e",
    themeBg: "rgba(0, 90, 158, 0.10)"
  },
  {
    id: "ebirr",
    name: "E-Birr",
    shortName: "E-Birr",
    accountNumber: "0915200879",
    accountName: "Burka Muhammed",
    category: "Mobile Wallet",
    themeColor: "#e67e22",
    themeBg: "rgba(230, 126, 34, 0.10)"
  },
  {
    id: "awash",
    name: "Awash Bank",
    shortName: "Awash",
    accountNumber: "014251217719600",
    accountName: "Burka Muhammd",
    category: "Bank Transfer",
    themeColor: "#16a085",
    themeBg: "rgba(22, 160, 133, 0.10)"
  }
];

const FAVORITES_KEY = "ethioprep_favorite_questions";

function stripMetadataPrefix(text) {
  if (!text) return "";
  return String(text)
    .replace(/^\[(?:GRADE\s*\d+|EXAM|SUBJECT|YEAR|UNIT)[^\]]*\]\s*/gi, "")
    .replace(/^(?:Question\s*\d+[:.]?\s*)/i, "")
    .trim();
}

function getYear(exam) {
  if (exam?.examYear || exam?.year) return String(exam.examYear || exam.year);
  return (exam?.title || "").match(/\b(?:19|20)\d{2}\b/)?.[0] || "Practice";
}

function getSubjectDiscipline(subj) {
  if (!subj) return "";
  const code = String(subj.code || "").toUpperCase();
  const name = String(subj.name || "").toLowerCase();

  if (code.includes("BIO") || name.includes("bio")) return "BIO";
  if (code.includes("CHEM") || name.includes("chem")) return "CHEM";
  if (code.includes("PHYS") || name.includes("phys")) return "PHYS";
  if (code.includes("MATH") || name.includes("math")) return "MATH";
  if (code.includes("ENG") || name.includes("eng")) return "ENG";
  if (code.includes("GEOG") || name.includes("geog")) return "GEOG";
  if (code.includes("HIST") || name.includes("hist")) return "HIST";
  if (code.includes("ECON") || name.includes("econ")) return "ECON";
  if (code.includes("APTITUDE") || name.includes("aptitude")) return "APTITUDE";
  if (code.includes("SAT") || name.includes("sat")) return "SAT";

  return code.split("_")[0] || code;
}

function subjectSupportsGrade(subject, grade) {
  const levels = String(subject?.gradeLevel || "").match(/\d+/g)?.map(Number) || [];
  return !levels.length || (levels.length > 1 ? grade >= Math.min(...levels) && grade <= Math.max(...levels) : levels.includes(grade));
}

function formatGradeBadge(gradeLevel) {
  if (!gradeLevel) return "Grade 12";
  return String(gradeLevel).replace("grade-", "Grade ");
}

function formatShortGrade(gradeLevel) {
  if (!gradeLevel) return "";
  const match = String(gradeLevel).match(/grade-(\d+)/i);
  return match ? `G${match[1]}` : String(gradeLevel).toUpperCase();
}

function getNoteGradeNumber(note, allSubjects = []) {
  const subjObj =
    typeof note?.subjectId === "object" && note.subjectId !== null
      ? note.subjectId
      : allSubjects.find((s) => String(s._id || s.id) === String(note?.subjectId)) || null;

  if (subjObj?.gradeLevel) {
    const m = String(subjObj.gradeLevel).match(/\d+/);
    if (m) return Number(m[0]);
  }
  if (subjObj?.code) {
    const m = String(subjObj.code).match(/_(\d+)$/);
    if (m) return Number(m[1]);
  }
  const textSample = `${note?.title || ""} ${String(note?.body || "").slice(0, 220)}`;
  const bodyMatch = textSample.match(/Grade\s*(9|10|11|12)\b/i);
  if (bodyMatch) return Number(bodyMatch[1]);
  return 12;
}

function getNotesForGradeSubject(notes = [], subject, grade, allSubjects = []) {
  if (!subject) return [];
  const targetId = String(subject._id || subject.id || "");
  const targetDiscipline = getSubjectDiscipline(subject);
  const targetGrade = Number(grade) || getNoteGradeNumber({ subjectId: subject }, allSubjects);

  return notes
    .filter((n) => {
      const noteSubjId = String(n.subjectId?._id || n.subjectId || "");
      if (targetId && noteSubjId === targetId) return true;

      const noteSubjObj =
        typeof n.subjectId === "object" && n.subjectId !== null
          ? n.subjectId
          : allSubjects.find((s) => String(s._id || s.id) === noteSubjId) || null;
      const noteDiscipline = getSubjectDiscipline(noteSubjObj);
      if (targetDiscipline && noteDiscipline === targetDiscipline) {
        const noteGrade = getNoteGradeNumber(n, allSubjects);
        return noteGrade === targetGrade;
      }
      return false;
    })
    .sort((a, b) => (a.chapterId?.order ?? 999) - (b.chapterId?.order ?? 999));
}

function getExamChapters(exam) {
  if (Array.isArray(exam?.chapterBreakdown) && exam.chapterBreakdown.length > 0) {
    return exam.chapterBreakdown.map((ch) => ({
      id: String(ch.chapterId || Math.random()),
      title: ch.title || "Curriculum Unit",
      order: ch.order ?? 999,
      gradeLevel: ch.gradeLevel || "",
      questionCount: ch.questionCount ?? null
    }));
  }
  if (!Array.isArray(exam?.chapterIds)) return [];
  return exam.chapterIds.map((ch) => {
    if (typeof ch === "object" && ch !== null) {
      return {
        id: String(ch._id || ch.id || Math.random()),
        title: ch.title || "Curriculum Unit",
        order: ch.order ?? 999,
        gradeLevel: ch.gradeLevel || "",
        questionCount: null
      };
    }
    return { id: String(ch), title: "Curriculum Unit", order: 999, gradeLevel: "", questionCount: null };
  });
}

function getExamTitleBase(exam) {
  const raw = String(exam?.title || "").trim();
  const cleaned = raw
    .replace(/\s*\(\d{4}\s*E\.?C\.?\)/i, "")
    .replace(/\s*(?:ESSLCE|EUEE)?\s*\d{4}\s*(?:E\.?C\.?)?/i, "")
    .trim();
  return cleaned || exam?.subjectId?.name || raw || "Entrance Exam";
}

function TabIcon({ id, active }) {
  const color = active ? COLORS.onPrimary : COLORS.textMuted;
  if (id === "home") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  if (id === "exams") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  }
  if (id === "ai") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
      </svg>
    );
  }
  if (id === "notes") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    );
  }
  if (id === "practice") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }
  if (id === "payments") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SubjectGlyph({ code = "" }) {
  const c = String(code).toUpperCase();
  if (c.includes("BIO")) return "🧬";
  if (c.includes("CHEM")) return "⚗️";
  if (c.includes("PHYS")) return "⚡";
  if (c.includes("MATH")) return "📐";
  if (c.includes("ENG")) return "📖";
  if (c.includes("GEOG")) return "🌍";
  if (c.includes("HIST")) return "🏛️";
  if (c.includes("ECON")) return "📊";
  if (c.includes("SAT") || c.includes("APTITUDE")) return "🎓";
  return "📚";
}

function SimTable({ headers = [], rows = [], compact = false }) {
  if ((!Array.isArray(headers) || headers.length === 0) && (!Array.isArray(rows) || rows.length === 0)) return null;
  return (
    <div style={{ overflowX: "auto", marginBottom: compact ? 4 : 10 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: compact ? 11 : 12, background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 6 }}>
        {headers && headers.length > 0 && (
          <thead>
            <tr style={{ background: COLORS.primaryBg }}>
              {headers.map((cell, idx) => (
                <th key={idx} style={{ padding: compact ? "4px 6px" : "6px 8px", border: `1px solid ${COLORS.border}`, color: COLORS.primaryDark, fontWeight: 800, textAlign: "left" }}>
                  {formatMathText(cell)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((r, rIdx) => (
            <tr key={rIdx} style={{ background: rIdx % 2 === 1 ? "#f8fafc" : "#ffffff" }}>
              {r.map((cell, cIdx) => (
                <td key={cIdx} style={{ padding: compact ? "4px 6px" : "6px 8px", border: `1px solid ${COLORS.border}`, color: COLORS.text }}>
                  {formatMathText(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MobileAppSimulator({ onBackToPortal }) {
  const [tab, setTab] = useState("home");
  const [notice, setNotice] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    _id: "student_1",
    displayName: "Burka Student",
    email: "student@ethioprep.com",
    phoneNumber: "0915200879",
    role: "student",
    stream: "natural",
    notifications: true,
    profile: { telegramLink: "Not set", qa: "Not set" }
  });

  // Domain state matching Mobile/App.js
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [notes, setNotes] = useState([]);
  const [progress, setProgress] = useState([]);
  const [payments, setPayments] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Navigation & active exam state
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeExamSession, setActiveExamSession] = useState(null);
  const [loadingExamId, setLoadingExamId] = useState(null);
  const [submittingExam, setSubmittingExam] = useState(false);

  // HomeScreen state
  const [selectedGrade, setSelectedGrade] = useState(9);

  // SubjectScreen state
  const [examViewMode, setExamViewMode] = useState("year"); // "year" | "chapter"
  const [selectedExamYearIndex, setSelectedExamYearIndex] = useState(0);
  const [subjectChapters, setSubjectChapters] = useState([]);

  // NotesScreen (Study Notes) state
  const [selectedNoteGrade, setSelectedNoteGrade] = useState(9);
  const [selectedNoteSubject, setSelectedNoteSubject] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showPersonalForm, setShowPersonalForm] = useState(false);
  const [personalTitle, setPersonalTitle] = useState("");
  const [personalBody, setPersonalBody] = useState("");
  const [personalError, setPersonalError] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // ExamsScreen state
  const [examsViewMode, setExamsViewMode] = useState("year"); // "year" | "title" | "all"
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedTitleFilter, setSelectedTitleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ProgressScreen state
  const [activeSubTab, setActiveSubTab] = useState("analytics"); // "analytics" | "leaderboard" | "favorites"
  const [showLogForm, setShowLogForm] = useState(false);
  const [logContentId, setLogContentId] = useState("");
  const [logPercent, setLogPercent] = useState("100");
  const [logTimeSpent, setLogTimeSpent] = useState("1800");
  const [logError, setLogError] = useState("");
  const [savingProgress, setSavingProgress] = useState(false);
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, displayName: "Abebe Bikila", score: 850, totalTimeSpent: 18000, itemsCompleted: 12 },
    { rank: 2, displayName: "Tirunesh Dibaba", score: 790, totalTimeSpent: 16200, itemsCompleted: 11 },
    { rank: 3, displayName: "Kenenisa Bekele", score: 720, totalTimeSpent: 14400, itemsCompleted: 10 },
    { rank: 4, displayName: "Burka Student", score: 540, totalTimeSpent: 7200, itemsCompleted: 7 }
  ]);
  const [userRank, setUserRank] = useState(1);
  const [favoritesMap, setFavoritesMap] = useState(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Practice Mode state
  const [practiceActive, setPracticeActive] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [practiceCurrentIndex, setPracticeCurrentIndex] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [practiceSkipped, setPracticeSkipped] = useState({});
  const [practiceFlagged, setPracticeFlagged] = useState({});
  const [practiceInstantReviews, setPracticeInstantReviews] = useState({});
  const [practiceCheckingAnswer, setPracticeCheckingAnswer] = useState(false);
  const [practiceTimeSpentMap, setPracticeTimeSpentMap] = useState({});
  const [practiceElapsedSeconds, setPracticeElapsedSeconds] = useState(0);
  const [practiceIsPaused, setPracticeIsPaused] = useState(false);
  const [practiceZenMode, setPracticeZenMode] = useState(false);
  const [practicePassageExpanded, setPracticePassageExpanded] = useState(true);
  const [practiceSelectedSubjectId, setPracticeSelectedSubjectId] = useState("");
  const [practiceGrade, setPracticeGrade] = useState("all");
  const [practiceQuestionCountChoice, setPracticeQuestionCountChoice] = useState(10);
  const [practiceModeChoice, setPracticeModeChoice] = useState("learn"); // 'learn' | 'exam'
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceSessionCompleted, setPracticeSessionCompleted] = useState(false);
  const [practiceResultsSummary, setPracticeResultsSummary] = useState(null);
  const [practiceReviewFilter, setPracticeReviewFilter] = useState("all");

  useEffect(() => {
    let interval = null;
    if (practiceActive && !practiceSessionCompleted && !practiceIsPaused) {
      interval = setInterval(() => {
        setPracticeElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [practiceActive, practiceSessionCompleted, practiceIsPaused]);

  // PaymentScreen state
  const [selectedProvider, setSelectedProvider] = useState("telebirr");
  const [verificationMode, setVerificationMode] = useState("details"); // "details" | "screenshot"
  const [payFullName, setPayFullName] = useState("Burka Student");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [amountPaid, setAmountPaid] = useState("200");
  const [receiptScreenshot, setReceiptScreenshot] = useState("");
  const [payError, setPayError] = useState("");
  const [paySuccess, setPaySuccess] = useState("");
  const [copiedField, setCopiedField] = useState(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // ProfileScreen state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileDisplayName, setProfileDisplayName] = useState("Burka Student");
  const [profileEmail, setProfileEmail] = useState("student@ethioprep.com");
  const [profilePhone, setProfilePhone] = useState("0915200879");
  const [profileNotifications, setProfileNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  // Active Exam state
  const [answers, setAnswers] = useState({});
  const [examResult, setExamResult] = useState(null);
  const [filterMistakesOnly, setFilterMistakesOnly] = useState(false);
  const [zoomedUri, setZoomedUri] = useState(null);

  // AI Tutor state
  const [aiMessages, setAiMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "👋 Akkam! Hello! I'm your **EthioPrep AI Tutor** powered by Gemini.\n\nI can help you master the Ethiopian Entrance Exam (Grade 9–12 ESSLCE / EUEE / Regional Models). Ask me:\n• To explain difficult concepts or formulas step-by-step\n• Why specific answer choices are correct or incorrect\n• For explanations in **English**, **Afaan Oromoo**, or **Amharic**\n• To review questions from exams or your study notes!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      source: "gemini"
    }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContext, setAiContext] = useState(null);
  const [aiRole, setAiRole] = useState("exam_coach");
  const [copiedAiId, setCopiedAiId] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setDashboardLoading(true);
    try {
      if (!localStorage.getItem("ethioprep_token")) {
        try {
          const authRes = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email: "admin@ethioprep.com", password: "adminPassword123" })
          });
          if (authRes?.accessToken) {
            localStorage.setItem("ethioprep_token", authRes.accessToken);
            if (authRes.refreshToken) {
              localStorage.setItem("ethioprep_refresh_token", authRes.refreshToken);
            }
          }
        } catch {
          // ignore auth error
        }
      }

      let [subjRes, examsRes, notesRes, progRes, payRes, leadRes] = await Promise.allSettled([
        apiRequest("/question-bank/subjects"),
        apiRequest("/exams"),
        apiRequest("/notes"),
        apiRequest("/progress"),
        apiRequest("/payments"),
        apiRequest("/progress/leaderboard")
      ]);

      // If token expired or rejected, re-authenticate immediately and retry
      if (subjRes.status === "rejected" || examsRes.status === "rejected" || !subjRes.value?.subjects?.length) {
        try {
          const authRes = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@ethioprep.com", password: "adminPassword123" })
          }).then((r) => r.json());
          if (authRes?.accessToken) {
            localStorage.setItem("ethioprep_token", authRes.accessToken);
            if (authRes.refreshToken) {
              localStorage.setItem("ethioprep_refresh_token", authRes.refreshToken);
            }
            const [rSubj, rExams] = await Promise.allSettled([
              apiRequest("/question-bank/subjects"),
              apiRequest("/exams")
            ]);
            subjRes = rSubj;
            examsRes = rExams;
          }
        } catch {
          // ignore retry auth error
        }
      }

      if (subjRes.status === "fulfilled" && Array.isArray(subjRes.value?.subjects)) {
        setSubjects(subjRes.value.subjects);
      }
      if (examsRes.status === "fulfilled" && Array.isArray(examsRes.value?.exams)) {
        setExams(examsRes.value.exams);
      }
      if (notesRes.status === "fulfilled") setNotes(notesRes.value?.notes || []);
      if (progRes.status === "fulfilled") setProgress(progRes.value?.progress || []);
      if (payRes.status === "fulfilled") setPayments(payRes.value?.payments || []);
      if (leadRes.status === "fulfilled" && leadRes.value?.leaderboard?.length) {
        setLeaderboard(leadRes.value.leaderboard);
        if (leadRes.value.currentUserRank) setUserRank(leadRes.value.currentUserRank);
      }
    } catch {
      // keep existing state
    } finally {
      setDashboardLoading(false);
    }
  }

  const handleSendAiMessage = useCallback(async (textToSend) => {
    const text = (textToSend || aiInput).trim();
    if (!text || aiLoading) return;

    const userMsg = {
      id: String(Date.now()),
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      context: aiContext
    };

    const nextHistory = [...aiMessages, userMsg];
    setAiMessages(nextHistory);
    setAiInput("");
    setAiLoading(true);

    try {
      const apiHistory = nextHistory
        .filter((m) => m.id !== "welcome")
        .slice(-8)
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.text }]
        }));

      const roleConfigs = [
        { id: "exam_coach", model: "gemini-3.8-flash", taskType: "general" },
        { id: "fast_tutor", model: "gemini-3.1-flash-lite", taskType: "fast" },
        { id: "stem_solver", model: "gemini-4-argon", taskType: "complex" },
        { id: "multilingual_tutor", model: "gemini-3.8-flash", taskType: "general" }
      ];
      const activeRoleConfig = roleConfigs.find((r) => r.id === aiRole) || roleConfigs[0];

      const res = await apiRequest("/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message: text,
          context: aiContext,
          history: apiHistory,
          role: activeRoleConfig.id,
          taskType: activeRoleConfig.taskType,
          model: activeRoleConfig.model
        })
      });

      const replyText = res?.reply || "I'm ready to assist! Please ask any question about Ethiopian entrance exams or study notes.";
      setAiMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          source: res?.source || activeRoleConfig.model,
          persona: res?.persona || activeRoleConfig.id
        }
      ]);
    } catch {
      setAiMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          text: "⚠️ Unable to reach the AI Tutor right now. Please check your internet connection or try again shortly.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          source: "offline"
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  }, [aiInput, aiLoading, aiContext, aiMessages, aiRole]);

  const handleAskAiFromQuestion = useCallback((q, review) => {
    const prompt = stripMetadataPrefix(q.prompt || q.stem || "");
    const correctOpt = q.options?.find((o) => o.key === (q.correctAnswer || review?.correctKey || review?.correctAnswer));
    const userOpt = q.options?.find((o) => o.key === review?.selectedKey);
    const ctx = {
      questionPrompt: prompt,
      options: q.options,
      correctAnswer: correctOpt ? `${correctOpt.key}. ${correctOpt.text || correctOpt.label}` : q.correctAnswer,
      userAnswer: userOpt ? `${userOpt.key}. ${userOpt.text || userOpt.label}` : review?.selectedKey,
      explanation: q.explanation || review?.explanation,
      subjectName: activeExamSession?.exam?.title || q.subjectName,
      gradeLevel: q.gradeLevel
    };
    setAiContext(ctx);
    setActiveExamSession(null);
    setSelectedSubject(null);
    setSelectedNoteSubject(null);
    setTab("ai");
  }, [activeExamSession]);

  const handleAskAiFromNote = useCallback((note) => {
    const ctx = {
      noteTitle: note.title,
      noteBody: note.body,
      subjectName: selectedNoteSubject?.name || note.subjectId?.name,
      chapterTitle: note.chapterId?.title
    };
    setAiContext(ctx);
    setSelectedNote(null);
    setSelectedSubject(null);
    setSelectedNoteSubject(null);
    setTab("ai");
  }, [selectedNoteSubject]);

  // Load chapters for selectedSubject's discipline (exact logic from Mobile/src/screens/SubjectScreen.js)
  const curDiscipline = getSubjectDiscipline(selectedSubject);
  const curSubjId = String(selectedSubject?._id || selectedSubject?.id || "");

  const disciplineSubjects = useMemo(() => {
    if (!selectedSubject) return [];
    const matched = (subjects || []).filter((s) => {
      if (String(s._id || s.id) === curSubjId) return true;
      return curDiscipline && getSubjectDiscipline(s) === curDiscipline;
    });
    return matched.length === 0 ? [selectedSubject] : matched;
  }, [subjects, curSubjId, curDiscipline, selectedSubject]);

  useEffect(() => {
    let active = true;
    async function loadDisciplineChapters() {
      if (!disciplineSubjects.length) {
        setSubjectChapters([]);
        return;
      }
      try {
        const results = await Promise.all(
          disciplineSubjects.map(async (subj) => {
            const sId = subj._id || subj.id;
            if (!sId) return [];
            try {
              const res = await apiRequest(`/question-bank/subjects/${sId}/chapters`);
              const chs = Array.isArray(res?.chapters) ? res.chapters : [];
              return chs.map((c) => ({
                ...c,
                gradeLevel: c.gradeLevel || subj.gradeLevel || "grade-12",
                subjectCode: subj.code || ""
              }));
            } catch {
              return [];
            }
          })
        );
        if (active) setSubjectChapters(results.flat());
      } catch {
        // ignore
      }
    }
    loadDisciplineChapters();
    return () => {
      active = false;
    };
  }, [disciplineSubjects]);

  // HomeScreen filtered subjects
  const isNatural = (currentUser?.stream || "natural") === "natural";
  const streamSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      if (subject.stream) return subject.stream === "both" || subject.stream === (isNatural ? "natural" : "social");
      const code = subject.code || "";
      return isNatural
        ? !["HIST", "GEOG", "ECON", "MATH_SOC"].includes(code)
        : !["PHYS", "CHEM", "BIO", "MATH_NAT"].includes(code);
    });
  }, [subjects, isNatural]);

  useEffect(() => {
    if (streamSubjects.length > 0 && !streamSubjects.some((subject) => subjectSupportsGrade(subject, selectedGrade))) {
      const firstAvailableGrade = GRADES.find((grade) => streamSubjects.some((subject) => subjectSupportsGrade(subject, grade)));
      if (firstAvailableGrade) setSelectedGrade(firstAvailableGrade);
    }
  }, [selectedGrade, streamSubjects]);

  const gradeSubjects = useMemo(
    () => streamSubjects.filter((subject) => subjectSupportsGrade(subject, selectedGrade)),
    [streamSubjects, selectedGrade]
  );

  const noteGradeSubjects = useMemo(
    () => streamSubjects.filter((subject) => subjectSupportsGrade(subject, selectedNoteGrade)),
    [streamSubjects, selectedNoteGrade]
  );

  // SubjectScreen computed exams, chapters, and notes
  const subjectExams = useMemo(() => {
    if (!selectedSubject) return [];
    return exams.filter((exam) => {
      const examSubj = exam.subjectId;
      const examSubjId = String(examSubj?._id || examSubj || "");
      if (curSubjId && examSubjId === curSubjId) return true;

      if (curDiscipline) {
        let examSubjObj = typeof examSubj === "object" && examSubj !== null ? examSubj : null;
        if (!examSubjObj && Array.isArray(subjects) && examSubjId) {
          examSubjObj = subjects.find((s) => String(s._id || s.id) === examSubjId) || null;
        }
        const examDiscipline = getSubjectDiscipline(examSubjObj);
        if (examDiscipline && examDiscipline === curDiscipline) return true;

        const title = String(exam.title || "").toLowerCase();
        if (curDiscipline === "BIO" && (title.includes("biology") || title.includes("bio"))) return true;
        if (curDiscipline === "CHEM" && (title.includes("chemistry") || title.includes("chem"))) return true;
        if (curDiscipline === "PHYS" && (title.includes("physics") || title.includes("phys"))) return true;
        if (curDiscipline === "MATH" && (title.includes("math") || title.includes("calculus"))) return true;
        if (curDiscipline === "ENG" && (title.includes("english") || title.includes("eng"))) return true;
        if (curDiscipline === "GEOG" && (title.includes("geography") || title.includes("geog"))) return true;
        if (curDiscipline === "HIST" && (title.includes("history") || title.includes("hist"))) return true;
        if (curDiscipline === "ECON" && (title.includes("economics") || title.includes("econ"))) return true;
      }
      return false;
    });
  }, [exams, curSubjId, curDiscipline, subjects, selectedSubject]);

  const subjectYears = useMemo(() => {
    return [...subjectExams].sort((a, b) =>
      getYear(b).localeCompare(getYear(a), undefined, { numeric: true })
    );
  }, [subjectExams]);

  const activeExam = subjectYears[selectedExamYearIndex] || subjectYears[0] || null;
  const activeYear = activeExam ? getYear(activeExam) : "";

  const activeExamChapters = useMemo(() => {
    if (!activeExam) return [];
    if (Array.isArray(activeExam.chapterBreakdown) && activeExam.chapterBreakdown.length > 0) {
      return activeExam.chapterBreakdown;
    }
    if (Array.isArray(activeExam.chapterIds)) {
      return activeExam.chapterIds.map((ch, idx) => ({
        chapterId: typeof ch === "object" ? String(ch._id || ch.id) : String(ch),
        title: typeof ch === "object" ? ch.title : `Unit ${idx + 1}`,
        order: typeof ch === "object" ? ch.order ?? idx + 1 : idx + 1,
        questionCount: null
      }));
    }
    return [];
  }, [activeExam]);

  const subjectNotes = useMemo(
    () => getNotesForGradeSubject(notes, selectedNoteSubject, selectedNoteGrade, subjects),
    [notes, selectedNoteSubject, selectedNoteGrade, subjects]
  );

  const allSubjectChapters = useMemo(() => {
    if (subjectChapters && subjectChapters.length > 0) {
      return [...subjectChapters].sort((a, b) => {
        const gradeOrder = { "grade-9": 9, "grade-10": 10, "grade-11": 11, "grade-12": 12 };
        const gA = gradeOrder[a.gradeLevel] ?? 12;
        const gB = gradeOrder[b.gradeLevel] ?? 12;
        if (gA !== gB) return gA - gB;
        return (a.order ?? 999) - (b.order ?? 999);
      });
    }
    const list = [];
    const seenIds = new Set();
    subjectExams.forEach((exam) => {
      if (Array.isArray(exam.chapterBreakdown)) {
        exam.chapterBreakdown.forEach((b) => {
          if (b.chapterId && !seenIds.has(String(b.chapterId))) {
            seenIds.add(String(b.chapterId));
            list.push({ _id: b.chapterId, title: b.title, order: b.order, gradeLevel: b.gradeLevel });
          }
        });
      }
    });
    return list;
  }, [subjectChapters, subjectExams]);

  const chaptersByGrade = useMemo(() => {
    const groups = [
      { key: "grade-9", label: "Grade 9", items: [] },
      { key: "grade-10", label: "Grade 10", items: [] },
      { key: "grade-11", label: "Grade 11", items: [] },
      { key: "grade-12", label: "Grade 12", items: [] }
    ];
    allSubjectChapters.forEach((ch) => {
      const gKey = ch.gradeLevel || "grade-12";
      const target = groups.find((g) => g.key === gKey) || groups[3];
      target.items.push(ch);
    });
    return groups.filter((g) => g.items.length > 0);
  }, [allSubjectChapters]);

  function getExamBreakdownForChapter(chId, chTitle) {
    const matches = [];
    subjectExams.forEach((exam) => {
      const yr = getYear(exam);
      if (Array.isArray(exam.chapterBreakdown) && exam.chapterBreakdown.length > 0) {
        const found = exam.chapterBreakdown.find((b) => {
          if (String(b.chapterId) === String(chId)) return true;
          if (chTitle && b.title) {
            const cleanA = chTitle.toLowerCase().replace(/^(chapter|unit)\s*\d+:\s*/i, "").trim();
            const cleanB = b.title.toLowerCase().replace(/^(chapter|unit)\s*\d+:\s*/i, "").replace(/\(grade\s*\d+\)/i, "").trim();
            if (cleanA && cleanB && (cleanA.includes(cleanB) || cleanB.includes(cleanA))) return true;
          }
          return false;
        });
        if (found) {
          matches.push({
            exam,
            year: yr,
            chapterId: found.chapterId || chId,
            questionCount: found.questionCount
          });
        }
      }
    });
    return matches;
  }

  const officialNotes = useMemo(() => subjectNotes.filter((n) => n.isPublic !== false), [subjectNotes]);
  const personalNotes = useMemo(() => subjectNotes.filter((n) => !n.isPublic), [subjectNotes]);

  // ExamsScreen computed groups
  const streamFilteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const subjStream = exam.subjectId?.stream;
      const subjCode = exam.subjectId?.code || "";
      if (isNatural) {
        if (subjStream) return subjStream === "natural" || subjStream === "both";
        if (subjCode) return ["MATH", "PHYS", "CHEM", "BIO", "ENG", "APTITUDE", "SAT"].some((k) => subjCode.startsWith(k));
        const t = (exam.title || "").toLowerCase();
        return !(t.includes("social") || t.includes("history") || t.includes("geography") || t.includes("economics"));
      } else {
        if (subjStream) return subjStream === "social" || subjStream === "both";
        if (subjCode) return ["HIST", "GEOG", "ECON", "ENG", "APTITUDE", "SAT", "MATH_SOC"].some((k) => subjCode.startsWith(k));
        const t = (exam.title || "").toLowerCase();
        return !(t.includes("physics") || t.includes("chemistry") || t.includes("biology") || t.includes("natural"));
      }
    });
  }, [exams, isNatural]);

  const searchFilteredExams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return streamFilteredExams;
    return streamFilteredExams.filter((exam) => {
      const fullTitle = String(exam.title || "").toLowerCase();
      const baseTitle = getExamTitleBase(exam).toLowerCase();
      const subjectName = String(exam.subjectId?.name || "").toLowerCase();
      const examYear = String(getYear(exam)).toLowerCase();
      return fullTitle.includes(q) || baseTitle.includes(q) || subjectName.includes(q) || examYear.includes(q);
    });
  }, [streamFilteredExams, searchQuery]);

  const allExamTitles = useMemo(() => {
    const map = {};
    streamFilteredExams.forEach((exam) => {
      map[getExamTitleBase(exam)] = true;
    });
    return Object.keys(map).sort((a, b) => a.localeCompare(b));
  }, [streamFilteredExams]);

  const filteredExams = useMemo(() => {
    if (selectedTitleFilter === "all") return searchFilteredExams;
    return searchFilteredExams.filter((ex) => getExamTitleBase(ex) === selectedTitleFilter);
  }, [searchFilteredExams, selectedTitleFilter]);

  const yearGroups = useMemo(() => {
    const map = {};
    filteredExams.forEach((exam) => {
      const y = getYear(exam);
      if (!map[y]) map[y] = [];
      map[y].push(exam);
    });
    const sortedYears = Object.keys(map).sort((a, b) => {
      if (a === "Practice") return 1;
      if (b === "Practice") return -1;
      return b.localeCompare(a, undefined, { numeric: true });
    });
    return sortedYears.map((year) => ({
      year,
      exams: map[year].slice().sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")))
    }));
  }, [filteredExams]);

  const titleGroups = useMemo(() => {
    const map = {};
    searchFilteredExams.forEach((exam) => {
      const baseTitle = getExamTitleBase(exam);
      if (!map[baseTitle]) map[baseTitle] = [];
      map[baseTitle].push(exam);
    });
    return Object.keys(map)
      .sort((a, b) => a.localeCompare(b))
      .map((title) => ({
        title,
        exams: map[title].slice().sort((a, b) => (Number(getYear(b)) || 0) - (Number(getYear(a)) || 0))
      }));
  }, [searchFilteredExams]);

  const allYears = useMemo(() => yearGroups.map((g) => g.year), [yearGroups]);

  // Actions matching Mobile/App.js
  async function handleStartExam(examItem, options = {}) {
    const loadingKey = options?.chapterId ? `${examItem._id}_${options.chapterId}` : examItem._id;
    setLoadingExamId(loadingKey);
    setNotice(null);
    setAnswers({});
    setExamResult(null);
    setFilterMistakesOnly(false);
    try {
      const params = new URLSearchParams();
      if (options?.chapterId) params.set("chapterId", options.chapterId);
      const qs = params.toString();
      const examData = await apiRequest(`/exams/${examItem._id}/start${qs ? `?${qs}` : ""}`, { method: "POST" });
      setActiveExamSession(examData);
    } catch {
      // Fallback: load full questions of this exam without grade restriction
      try {
        const qRes = await apiRequest(`/question-bank/questions?limit=500`);
        const allBankQuestions = qRes?.questions || [];
        let qsList = [];
        if (Array.isArray(examItem.questionIds) && examItem.questionIds.length > 0) {
          const idSet = new Set(examItem.questionIds.map(String));
          qsList = allBankQuestions.filter((q) => idSet.has(String(q._id)));
        }
        if (qsList.length === 0) {
          const examSubjObj = typeof examItem.subjectId === "object" ? examItem.subjectId : null;
          const disc = getSubjectDiscipline(examSubjObj);
          qsList = allBankQuestions.filter((q) => {
            const qDisc = getSubjectDiscipline(q.subjectId);
            return disc && qDisc === disc;
          });
        }
        if (options?.chapterId) {
          const byChapter = qsList.filter((q) => String(q.chapterId?._id || q.chapterId) === String(options.chapterId));
          if (byChapter.length > 0) qsList = byChapter;
        }
        setActiveExamSession({
          attempt: { _id: `sim_${examItem._id}` },
          exam: {
            ...examItem,
            questions: qsList.length > 0 ? qsList : (examItem.questions || [])
          }
        });
      } catch (err2) {
        setNotice({ type: "error", message: err2.message || "Failed to start exam session." });
      }
    } finally {
      setLoadingExamId(null);
    }
  }

  async function handleSubmitExam() {
    if (!activeExamSession) return;
    setSubmittingExam(true);
    const qsList = activeExamSession.exam?.questions || [];
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selected]) => ({
        questionId,
        selectedOptionKeys: [selected]
      }));
      const res = await apiRequest(`/exams/attempts/${activeExamSession.attempt?._id}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers: formattedAnswers })
      });
      if (res?.attempt) {
        setExamResult(res.attempt);
        setNotice({ type: "success", message: `Exam submitted! Score: ${res.attempt.percentage}%` });
        return;
      }
    } catch {
      // Local grading fallback
      let score = 0;
      const questionResults = qsList.map((q) => {
        const userAns = answers[q._id];
        const correctKey = Array.isArray(q.correctAnswers) ? q.correctAnswers[0] : q.correctAnswer || "A";
        const isCorrect = Boolean(userAns && userAns === correctKey);
        if (isCorrect) score += 1;
        const selectedOpt = (q.options || []).find((o) => o.key === userAns);
        const correctOpt = (q.options || []).find((o) => o.key === correctKey);
        return {
          questionId: q._id,
          isCorrect,
          correctAnswer: correctKey,
          selectedAnswerText: selectedOpt ? `${selectedOpt.key}. ${selectedOpt.text || selectedOpt.label}` : "Not answered",
          correctAnswerText: correctOpt ? `${correctOpt.key}. ${correctOpt.text || correctOpt.label}` : correctKey,
          explanation: q.explanation
        };
      });
      const totalMarks = qsList.length || 1;
      const percentage = Math.round((score / totalMarks) * 100);
      const computedAttempt = {
        score,
        totalMarks,
        percentage,
        passed: percentage >= (activeExamSession.exam?.passingScore || 50),
        questionResults
      };
      setExamResult(computedAttempt);
      setNotice({ type: "success", message: `Exam submitted! Score: ${percentage}%` });
    } finally {
      setSubmittingExam(false);
    }
  }

  function toggleFavorite(question) {
    const qId = question._id || question.prompt;
    const next = { ...favoritesMap };
    if (next[qId]) {
      delete next[qId];
    } else {
      next[qId] = {
        _id: qId,
        questionId: question._id,
        prompt: question.prompt || question.stem,
        options: question.options,
        explanation: question.explanation,
        correctAnswer: question.correctAnswer,
        savedAt: new Date().toISOString()
      };
    }
    setFavoritesMap(next);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  const handleCopy = useCallback((value, fieldName) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(String(value)).catch(() => {});
    }
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1800);
  }, []);

  async function handleCreatePersonalNote() {
    setPersonalError("");
    if (!personalTitle.trim() || !personalBody.trim()) {
      setPersonalError("Please provide both title and content for your note.");
      return;
    }
    setSavingNote(true);
    try {
      const newNote = {
        _id: "note_" + Date.now(),
        title: personalTitle.trim(),
        body: personalBody.trim(),
        subjectId: selectedNoteSubject?._id || selectedSubject?._id,
        isPublic: false,
        updatedAt: new Date().toISOString()
      };
      setNotes((prev) => [newNote, ...prev]);
      setPersonalTitle("");
      setPersonalBody("");
      setShowPersonalForm(false);
      setNotice({ type: "success", message: "Note saved to server." });
    } finally {
      setSavingNote(false);
    }
  }

  async function handleLogProgress() {
    setLogError("");
    if (!logContentId.trim()) {
      setLogError("Please provide a valid Subject or Exam ID.");
      return;
    }
    setSavingProgress(true);
    try {
      const item = {
        _id: "prog_" + Date.now(),
        contentType: "subject",
        contentId: logContentId.trim(),
        progressPercent: Number(logPercent) || 0,
        timeSpentSeconds: Number(logTimeSpent) || 0,
        completed: (Number(logPercent) || 0) >= 100
      };
      setProgress((prev) => [item, ...prev]);
      setLogContentId("");
      setShowLogForm(false);
      setNotice({ type: "success", message: "Progress recorded." });
    } finally {
      setSavingProgress(false);
    }
  }

  async function handleSubmitPayment() {
    setPayError("");
    setPaySuccess("");
    const parsedAmount = Number(amountPaid) || 200;
    const hasTxInfo = Boolean(transactionNumber.trim() && payFullName.trim() && parsedAmount > 0);
    const hasScreenshot = Boolean(receiptScreenshot.trim());

    if (!hasTxInfo && !hasScreenshot) {
      setPayError(
        "Please provide either:\n• Full Name + Transaction Number + Amount Paid\nOR\n• Browse and select a Receipt Screenshot from your device."
      );
      return;
    }
    setSubmittingPayment(true);
    try {
      const newPay = {
        _id: "pay_" + Date.now(),
        amount: parsedAmount,
        currency: "ETB",
        provider: selectedProvider,
        fullName: payFullName.trim() || currentUser.displayName,
        transactionReference: transactionNumber.trim(),
        receiptUrl: receiptScreenshot.trim(),
        status: "pending",
        submittedAt: new Date().toISOString()
      };
      setPayments((prev) => [newPay, ...prev]);
      setPaySuccess("Your payment has been submitted for review.");
      setTransactionNumber("");
      setReceiptScreenshot("");
    } finally {
      setSubmittingPayment(false);
    }
  }

  function handleSaveProfile() {
    setProfileError("");
    setProfileSuccess("");
    if (!profileDisplayName.trim() || !profileEmail.trim()) {
      setProfileError("Name and email are required.");
      return;
    }
    setCurrentUser((prev) => ({
      ...prev,
      displayName: profileDisplayName.trim(),
      email: profileEmail.trim(),
      phoneNumber: profilePhone.trim(),
      notifications: profileNotifications
    }));
    setProfileSuccess("Profile updated successfully!");
    setIsEditingProfile(false);
  }

  function handleChangePassword() {
    setProfileError("");
    setProfileSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setProfileError("All password fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setProfileError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setProfileError("New passwords do not match.");
      return;
    }
    setProfileSuccess("Password updated successfully!");
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  function renderExamCard(item, showYearBadge = false) {
    const isPremium = item.accessLevel === "premium";
    const year = getYear(item);
    const examChapters = getExamChapters(item);

    return (
      <div
        key={item._id}
        style={{
          background: COLORS.surface,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          border: `1px solid ${COLORS.border}`,
          boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", flex: 1 }}>
            <span
              style={{
                padding: "3px 8px",
                borderRadius: 8,
                fontSize: 10,
                fontWeight: 800,
                background: isPremium ? COLORS.warningBg : COLORS.successBg,
                color: isPremium ? COLORS.warning : COLORS.success
              }}
            >
              {isPremium ? "PREMIUM" : "FREE ACCESS"}
            </span>
            {item.subjectId?.name && (
              <span
                style={{
                  background: COLORS.primaryBg,
                  color: COLORS.primaryDark,
                  padding: "3px 8px",
                  borderRadius: 8,
                  fontSize: 10,
                  fontWeight: 800
                }}
              >
                {item.subjectId.name}
              </span>
            )}
            {showYearBadge && (
              <span
                style={{
                  background: "#F3F4F6",
                  color: COLORS.text,
                  padding: "3px 8px",
                  borderRadius: 8,
                  fontSize: 10,
                  fontWeight: 800
                }}
              >
                {year} E.C.
              </span>
            )}
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted }}>
            {item.durationMinutes} min
          </span>
        </div>

        <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.text, marginBottom: 4 }}>
          {item.title}
        </div>

        {item.description && (
          <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 8, lineHeight: 1.4 }}>
            {item.description}
          </div>
        )}

        {examChapters.length > 0 && (
          <div
            style={{
              background: COLORS.background,
              border: `1px solid ${COLORS.borderLight}`,
              borderRadius: 12,
              padding: 8,
              marginBottom: 8
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.text, marginBottom: 6 }}>
              Practise by Chapter ({examChapters.length} units):
            </div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
              {examChapters.map((ch, idx) => {
                const gPrefix = formatShortGrade(ch.gradeLevel);
                const unitMatch = String(ch.title || "").match(/^(?:Unit|Chapter)\s*(\d+)/i);
                const shortUnit = unitMatch ? `Unit ${unitMatch[1]}` : `Unit ${idx + 1}`;
                return (
                  <button
                    key={ch.id || idx}
                    type="button"
                    onClick={() => handleStartExam(item, { chapterId: ch.id })}
                    style={{
                      background: COLORS.surface,
                      border: `1px solid ${COLORS.primaryLight}`,
                      borderRadius: 999,
                      padding: "5px 10px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontSize: 11,
                      fontWeight: 700,
                      color: COLORS.primaryDark
                    }}
                  >
                    ▶ {gPrefix ? `${gPrefix} • ` : ""}{shortUnit}
                    {ch.questionCount ? ` (${ch.questionCount} Qs)` : ""}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "6px 0",
            borderTop: `1px solid ${COLORS.border}`,
            marginTop: 4,
            marginBottom: 10,
            fontSize: 12,
            color: COLORS.textMuted
          }}
        >
          <span>Passing score: {item.passingScore || 50}%</span>
          <span>{item.questionIds?.length || 0} questions</span>
        </div>

        <button
          type="button"
          onClick={() => handleStartExam(item)}
          disabled={loadingExamId === item._id}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 12,
            border: "none",
            background: isPremium ? COLORS.secondary : COLORS.primary,
            color: COLORS.onPrimary,
            fontSize: 14,
            fontWeight: 800,
            cursor: "pointer"
          }}
        >
          {loadingExamId === item._id
            ? "Opening..."
            : `Practise Full ${year} E.C. Exam (${item.questionIds?.length || 0} Qs)`}
        </button>
      </div>
    );
  }

  const activeMethod = PAYMENT_METHODS.find((m) => m.id === selectedProvider) || PAYMENT_METHODS[0];
  const favoritesList = Object.values(favoritesMap);
  const totalTimeSpentSeconds = progress.reduce((acc, curr) => acc + (curr.timeSpentSeconds || 0), 0);
  const completedCount = progress.filter((p) => p.completed).length;

  return (
    <div style={{ padding: "8px 0 32px" }}>
      {onBackToPortal && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 430, margin: "0 auto 14px" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)" }}>
            EthioPrep Mobile App (`Mobile/App.js`)
          </span>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onBackToPortal}>
            Staff Portal Sign In →
          </button>
        </div>
      )}

      {/* Exact Mobile App Container matching Mobile/App.js */}
      <div
        style={{
          maxWidth: 430,
          margin: "0 auto",
          background: COLORS.background,
          borderRadius: 28,
          border: `6px solid #1e293b`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
          overflow: "hidden",
          color: COLORS.text,
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}
      >
        <div style={{ padding: 16, minHeight: 740, maxHeight: 820, overflowY: "auto" }}>
          {/* ── Header.js ── */}
          <div
            style={{
              background: COLORS.surface,
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: `1px solid ${COLORS.border}`,
              boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)"
            }}
          >
            <div
              onClick={() => {
                setSelectedSubject(null);
                setActiveExamSession(null);
                setTab("profile");
              }}
              style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  background: COLORS.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.onPrimary,
                  fontSize: 18,
                  fontWeight: 900
                }}
              >
                {(currentUser?.displayName || "S")[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.text, letterSpacing: -0.5 }}>
                  EthioPrep
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
                  {currentUser?.displayName || "Student"} · {currentUser?.role || "student"}
                </div>
              </div>
            </div>
          </div>

          {/* Notice Banner */}
          {notice?.message && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                marginBottom: 14,
                fontSize: 13,
                fontWeight: 700,
                background: notice.type === "error" ? COLORS.dangerBg : COLORS.successBg,
                color: notice.type === "error" ? COLORS.danger : COLORS.success,
                border: `1px solid ${notice.type === "error" ? COLORS.danger : COLORS.success}`
              }}
            >
              {notice.message}
            </div>
          )}

          {/* ── Active Exam View (ExamActiveScreen.js) ── */}
          {activeExamSession ? (
            <div>
              {/* Zoom Modal */}
              {zoomedUri && (
                <div
                  onClick={() => setZoomedUri(null)}
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(15, 23, 42, 0.85)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 16
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ background: "#fff", borderRadius: 16, padding: 16, maxWidth: 500, width: "100%" }}
                  >
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                      <button
                        type="button"
                        onClick={() => setZoomedUri(null)}
                        style={{
                          background: COLORS.danger,
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 12px",
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: "pointer"
                        }}
                      >
                        ✕ Close Diagram
                      </button>
                    </div>
                    <img src={zoomedUri} alt="Diagram" style={{ width: "100%", maxHeight: 380, objectFit: "contain" }} />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <button
                  type="button"
                  onClick={() => setActiveExamSession(null)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    minHeight: 36,
                    padding: "0 10px",
                    borderRadius: 12,
                    border: "none",
                    background: COLORS.dangerBg,
                    color: COLORS.danger,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer"
                  }}
                >
                  ✕ Exit Exam
                </button>
                <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted }}>
                  {Object.keys(answers).length}/{(activeExamSession.exam?.questions || []).length} Answered
                </span>
              </div>

              <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, marginBottom: 12 }}>
                {activeExamSession.exam?.title || "Active Examination"}
              </div>

              {examResult && (
                <div
                  style={{
                    background: COLORS.surfaceMuted,
                    borderRadius: 16,
                    padding: "20px 16px",
                    marginBottom: 16,
                    textAlign: "center",
                    border: `1px solid ${COLORS.border}`
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.textMuted }}>Exam Completed</div>
                  <div style={{ fontSize: 42, fontWeight: 900, color: COLORS.primary, margin: "4px 0" }}>
                    {examResult.percentage}%
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 800,
                      marginBottom: 8,
                      background: examResult.passed ? COLORS.successBg : COLORS.dangerBg,
                      color: examResult.passed ? COLORS.success : COLORS.danger
                    }}
                  >
                    {examResult.passed ? "PASSED" : "NEEDS IMPROVEMENT"}
                  </span>
                  <div style={{ fontSize: 13, color: COLORS.textMuted }}>
                    Score: {examResult.score} / {examResult.totalMarks} points
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button
                      type="button"
                      onClick={() => setFilterMistakesOnly(false)}
                      style={{
                        flex: 1,
                        padding: 8,
                        borderRadius: 8,
                        border: `1px solid ${!filterMistakesOnly ? COLORS.primary : COLORS.border}`,
                        background: !filterMistakesOnly ? COLORS.primary : COLORS.surface,
                        color: !filterMistakesOnly ? COLORS.onPrimary : COLORS.textMuted,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      All Questions ({(activeExamSession.exam?.questions || []).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterMistakesOnly(true)}
                      style={{
                        flex: 1,
                        padding: 8,
                        borderRadius: 8,
                        border: `1px solid ${filterMistakesOnly ? COLORS.primary : COLORS.border}`,
                        background: filterMistakesOnly ? COLORS.primary : COLORS.surface,
                        color: filterMistakesOnly ? COLORS.onPrimary : COLORS.textMuted,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      Review Mistakes (
                      {(examResult.questionResults || []).filter((r) => !r.isCorrect).length})
                    </button>
                  </div>
                </div>
              )}

              {(activeExamSession.exam?.questions || []).map((question, idx) => {
                const review = (examResult?.questionResults || []).find(
                  (r) => String(r.questionId) === String(question._id)
                );
                const isCorrect = review ? review.isCorrect : true;
                if (examResult && filterMistakesOnly && isCorrect) return null;

                const selected = answers[question._id];
                const isFav = Boolean(favoritesMap[question._id || question.prompt]);
                const resolvedYear = String(question.examYear || activeExamSession.exam?.examYear || "2016");
                const resolvedTopic = question.chapterTitle || question.topic || "General Curriculum Topic";
                const resolvedGrade = formatShortGrade(question.gradeLevel);
                const { prompt: stemText, passage: passageText } = splitPassageAndQuestion(
                  question.prompt || question.stem || "",
                  question.passage || ""
                );
                const segments = parseQuestionSegments(stemText);

                return (
                  <div
                    key={question._id || idx}
                    style={{
                      background: COLORS.surface,
                      borderRadius: 16,
                      padding: 16,
                      marginBottom: 12,
                      border: `1px solid ${COLORS.border}`
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            background: COLORS.primary,
                            color: COLORS.onPrimary,
                            borderRadius: 6,
                            padding: "2px 6px",
                            fontSize: 11,
                            fontWeight: 800
                          }}
                        >
                          Q{idx + 1}
                        </span>
                        <span
                          style={{
                            background: "#E0E7FF",
                            color: "#1E40AF",
                            borderRadius: 6,
                            padding: "2px 6px",
                            fontSize: 10,
                            fontWeight: 800
                          }}
                        >
                          {resolvedYear} E.C.
                        </span>
                        {resolvedGrade && (
                          <span
                            style={{
                              background: COLORS.primaryBg,
                              color: COLORS.primaryDark,
                              borderRadius: 6,
                              padding: "2px 6px",
                              fontSize: 10,
                              fontWeight: 800
                            }}
                          >
                            {resolvedGrade}
                          </span>
                        )}
                        {resolvedTopic && (
                          <span
                            style={{
                              background: COLORS.surfaceMuted,
                              color: COLORS.primaryDark,
                              borderRadius: 6,
                              padding: "2px 8px",
                              fontSize: 10.5,
                              fontWeight: 700,
                              maxWidth: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            }}
                          >
                            {resolvedTopic}
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <button
                          type="button"
                          onClick={() => handleAskAiFromQuestion(question, review)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "3px 10px",
                            borderRadius: 999,
                            border: `1px solid ${COLORS.primaryLight}`,
                            background: COLORS.primaryBg,
                            color: COLORS.primaryDark,
                            fontSize: 11,
                            fontWeight: 800,
                            cursor: "pointer",
                            flexShrink: 0
                          }}
                        >
                          ✨ Ask AI
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(question)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "3px 10px",
                            borderRadius: 999,
                            border: `1px solid ${isFav ? COLORS.warning : COLORS.border}`,
                            background: isFav ? COLORS.warningBg : COLORS.surface,
                            color: isFav ? COLORS.warning : COLORS.textMuted,
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                            flexShrink: 0
                          }}
                        >
                          ★ {isFav ? "Saved" : "Save"}
                        </button>
                      </div>
                    </div>

                    {examResult && (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "3px 8px",
                          borderRadius: 6,
                          marginBottom: 8,
                          fontSize: 12,
                          fontWeight: 800,
                          background: isCorrect ? COLORS.successBg : COLORS.dangerBg,
                          color: isCorrect ? COLORS.success : COLORS.danger
                        }}
                      >
                        {isCorrect ? "✓ Correct" : "✕ Mistake / Incorrect"}
                      </div>
                    )}

                    {passageText && (
                      <div
                        style={{
                          background: "#F8FAFC",
                          borderLeft: "3px solid #6366F1",
                          padding: 10,
                          borderRadius: 6,
                          marginBottom: 10
                        }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 800, color: "#4338CA", marginBottom: 4 }}>
                          📖 READING PASSAGE / STIMULUS
                        </div>
                        <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                          {formatMathText(passageText)}
                        </div>
                      </div>
                    )}

                    {segments.map((seg, sIdx) =>
                      seg.type === "table" ? (
                        <SimTable key={sIdx} headers={seg.headers} rows={seg.rows} />
                      ) : (
                        <div
                          key={sIdx}
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: COLORS.text,
                            lineHeight: 1.45,
                            marginBottom: 12,
                            whiteSpace: "pre-wrap"
                          }}
                        >
                          {formatMathText(seg.content)}
                        </div>
                      )
                    )}

                    {question.imageUrl && (
                      <div
                        onClick={() => setZoomedUri(question.imageUrl)}
                        style={{
                          background: "#F8FAFC",
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: 12,
                          padding: 8,
                          marginBottom: 12,
                          textAlign: "center",
                          cursor: "pointer"
                        }}
                      >
                        <img
                          src={question.imageUrl}
                          alt="Question diagram"
                          style={{ width: "100%", maxHeight: 200, objectFit: "contain", background: "#fff", borderRadius: 8 }}
                        />
                        <div
                          style={{
                            display: "inline-block",
                            marginTop: 6,
                            background: COLORS.primaryBg,
                            color: COLORS.primaryDark,
                            padding: "3px 10px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700
                          }}
                        >
                          🔍 Tap to enlarge diagram
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {(question.options || []).map((option) => {
                        const isSelected = selected === option.key;
                        const isTheCorrectAnswer = examResult && review?.correctAnswer === option.key;
                        const isUserMistake = examResult && isSelected && !isCorrect;
                        const parsedOpt = parseOptionContent(option.text || option.label || "");
                        const optImg = option.imageUrl || question.optionImages?.[option.key];

                        return (
                          <div
                            key={option.key}
                            onClick={() => {
                              if (!examResult) {
                                setAnswers((prev) => ({ ...prev, [question._id]: option.key }));
                              }
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: 12,
                              borderRadius: 12,
                              border: `1px solid ${
                                isTheCorrectAnswer
                                  ? COLORS.success
                                  : isUserMistake
                                  ? COLORS.danger
                                  : isSelected
                                  ? COLORS.primary
                                  : COLORS.border
                              }`,
                              background: isTheCorrectAnswer
                                ? COLORS.successBg
                                : isUserMistake
                                ? COLORS.dangerBg
                                : isSelected
                                ? COLORS.surfaceMuted
                                : COLORS.surface,
                              cursor: examResult ? "default" : "pointer"
                            }}
                          >
                            <div
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: 9,
                                border: `2px solid ${
                                  isTheCorrectAnswer
                                    ? COLORS.success
                                    : isUserMistake
                                    ? COLORS.danger
                                    : isSelected
                                    ? COLORS.primary
                                    : COLORS.border
                                }`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 8,
                                flexShrink: 0
                              }}
                            >
                              {isSelected && (
                                <div
                                  style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    background: isTheCorrectAnswer
                                      ? COLORS.success
                                      : isUserMistake
                                      ? COLORS.danger
                                      : COLORS.primary
                                  }}
                                />
                              )}
                            </div>
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 800,
                                color: isTheCorrectAnswer
                                  ? COLORS.success
                                  : isSelected
                                  ? COLORS.primary
                                  : COLORS.textMuted,
                                marginRight: 6
                              }}
                            >
                              {option.key}.
                            </span>
                            <div style={{ flex: 1 }}>
                              {parsedOpt.type === "table" ? (
                                <SimTable headers={parsedOpt.headers} rows={parsedOpt.rows} compact />
                              ) : (
                                <span
                                  style={{
                                    fontSize: 14,
                                    color: isTheCorrectAnswer
                                      ? COLORS.success
                                      : isSelected
                                      ? COLORS.primary
                                      : COLORS.text,
                                    fontWeight: isSelected || isTheCorrectAnswer ? 700 : 400
                                  }}
                                >
                                  {formatMathText(parsedOpt.content || parsedOpt.text)}
                                </span>
                              )}
                              {optImg && (
                                <img
                                  src={optImg}
                                  alt={`Option ${option.key}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setZoomedUri(optImg);
                                  }}
                                  style={{ width: "100%", maxHeight: 140, objectFit: "contain", marginTop: 6, borderRadius: 6 }}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {examResult && review && !review.isCorrect && (
                      <div
                        style={{
                          marginTop: 12,
                          padding: 12,
                          background: COLORS.dangerBg,
                          borderRadius: 12
                        }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.danger, marginBottom: 4 }}>
                          Review your answer
                        </div>
                        <div style={{ fontSize: 13, color: COLORS.danger }}>
                          Your answer: {formatMathText(review.selectedAnswerText || "Not answered")}
                        </div>
                        <div style={{ fontSize: 13, color: COLORS.success, fontWeight: 700, marginTop: 2 }}>
                          Correct answer: {formatMathText(review.correctAnswerText || review.correctAnswer)}
                        </div>
                      </div>
                    )}

                    {examResult && (question.explanation || review?.explanation) && (
                      <div
                        style={{
                          marginTop: 12,
                          padding: 12,
                          background: COLORS.warningBg,
                          borderRadius: 12
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.warning }}>
                            Explanation:
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAskAiFromQuestion(question, review)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              padding: "2px 8px",
                              borderRadius: 999,
                              border: `1px solid #C7D2FE`,
                              background: "#EEF2FF",
                              color: "#4338CA",
                              fontSize: 11,
                              fontWeight: 800,
                              cursor: "pointer"
                            }}
                          >
                            ✨ Explain with AI
                          </button>
                        </div>
                        <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.45, whiteSpace: "pre-wrap" }}>
                          {formatMathText(question.explanation || review?.explanation)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {!examResult ? (
                <button
                  type="button"
                  disabled={submittingExam}
                  onClick={handleSubmitExam}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "none",
                    background: COLORS.primary,
                    color: COLORS.onPrimary,
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: "pointer",
                    marginTop: 8
                  }}
                >
                  {submittingExam
                    ? "Submitting..."
                    : `Submit Examination (${Object.keys(answers).length}/${(activeExamSession.exam?.questions || []).length})`}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveExamSession(null)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "none",
                    background: COLORS.secondary,
                    color: COLORS.onPrimary,
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: "pointer",
                    marginTop: 8
                  }}
                >
                  Back to Practice Exams
                </button>
              )}
            </div>
          ) : (
            <>
              {/* ── Top TabBar matching Mobile/App.js ── */}
              <div
                style={{
                  display: "flex",
                  background: COLORS.surface,
                  borderRadius: 12,
                  padding: 4,
                  marginBottom: 16,
                  border: `1px solid ${COLORS.border}`
                }}
              >
                {TABS.map((t) => {
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedSubject(null);
                        setSelectedNoteSubject(null);
                        setTab(t.id);
                      }}
                      style={{
                        flex: 1,
                        minHeight: 52,
                        padding: "6px 2px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 3,
                        borderRadius: 8,
                        border: "none",
                        background: active ? COLORS.primary : "transparent",
                        cursor: "pointer"
                      }}
                    >
                      <TabIcon id={t.id} active={active} />
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: active ? COLORS.onPrimary : COLORS.textMuted,
                          whiteSpace: "nowrap"
                        }}
                      >
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* ── SubjectScreen.js ── */}
              {selectedSubject ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedSubject(null)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 12,
                      padding: "3px 0",
                      background: "none",
                      border: "none",
                      color: COLORS.primaryDark,
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: "pointer"
                    }}
                  >
                    ← Back to Subjects
                  </button>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ flex: 1, marginRight: 8 }}>
                      <div style={{ fontSize: 25, fontWeight: 800, color: COLORS.text, letterSpacing: -0.6 }}>
                        {selectedSubject.name}
                      </div>
                      <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>
                        {formatGradeBadge(selectedSubject.gradeLevel)} ·{" "}
                        {selectedSubject.stream === "social" ? "Social Science" : "Natural Science"}
                      </div>
                    </div>
                    <span
                      style={{
                        background: COLORS.primaryBg,
                        color: COLORS.primaryDark,
                        borderRadius: 999,
                        padding: "7px 13px",
                        fontSize: 12,
                        fontWeight: 800
                      }}
                    >
                      {selectedSubject.accessLevel === "premium" ? "Premium" : "Free"}
                    </span>
                  </div>

                  {/* Display Mode Toggle: By Year | By Chapter */}
                  <div
                    style={{
                      display: "flex",
                      background: COLORS.surface,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 16,
                      padding: 4,
                      marginBottom: 12,
                      gap: 4
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setExamViewMode("year")}
                      style={{
                        flex: 1,
                        padding: "10px 8px",
                        borderRadius: 12,
                        border: "none",
                        background: examViewMode === "year" ? COLORS.primary : "transparent",
                        color: examViewMode === "year" ? COLORS.onPrimary : COLORS.textMuted,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      📅 By Year ({subjectYears.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setExamViewMode("chapter")}
                      style={{
                        flex: 1,
                        padding: "10px 8px",
                        borderRadius: 12,
                        border: "none",
                        background: examViewMode === "chapter" ? COLORS.primary : "transparent",
                        color: examViewMode === "chapter" ? COLORS.onPrimary : COLORS.textMuted,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      📚 By Chapter ({allSubjectChapters.length})
                    </button>
                  </div>

                  {/* BY YEAR VIEW */}
                  {examViewMode === "year" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontSize: 17, fontWeight: 800, color: COLORS.text }}>Select Exam Year</span>
                        <span
                          style={{
                            background: COLORS.surfaceAlt,
                            color: COLORS.primaryDark,
                            borderRadius: 999,
                            padding: "2px 8px",
                            fontSize: 12,
                            fontWeight: 800
                          }}
                        >
                          {subjectYears.length}
                        </span>
                      </div>

                      {subjectYears.length > 0 && (
                        <>
                          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12 }}>
                            {subjectYears.map((exam, idx) => {
                              const y = getYear(exam);
                              const isActive = selectedExamYearIndex === idx;
                              const qCount = exam.questionIds?.length || 0;
                              return (
                                <button
                                  key={exam._id}
                                  type="button"
                                  onClick={() => setSelectedExamYearIndex(idx)}
                                  style={{
                                    background: isActive ? COLORS.primaryBg : COLORS.surface,
                                    border: `1px solid ${isActive ? COLORS.primary : COLORS.border}`,
                                    borderRadius: 16,
                                    padding: "10px 14px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  <span style={{ fontSize: 13, fontWeight: 800, color: isActive ? COLORS.primaryDark : COLORS.text }}>
                                    {y} Exam
                                  </span>
                                  <span
                                    style={{
                                      background: isActive ? COLORS.primary : "#F3F4F6",
                                      color: isActive ? COLORS.onPrimary : COLORS.textMuted,
                                      borderRadius: 999,
                                      padding: "2px 7px",
                                      fontSize: 10,
                                      fontWeight: 800
                                    }}
                                  >
                                    {qCount} Qs
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {activeExam && (
                            <div>
                              <div
                                style={{
                                  background: COLORS.surface,
                                  border: `1px solid ${COLORS.border}`,
                                  borderRadius: 22,
                                  padding: 14,
                                  marginBottom: 12
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                  <div style={{ flex: 1, marginRight: 8 }}>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text, marginBottom: 4 }}>
                                      {activeExam.title}
                                    </div>
                                    <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                                      Year: {activeYear} · {activeExam.questionIds?.length || 0} Questions · {activeExam.durationMinutes} min
                                    </div>
                                  </div>
                                  <span
                                    style={{
                                      background: COLORS.primaryBg,
                                      color: COLORS.primaryDark,
                                      borderRadius: 999,
                                      padding: "5px 10px",
                                      fontSize: 11,
                                      fontWeight: 800
                                    }}
                                  >
                                    {activeExam.accessLevel === "premium" ? "Premium" : "Free"}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleStartExam(activeExam)}
                                  style={{
                                    width: "100%",
                                    padding: "11px 14px",
                                    borderRadius: 12,
                                    border: `1.5px solid ${COLORS.primary}`,
                                    background: "transparent",
                                    color: COLORS.primaryDark,
                                    fontSize: 13,
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    marginTop: 4
                                  }}
                                >
                                  Practise Full {activeYear} Exam ({activeExam.questionIds?.length || 0} Qs)
                                </button>
                              </div>

                              <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.text, marginBottom: 2 }}>
                                Chapters in {activeYear} Exam:
                              </div>
                              <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 12 }}>
                                Tap a chapter below to practice questions from that one chapter in {activeYear} at once:
                              </div>

                              {activeExamChapters.map((ch, idx) => {
                                const orderNum = ch.order ?? idx + 1;
                                const unitMatch = String(ch.title || "").match(/^(?:Unit|Chapter)\s*(\d+)/i);
                                const unitLabel = unitMatch ? `Unit ${unitMatch[1]}` : orderNum > 50 ? `Unit ${idx + 1}` : `Unit ${orderNum}`;
                                return (
                                  <div
                                    key={ch.chapterId || idx}
                                    style={{
                                      background: COLORS.surface,
                                      border: `1px solid ${COLORS.border}`,
                                      borderRadius: 16,
                                      padding: 12,
                                      marginBottom: 10
                                    }}
                                  >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                      <div style={{ display: "flex", gap: 6 }}>
                                        <span
                                          style={{
                                            background: COLORS.primaryBg,
                                            color: COLORS.primaryDark,
                                            borderRadius: 6,
                                            padding: "3px 8px",
                                            fontSize: 11,
                                            fontWeight: 800
                                          }}
                                        >
                                          {unitLabel}
                                        </span>
                                        {ch.gradeLevel && (
                                          <span
                                            style={{
                                              background: COLORS.primaryBg,
                                              color: COLORS.primaryDark,
                                              borderRadius: 6,
                                              padding: "3px 8px",
                                              fontSize: 11,
                                              fontWeight: 800
                                            }}
                                          >
                                            {formatGradeBadge(ch.gradeLevel)}
                                          </span>
                                        )}
                                      </div>
                                      <span
                                        style={{
                                          background: COLORS.primaryBg,
                                          color: COLORS.primaryDark,
                                          borderRadius: 999,
                                          padding: "3px 8px",
                                          fontSize: 11,
                                          fontWeight: 800
                                        }}
                                      >
                                        {ch.questionCount !== null ? `${ch.questionCount} Questions` : "Chapter Questions"}
                                      </span>
                                    </div>

                                    <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.text, margin: "6px 0" }}>
                                      {ch.title}
                                    </div>

                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingTop: 8,
                                        marginTop: 8,
                                        borderTop: `1px solid ${COLORS.border}`
                                      }}
                                    >
                                      <span style={{ fontSize: 11, color: COLORS.textMuted }}>
                                        From {activeYear} Exam Booklet
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleStartExam(activeExam, { chapterId: ch.chapterId })}
                                        style={{
                                          background: COLORS.primary,
                                          color: COLORS.onPrimary,
                                          border: "none",
                                          borderRadius: 10,
                                          padding: "7px 12px",
                                          fontSize: 11,
                                          fontWeight: 800,
                                          cursor: "pointer"
                                        }}
                                      >
                                        ▶ Practise {ch.questionCount ? `(${ch.questionCount} Qs)` : "Unit"}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* BY CHAPTER VIEW */}
                  {examViewMode === "chapter" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 17, fontWeight: 800, color: COLORS.text }}>Chapters &amp; Units</span>
                        <span
                          style={{
                            background: COLORS.surfaceAlt,
                            color: COLORS.primaryDark,
                            borderRadius: 999,
                            padding: "2px 8px",
                            fontSize: 12,
                            fontWeight: 800
                          }}
                        >
                          {allSubjectChapters.length}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 12 }}>
                        Select a unit and choose the exam year to practice its questions:
                      </div>

                      {chaptersByGrade.map((group) => (
                        <div key={group.key} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <span style={{ fontSize: 15, fontWeight: 800, color: COLORS.text }}>{group.label} Curriculum</span>
                            <span
                              style={{
                                background: COLORS.surfaceAlt,
                                color: COLORS.primaryDark,
                                borderRadius: 999,
                                padding: "2px 8px",
                                fontSize: 11,
                                fontWeight: 800
                              }}
                            >
                              {group.items.length} Units
                            </span>
                          </div>
                          {group.items.map((ch, idx) => {
                            const chId = String(ch._id || ch.id || idx);
                            const matches = getExamBreakdownForChapter(chId, ch.title);
                            const orderNum = ch.order || idx + 1;
                            const unitMatch = String(ch.title || "").match(/^(?:Unit|Chapter)\s*(\d+)/i);
                            const unitLabel = unitMatch ? `Unit ${unitMatch[1]}` : orderNum > 50 ? `Unit ${idx + 1}` : `Unit ${orderNum}`;
                            return (
                              <div
                                key={chId}
                                style={{
                                  background: COLORS.surface,
                                  border: `1px solid ${COLORS.border}`,
                                  borderRadius: 16,
                                  padding: 12,
                                  marginBottom: 10
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                  <div style={{ display: "flex", gap: 6 }}>
                                    <span style={{ background: COLORS.primaryBg, color: COLORS.primaryDark, borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 800 }}>
                                      {unitLabel}
                                    </span>
                                    <span style={{ background: COLORS.primaryBg, color: COLORS.primaryDark, borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 800 }}>
                                      {group.label}
                                    </span>
                                  </div>
                                  <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted }}>
                                    {matches.length} {matches.length === 1 ? "Year" : "Years"} Available
                                  </span>
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.text, margin: "4px 0" }}>
                                  {ch.title}
                                </div>
                                {matches.length > 0 && (
                                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                                    {matches.map((m) => (
                                      <div
                                        key={m.exam._id}
                                        style={{
                                          background: COLORS.background,
                                          border: `1px solid ${COLORS.borderLight}`,
                                          borderRadius: 10,
                                          padding: 8,
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center"
                                        }}
                                      >
                                        <div>
                                          <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.text }}>
                                            {m.year} National Exam
                                          </div>
                                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                                            {m.questionCount !== null ? `${m.questionCount} questions in this chapter` : m.exam.title}
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleStartExam(m.exam, { chapterId: m.chapterId || chId })}
                                          style={{
                                            background: COLORS.primary,
                                            color: COLORS.onPrimary,
                                            border: "none",
                                            borderRadius: 8,
                                            padding: "6px 10px",
                                            fontSize: 11,
                                            fontWeight: 800,
                                            cursor: "pointer"
                                          }}
                                        >
                                          ▶ Practise {m.year}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : tab === "home" ? (
                /* ── HomeScreen.js ── */
                <div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 25, fontWeight: 800, color: COLORS.text, letterSpacing: -0.5 }}>
                      Choose a subject
                    </div>
                    <div style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.4, marginTop: 5 }}>
                      Select your grade, then pick a subject to practise past exam questions.
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12 }}>
                    {GRADES.map((grade) => {
                      const active = selectedGrade === grade;
                      return (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => setSelectedGrade(grade)}
                          style={{
                            background: active ? COLORS.primary : COLORS.surface,
                            border: `1px solid ${active ? COLORS.primary : COLORS.border}`,
                            borderRadius: 999,
                            padding: "11px 19px",
                            color: active ? COLORS.onPrimary : COLORS.textMuted,
                            fontSize: 14,
                            fontWeight: 800,
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                          }}
                        >
                          Grade {grade}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.text, marginBottom: 8 }}>
                    Grade {selectedGrade} subjects
                  </div>

                  {dashboardLoading ? (
                    <div style={{ padding: 24, textAlign: "center", color: COLORS.textMuted, fontSize: 13 }}>
                      Loading subjects...
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                      {gradeSubjects.map((subject) => (
                        <div
                          key={subject._id || subject.code}
                          onClick={() => {
                            setSelectedExamYearIndex(0);
                            setExamViewMode("year");
                            setSelectedSubject(subject);
                          }}
                          style={{
                            width: "calc(50% - 6px)",
                            minHeight: 202,
                            background: COLORS.surface,
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 22,
                            padding: 12,
                            display: "flex",
                            flexDirection: "column",
                            cursor: "pointer",
                            boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)"
                          }}
                        >
                          <div
                            style={{
                              width: 58,
                              height: 58,
                              borderRadius: 17,
                              background: COLORS.primary,
                              color: COLORS.onPrimary,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 26
                            }}
                          >
                            <SubjectGlyph code={subject.code} />
                          </div>
                          <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.text, marginTop: 12, minHeight: 42 }}>
                            {subject.name}
                          </div>
                          <span
                            style={{
                              alignSelf: "flex-start",
                              background: COLORS.primaryBg,
                              color: COLORS.primaryDark,
                              borderRadius: 999,
                              marginTop: 8,
                              padding: "5px 10px",
                              fontSize: 11,
                              fontWeight: 800
                            }}
                          >
                            Grade {selectedGrade}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderTop: `1px solid ${COLORS.border}`,
                              marginTop: "auto",
                              paddingTop: 8
                            }}
                          >
                            <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted }}>
                              Practice Exams
                            </span>
                            <span style={{ color: COLORS.primary, fontWeight: 900 }}>→</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : tab === "exams" ? (
                /* ── ExamsScreen.js ── */
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, marginBottom: 4 }}>
                    🧪 {isNatural ? "Natural Science Exams" : "Social Science Exams"}
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 12 }}>
                    Past papers, Entrances and Models organized by year and exam title.
                  </div>

                  {/* Search Input */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: COLORS.surface,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 16,
                      padding: "10px 12px",
                      marginBottom: 8,
                      gap: 8
                    }}
                  >
                    <span style={{ color: COLORS.textMuted }}>🔍</span>
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search exams by title (e.g., Biology 2017, Regional Model)..."
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: 14,
                        color: COLORS.text
                      }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer" }}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Mode Toggle: By Year | By Exam Title | All Exams */}
                  <div
                    style={{
                      display: "flex",
                      background: COLORS.surface,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 16,
                      padding: 4,
                      marginBottom: 12,
                      gap: 4
                    }}
                  >
                    {[
                      { id: "year", label: "By Year" },
                      { id: "title", label: "By Exam Title" },
                      { id: "all", label: "All Exams" }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setExamsViewMode(m.id)}
                        style={{
                          flex: 1,
                          padding: "10px 6px",
                          borderRadius: 12,
                          border: "none",
                          background: examsViewMode === m.id ? COLORS.primary : "transparent",
                          color: examsViewMode === m.id ? COLORS.onPrimary : COLORS.textMuted,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Exam Title Filter Chips */}
                  {allExamTitles.length > 1 && (
                    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12 }}>
                      <button
                        type="button"
                        onClick={() => setSelectedTitleFilter("all")}
                        style={{
                          background: selectedTitleFilter === "all" ? COLORS.primaryBg : COLORS.surface,
                          border: `1px solid ${selectedTitleFilter === "all" ? COLORS.primary : COLORS.border}`,
                          borderRadius: 999,
                          padding: "7px 14px",
                          fontSize: 12,
                          fontWeight: 700,
                          color: selectedTitleFilter === "all" ? COLORS.primaryDark : COLORS.textMuted,
                          whiteSpace: "nowrap",
                          cursor: "pointer"
                        }}
                      >
                        All Exam Titles ({searchFilteredExams.length})
                      </button>
                      {allExamTitles.map((examTitle) => {
                        const isActive = selectedTitleFilter === examTitle;
                        return (
                          <button
                            key={examTitle}
                            type="button"
                            onClick={() => setSelectedTitleFilter(examTitle)}
                            style={{
                              background: isActive ? COLORS.primaryBg : COLORS.surface,
                              border: `1px solid ${isActive ? COLORS.primary : COLORS.border}`,
                              borderRadius: 999,
                              padding: "7px 14px",
                              fontSize: 12,
                              fontWeight: 700,
                              color: isActive ? COLORS.primaryDark : COLORS.textMuted,
                              whiteSpace: "nowrap",
                              cursor: "pointer"
                            }}
                          >
                            {examTitle}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {examsViewMode === "year" && (
                    <div>
                      {allYears.length > 1 && (
                        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12 }}>
                          <button
                            type="button"
                            onClick={() => setSelectedYear("all")}
                            style={{
                              background: selectedYear === "all" ? COLORS.primaryBg : COLORS.surface,
                              border: `1px solid ${selectedYear === "all" ? COLORS.primary : COLORS.border}`,
                              borderRadius: 999,
                              padding: "7px 14px",
                              fontSize: 12,
                              fontWeight: 700,
                              color: selectedYear === "all" ? COLORS.primaryDark : COLORS.textMuted,
                              whiteSpace: "nowrap",
                              cursor: "pointer"
                            }}
                          >
                            All Years ({filteredExams.length})
                          </button>
                          {allYears.map((yr) => {
                            const count = yearGroups.find((g) => g.year === yr)?.exams.length || 0;
                            const isActive = selectedYear === yr;
                            return (
                              <button
                                key={yr}
                                type="button"
                                onClick={() => setSelectedYear(yr)}
                                style={{
                                  background: isActive ? COLORS.primaryBg : COLORS.surface,
                                  border: `1px solid ${isActive ? COLORS.primary : COLORS.border}`,
                                  borderRadius: 999,
                                  padding: "7px 14px",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: isActive ? COLORS.primaryDark : COLORS.textMuted,
                                  whiteSpace: "nowrap",
                                  cursor: "pointer"
                                }}
                              >
                                {yr} E.C. ({count})
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {yearGroups
                        .filter((g) => selectedYear === "all" || g.year === selectedYear)
                        .map((group) => (
                          <div key={group.year} style={{ marginBottom: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                              <span style={{ fontSize: 15, fontWeight: 800, color: COLORS.text }}>
                                📅 {group.year === "Practice" ? "General Practice Exams" : `${group.year} E.C. National Exams`}
                              </span>
                              <span
                                style={{
                                  background: COLORS.surfaceAlt,
                                  color: COLORS.primaryDark,
                                  borderRadius: 999,
                                  padding: "3px 8px",
                                  fontSize: 11,
                                  fontWeight: 800
                                }}
                              >
                                {group.exams.length} {group.exams.length === 1 ? "exam" : "exams"}
                              </span>
                            </div>
                            {group.exams.map((item) => renderExamCard(item, false))}
                          </div>
                        ))}
                    </div>
                  )}

                  {examsViewMode === "title" && (
                    <div>
                      {titleGroups
                        .filter((g) => selectedTitleFilter === "all" || g.title === selectedTitleFilter)
                        .map((group) => (
                          <div key={group.title} style={{ marginBottom: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                              <span style={{ fontSize: 15, fontWeight: 800, color: COLORS.text }}>
                                📄 {group.title}
                              </span>
                              <span
                                style={{
                                  background: COLORS.surfaceAlt,
                                  color: COLORS.primaryDark,
                                  borderRadius: 999,
                                  padding: "3px 8px",
                                  fontSize: 11,
                                  fontWeight: 800
                                }}
                              >
                                {group.exams.length} yrs
                              </span>
                            </div>
                            {group.exams.map((item) => renderExamCard(item, true))}
                          </div>
                        ))}
                    </div>
                  )}

                  {examsViewMode === "all" && (
                    <div>
                      {filteredExams
                        .slice()
                        .sort((a, b) => (Number(getYear(b)) || 0) - (Number(getYear(a)) || 0))
                        .map((item) => renderExamCard(item, true))}
                    </div>
                  )}
                </div>
              ) : tab === "ai" ? (
                /* ── AI Tutor Screen (Gemini 3.8 Flash Tutor) ── */
                <div style={{ display: "flex", flexDirection: "column", minHeight: 620 }}>
                  {/* Tutor Header Card */}
                  <div
                    style={{
                      background: "linear-gradient(135deg, #064E3B 0%, #059669 100%)",
                      borderRadius: 18,
                      padding: "16px",
                      color: "#fff",
                      marginBottom: 12,
                      boxShadow: "0 4px 12px rgba(5, 150, 105, 0.25)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            background: "rgba(255, 255, 255, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 20
                          }}
                        >
                          ✨
                        </div>
                        <div>
                          <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: -0.3 }}>
                            EthioPrep AI Tutor
                          </div>
                          <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.85)", marginTop: 1 }}>
                            Powered by Gemini 3.8 Flash · Grade 9–12 ESSLCE
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAiMessages([
                            {
                              id: "welcome",
                              role: "assistant",
                              text: "👋 Akkam! Hello! I'm your **EthioPrep AI Tutor** powered by Gemini.\n\nI can help you master the Ethiopian Entrance Exam (Grade 9–12 ESSLCE / EUEE / Regional Models). Ask me:\n• To explain difficult concepts or formulas step-by-step\n• Why specific answer choices are correct or incorrect\n• For explanations in **English**, **Afaan Oromoo**, or **Amharic**\n• To review questions from exams or your study notes!",
                              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                              source: "gemini"
                            }
                          ]);
                          setAiContext(null);
                        }}
                        style={{
                          background: "rgba(255, 255, 255, 0.18)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "5px 10px",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        Reset Chat
                      </button>
                    </div>
                  </div>

                  {/* Context Banner */}
                  {aiContext && (
                    <div
                      style={{
                        background: "#EEF2FF",
                        border: "1px solid #C7D2FE",
                        borderRadius: 14,
                        padding: "10px 12px",
                        marginBottom: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 12 }}>📌</span>
                          <span style={{ fontSize: 11, fontWeight: 800, color: "#4338CA" }}>
                            ATTACHED CONTEXT: {aiContext.subjectName || "STUDY MATERIAL"}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#374151",
                            marginTop: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {aiContext.questionPrompt || aiContext.noteTitle || "Custom study item"}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAiContext(null)}
                        style={{
                          background: "#E0E7FF",
                          color: "#4338CA",
                          border: "none",
                          borderRadius: 999,
                          width: 22,
                          height: 22,
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}
                        title="Remove context"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Role / Persona Selector */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 8
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.text }}>
                      Tutor Mode &amp; Model
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAiMessages([
                          {
                            id: "welcome_" + Date.now(),
                            role: "assistant",
                            text: `Chat reset! 🔄 Switched to **${
                              aiRole === "fast_tutor" ? "Fast Answer" : aiRole === "stem_solver" ? "Deep STEM" : aiRole === "multilingual_tutor" ? "Oromoo / አማርኛ" : "ESSLCE Exam Coach"
                            }**. What entrance exam question or concept shall we study?`,
                            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                            source: aiRole === "fast_tutor" ? "gemini-3.1-flash-lite" : aiRole === "stem_solver" ? "gemini-4-argon" : "gemini-3.8-flash"
                          }
                        ]);
                      }}
                      style={{
                        background: COLORS.surfaceMuted,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 999,
                        padding: "3px 8px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: COLORS.textMuted,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 3
                      }}
                    >
                      <span>🔄</span>
                      <span>New Chat</span>
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      overflowX: "auto",
                      paddingBottom: 6,
                      marginBottom: 8
                    }}
                  >
                    {[
                      { id: "exam_coach", label: "🎯 Exam Coach", model: "Gemini 3.8 Flash", desc: "General ESSLCE strategy" },
                      { id: "fast_tutor", label: "⚡ Fast Answer", model: "Gemini 3.1 Flash Lite", desc: "Instant answers < 1s" },
                      { id: "stem_solver", label: "🔬 Deep STEM", model: "Gemini 4 Argon", desc: "Complex math & physics proofs" },
                      { id: "multilingual_tutor", label: "🌍 Oromoo / አማርኛ", model: "Gemini 3.8 Flash", desc: "Multilingual explanations" }
                    ].map((roleItem) => {
                      const isActive = aiRole === roleItem.id;
                      return (
                        <button
                          key={roleItem.id}
                          type="button"
                          onClick={() => setAiRole(roleItem.id)}
                          style={{
                            background: isActive ? COLORS.primaryBg : COLORS.surface,
                            border: `1.5px solid ${isActive ? COLORS.primary : COLORS.border}`,
                            color: isActive ? COLORS.primaryDark : COLORS.textSecondary,
                            borderRadius: 999,
                            padding: "5px 11px",
                            fontSize: 11.5,
                            fontWeight: 800,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            flexShrink: 0
                          }}
                        >
                          {roleItem.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Suggestion Chips */}
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      overflowX: "auto",
                      paddingBottom: 8,
                      marginBottom: 8
                    }}
                  >
                    {(aiContext?.questionPrompt
                      ? [
                          { label: "💡 Step-by-step breakdown", prompt: "Can you explain the correct answer to this step-by-step?" },
                          { label: "❌ Why other options are wrong", prompt: "Why are the other multiple-choice options incorrect or distractors?" },
                          { label: "🌍 Afaan Oromoo", prompt: "Maaloo ibsa kana Afaan Oromootiin naaf qoodi (Please explain in Afaan Oromoo)." },
                          { label: "🇪🇹 በአማርኛ", prompt: "እባክዎን ይህንን በአማርኛ በዝርዝር ያስረዱኝ (Please explain in Amharic)." },
                          { label: "🎯 ESSLCE Exam Tip", prompt: "What is the key trick or memory tip to solve this kind of Ethiopian entrance exam question?" }
                        ]
                      : aiRole === "fast_tutor"
                      ? [
                          { label: "⚡ Hooke's Law in 1 sentence", prompt: "State Hooke's law in one short sentence." },
                          { label: "⚡ Newton's 2nd Law", prompt: "What is Newton's second law with formula in 1 sentence?" },
                          { label: "⚡ Quadratic Formula", prompt: "State the quadratic formula." },
                          { label: "⚡ Mitosis vs Meiosis", prompt: "Define mitosis vs meiosis in 2 bullet points." }
                        ]
                      : aiRole === "stem_solver"
                      ? [
                          { label: "🔬 Projectile Motion Proof", prompt: "Derive the maximum height formula for projectile motion step-by-step." },
                          { label: "🔬 Balance Redox Reaction", prompt: "Explain how to balance a redox equation in acidic solution step-by-step." },
                          { label: "🔬 Integration by Parts", prompt: "Solve ∫ x*e^x dx step-by-step with explanation." },
                          { label: "🔬 Coulomb's Law", prompt: "Calculate electric force between two charges with step-by-step formula explanation." }
                        ]
                      : aiRole === "multilingual_tutor"
                      ? [
                          { label: "🌍 Seera Niiwutan (Oromoo)", prompt: "Seera Niiwutan isa lammaffaa Afaan Oromootiin ibsi." },
                          { label: "🇪🇹 ፎቶሲንተሲስ (Amharic)", prompt: "ስለ ፎቶሲንተሲስ (Photosynthesis) በአማርኛ አስረዳኝ።" },
                          { label: "🌍 Caasaa Seelii (Oromoo)", prompt: "Hiika seelii (cell) fi caasaa isaa naaf qoodi." },
                          { label: "🇪🇹 የኬሚስትሪ ቀመሮች", prompt: "የኬሚስትሪ ቀመሮችን እንዴት ማስታወስ እችላለሁ?" }
                        ]
                      : [
                          { label: "🎯 How to score 90+ ESSLCE", prompt: "What are the most effective study tips to score 90+ on Ethiopian Entrance Exams?" },
                          { label: "🎯 Distractor Elimination", prompt: "How do I eliminate tricky distractor options in entrance exam questions?" },
                          { label: "🎯 Top Physics Topics", prompt: "What are the most heavily tested Physics units on ESSLCE from Grades 9-12?" },
                          { label: "🎯 English Grammar Rules", prompt: "Review the top tense and conditional rules tested on national English exams." }
                        ]
                    ).map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendAiMessage(chip.prompt)}
                        style={{
                          background: COLORS.surface,
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: 999,
                          padding: "5px 11px",
                          fontSize: 11,
                          fontWeight: 700,
                          color: COLORS.textSecondary,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          flexShrink: 0
                        }}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  {/* Messages Thread */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      marginBottom: 14,
                      maxHeight: 460,
                      overflowY: "auto",
                      paddingRight: 4
                    }}
                  >
                    {aiMessages.map((msg) => {
                      const isUser = msg.role === "user";
                      return (
                        <div
                          key={msg.id}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: isUser ? "flex-end" : "flex-start",
                            width: "100%"
                          }}
                        >
                          <div
                            style={{
                              maxWidth: "88%",
                              padding: "12px 14px",
                              borderRadius: 16,
                              borderTopRightRadius: isUser ? 4 : 16,
                              borderTopLeftRadius: !isUser ? 4 : 16,
                              background: isUser ? COLORS.primary : COLORS.surface,
                              color: isUser ? COLORS.onPrimary : COLORS.text,
                              border: isUser ? "none" : `1px solid ${COLORS.border}`,
                              boxShadow: isUser
                                ? "0 2px 6px rgba(0, 200, 150, 0.25)"
                                : "0 2px 6px rgba(15, 23, 42, 0.04)"
                            }}
                          >
                            {!isUser && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 5,
                                  marginBottom: 6,
                                  paddingBottom: 4,
                                  borderBottom: `1px solid ${COLORS.borderLight}`
                                }}
                              >
                                <span style={{ fontSize: 13 }}>✨</span>
                                <span style={{ fontSize: 11, fontWeight: 800, color: COLORS.primaryDark }}>
                                  EthioPrep AI Tutor
                                </span>
                                <span
                                  style={{
                                    fontSize: 9.5,
                                    fontWeight: 700,
                                    background: COLORS.primaryBg,
                                    color: COLORS.primaryDark,
                                    padding: "2px 6px",
                                    borderRadius: 6,
                                    marginLeft: "auto"
                                  }}
                                >
                                  ⚡ {msg.source || "Gemini 3.8 Flash"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (navigator.clipboard) {
                                      navigator.clipboard.writeText(msg.text).catch(() => {});
                                    }
                                    setCopiedAiId(msg.id);
                                    setTimeout(() => setCopiedAiId(null), 1800);
                                  }}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "0 2px",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: copiedAiId === msg.id ? COLORS.primaryDark : COLORS.textMuted
                                  }}
                                  title="Copy text"
                                >
                                  {copiedAiId === msg.id ? "✓ Copied" : "📋 Copy"}
                                </button>
                              </div>
                            )}

                            <div
                              style={{
                                fontSize: 13.5,
                                lineHeight: 1.55,
                                whiteSpace: "pre-wrap"
                              }}
                            >
                              {msg.text}
                            </div>

                            <div
                              style={{
                                fontSize: 10,
                                marginTop: 6,
                                textAlign: "right",
                                opacity: 0.75,
                                color: isUser ? COLORS.onPrimary : COLORS.textMuted
                              }}
                            >
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {aiLoading && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          background: COLORS.surface,
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: 16,
                          borderTopLeftRadius: 4,
                          padding: "10px 14px",
                          width: "fit-content",
                          boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)"
                        }}
                      >
                        <span style={{ fontSize: 14 }}>✨</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted }}>
                          EthioPrep AI ({aiRole === "fast_tutor" ? "Flash Lite" : aiRole === "stem_solver" ? "Argon / STEM" : "Flash"}) is thinking...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Input Box */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 8,
                      background: COLORS.surface,
                      border: `1.5px solid ${COLORS.border}`,
                      borderRadius: 18,
                      padding: "8px 12px",
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)"
                    }}
                  >
                    <textarea
                      rows={2}
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendAiMessage();
                        }
                      }}
                      placeholder="Ask AI Tutor anything (English, Afaan Oromoo, አማርኛ)..."
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        resize: "none",
                        fontSize: 13,
                        lineHeight: 1.4,
                        color: COLORS.text,
                        fontFamily: "inherit",
                        background: "transparent"
                      }}
                    />
                    <button
                      type="button"
                      disabled={aiLoading || !aiInput.trim()}
                      onClick={() => handleSendAiMessage()}
                      style={{
                        background: aiInput.trim() && !aiLoading ? COLORS.primary : COLORS.surfaceMuted,
                        color: aiInput.trim() && !aiLoading ? COLORS.onPrimary : COLORS.textMuted,
                        border: "none",
                        borderRadius: 12,
                        width: 38,
                        height: 38,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: aiInput.trim() && !aiLoading ? "pointer" : "default",
                        flexShrink: 0
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : tab === "notes" ? (
                /* ── NotesScreen.js (Study Notes organized by Grade 9-12 & Subject) ── */
                <div>
                  {selectedNoteSubject ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedNoteSubject(null);
                          setShowPersonalForm(false);
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          marginBottom: 12,
                          padding: "3px 0",
                          background: "none",
                          border: "none",
                          color: COLORS.primaryDark,
                          fontSize: 13,
                          fontWeight: 800,
                          cursor: "pointer"
                        }}
                      >
                        ← Back to Grade {selectedNoteGrade} Subjects
                      </button>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div style={{ flex: 1, marginRight: 8 }}>
                          <div style={{ fontSize: 25, fontWeight: 800, color: COLORS.text, letterSpacing: -0.6 }}>
                            {selectedNoteSubject.name}
                          </div>
                          <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>
                            {formatGradeBadge(selectedNoteSubject.gradeLevel || `grade-${selectedNoteGrade}`)} ·{" "}
                            {selectedNoteSubject.stream === "social" ? "Social Science" : "Natural Science"}
                          </div>
                        </div>
                        <span
                          style={{
                            background: COLORS.primaryBg,
                            color: COLORS.primaryDark,
                            borderRadius: 999,
                            padding: "7px 13px",
                            fontSize: 12,
                            fontWeight: 800
                          }}
                        >
                          {officialNotes.length} {officialNotes.length === 1 ? "Note" : "Notes"}
                        </span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.text }}>Curriculum Study Notes</div>
                          <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                            Organized by chapters · Read offline inside the app
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowPersonalForm(!showPersonalForm)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 10,
                            border: `1px solid ${COLORS.primary}`,
                            background: showPersonalForm ? "transparent" : COLORS.primary,
                            color: showPersonalForm ? COLORS.primaryDark : COLORS.onPrimary,
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: "pointer"
                          }}
                        >
                          {showPersonalForm ? "Cancel" : "+ Note"}
                        </button>
                      </div>

                      {showPersonalForm && (
                        <div
                          style={{
                            background: COLORS.surface,
                            border: `1px solid ${COLORS.primaryLight}`,
                            borderRadius: 16,
                            padding: 12,
                            marginBottom: 12
                          }}
                        >
                          <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.text, marginBottom: 8 }}>
                            Add Personal Study Note
                          </div>
                          {personalError && (
                            <div style={{ fontSize: 12, color: COLORS.danger, marginBottom: 6 }}>{personalError}</div>
                          )}
                          <div style={{ marginBottom: 8 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                              Note Title
                            </label>
                            <input
                              value={personalTitle}
                              onChange={(e) => setPersonalTitle(e.target.value)}
                              placeholder="e.g. Unit 1 Key Formulas to remember"
                              style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 13 }}
                            />
                          </div>
                          <div style={{ marginBottom: 10 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                              Note Content
                            </label>
                            <textarea
                              rows={4}
                              value={personalBody}
                              onChange={(e) => setPersonalBody(e.target.value)}
                              placeholder="Write your personal formulas, insights, or reminders..."
                              style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 13 }}
                            />
                          </div>
                          <button
                            type="button"
                            disabled={savingNote}
                            onClick={handleCreatePersonalNote}
                            style={{
                              width: "100%",
                              padding: 10,
                              borderRadius: 10,
                              border: "none",
                              background: COLORS.primary,
                              color: COLORS.onPrimary,
                              fontWeight: 800,
                              fontSize: 13,
                              cursor: "pointer"
                            }}
                          >
                            {savingNote ? "Saving..." : "Save to My Notes"}
                          </button>
                        </div>
                      )}

                      {officialNotes.length === 0 && personalNotes.length === 0 ? (
                        <div
                          style={{
                            background: COLORS.surface,
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 16,
                            padding: 20,
                            textAlign: "center",
                            color: COLORS.textMuted,
                            fontSize: 13
                          }}
                        >
                          Official study notes for {selectedNoteSubject.name} are being prepared.
                        </div>
                      ) : (
                        <>
                          {officialNotes.map((note) => (
                            <div
                              key={note._id}
                              onClick={() => setSelectedNote(note)}
                              style={{
                                background: COLORS.surface,
                                border: `1px solid ${COLORS.border}`,
                                borderRadius: 16,
                                padding: 12,
                                marginBottom: 8,
                                cursor: "pointer"
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                <span style={{ background: COLORS.primaryBg, color: COLORS.primaryDark, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>
                                  {note.chapterId?.title ? note.chapterId.title.split(":")[0] : "NOTE"}
                                </span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {note.chapterId?.title || selectedNoteSubject.name}
                                </span>
                              </div>
                              <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text, marginBottom: 6 }}>
                                {note.title}
                              </div>
                              {note.body && (
                                <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.4, marginBottom: 8 }}>
                                  {String(note.body).slice(0, 140)}...
                                </div>
                              )}
                              <span style={{ display: "inline-block", background: COLORS.primaryBg, color: COLORS.primaryDark, borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 800 }}>
                                🛡️ Protected Offline Content · Tap to Read
                              </span>
                            </div>
                          ))}

                          {personalNotes.map((pNote) => (
                            <div
                              key={pNote._id}
                              onClick={() => setSelectedNote(pNote)}
                              style={{
                                background: COLORS.surface,
                                border: `1px solid ${COLORS.border}`,
                                borderLeft: `4px solid ${COLORS.success}`,
                                borderRadius: 16,
                                padding: 12,
                                marginBottom: 8,
                                cursor: "pointer"
                              }}
                            >
                              <span style={{ background: "#D1FAE5", color: "#065F46", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 800 }}>
                                MY NOTE
                              </span>
                              <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text, marginTop: 6 }}>
                                {pNote.title}
                              </div>
                              <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>
                                {pNote.body}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 25, fontWeight: 800, color: COLORS.text, letterSpacing: -0.5 }}>
                          Study Notes
                        </div>
                        <div style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.4, marginTop: 5 }}>
                          Select your grade, then pick a subject to read curriculum study notes.
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12 }}>
                        {GRADES.map((grade) => {
                          const active = selectedNoteGrade === grade;
                          return (
                            <button
                              key={grade}
                              type="button"
                              onClick={() => setSelectedNoteGrade(grade)}
                              style={{
                                background: active ? COLORS.primary : COLORS.surface,
                                border: `1px solid ${active ? COLORS.primary : COLORS.border}`,
                                borderRadius: 999,
                                padding: "11px 19px",
                                color: active ? COLORS.onPrimary : COLORS.textMuted,
                                fontSize: 14,
                                fontWeight: 800,
                                cursor: "pointer",
                                whiteSpace: "nowrap"
                              }}
                            >
                              Grade {grade}
                            </button>
                          );
                        })}
                      </div>

                      <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.text, marginBottom: 8 }}>
                        Grade {selectedNoteGrade} Study Notes
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                        {noteGradeSubjects.map((subject) => {
                          const count = getNotesForGradeSubject(notes, subject, selectedNoteGrade, subjects).length;
                          return (
                            <div
                              key={subject._id || subject.code}
                              onClick={() => setSelectedNoteSubject(subject)}
                              style={{
                                width: "calc(50% - 6px)",
                                minHeight: 202,
                                background: COLORS.surface,
                                border: `1px solid ${COLORS.border}`,
                                borderRadius: 22,
                                padding: 12,
                                display: "flex",
                                flexDirection: "column",
                                cursor: "pointer",
                                boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)"
                              }}
                            >
                              <div
                                style={{
                                  width: 58,
                                  height: 58,
                                  borderRadius: 17,
                                  background: COLORS.primary,
                                  color: COLORS.onPrimary,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 26
                                }}
                              >
                                <SubjectGlyph code={subject.code} />
                              </div>
                              <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.text, marginTop: 12, minHeight: 42 }}>
                                {subject.name}
                              </div>
                              <span
                                style={{
                                  alignSelf: "flex-start",
                                  background: COLORS.primaryBg,
                                  color: COLORS.primaryDark,
                                  borderRadius: 999,
                                  marginTop: 8,
                                  padding: "5px 10px",
                                  fontSize: 11,
                                  fontWeight: 800
                                }}
                              >
                                Grade {selectedNoteGrade} · {count} {count === 1 ? "Note" : "Notes"}
                              </span>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  borderTop: `1px solid ${COLORS.border}`,
                                  marginTop: "auto",
                                  paddingTop: 8
                                }}
                              >
                                <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted }}>
                                  Study Notes
                                </span>
                                <span style={{ color: COLORS.primary, fontWeight: 900 }}>→</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedNote && (
                    <div
                      style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(15, 23, 42, 0.75)",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 16
                      }}
                    >
                      <div
                        style={{
                          background: COLORS.background,
                          maxWidth: 430,
                          width: "100%",
                          maxHeight: "85vh",
                          borderRadius: 20,
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column"
                        }}
                      >
                        <div
                          style={{
                            background: COLORS.surface,
                            borderBottom: `1px solid ${COLORS.border}`,
                            padding: "10px 14px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedNote(null)}
                            style={{ background: "none", border: "none", color: COLORS.primary, fontSize: 15, fontWeight: 800, cursor: "pointer" }}
                          >
                            ← Close
                          </button>
                          <span style={{ background: COLORS.primary, color: COLORS.onPrimary, borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 800 }}>
                            🔒 Protected Offline Reader
                          </span>
                        </div>
                        <div style={{ padding: 16, overflowY: "auto" }}>
                          <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.text, marginBottom: 12 }}>
                            {selectedNote.title}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              background: "#EEF2FF",
                              border: "1px solid #C7D2FE",
                              borderRadius: 14,
                              padding: "10px 14px",
                              marginBottom: 14,
                              gap: 10
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 800, color: "#3730A3" }}>
                                ✨ Ask AI Tutor about this Note
                              </div>
                              <div style={{ fontSize: 11, color: "#4B5563", marginTop: 2 }}>
                                Ask for explanations, summaries, or sample questions
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAskAiFromNote(selectedNote)}
                              style={{
                                background: COLORS.primary,
                                color: COLORS.onPrimary,
                                border: "none",
                                borderRadius: 999,
                                padding: "6px 12px",
                                fontSize: 12,
                                fontWeight: 800,
                                cursor: "pointer",
                                whiteSpace: "nowrap"
                              }}
                            >
                              Ask AI ✨
                            </button>
                          </div>
                          <div
                            style={{
                              background: COLORS.surface,
                              border: `1px solid ${COLORS.border}`,
                              borderRadius: 16,
                              padding: 14,
                              fontSize: 14,
                              lineHeight: 1.6,
                              color: COLORS.text,
                              whiteSpace: "pre-wrap"
                            }}
                          >
                            {selectedNote.body}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : tab === "practice" ? (
                /* ── Practice Mode Component (Distraction-Free Environment, Timer, Quick Skipping) ── */
                <PracticeModeSimulator
                  subjects={subjects}
                  exams={exams}
                  COLORS={COLORS}
                  onAskAiFromQuestion={handleAskAiFromQuestion}
                  setZoomedUri={setZoomedUri}
                />
              ) : tab === "payments" ? (
                /* ── PaymentScreen.js (200 ETB, 6 Methods, Step 1 & Step 2) ── */
                <div>
                  {/* Plan Header Card */}
                  <div
                    style={{
                      background: COLORS.primary,
                      border: `1px solid ${COLORS.primaryDark}`,
                      borderRadius: 16,
                      padding: 16,
                      marginBottom: 16,
                      color: COLORS.onPrimary
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 17, fontWeight: 900 }}>Student Premium Access</span>
                      <span
                        style={{
                          background: COLORS.gold,
                          color: COLORS.onPrimary,
                          padding: "4px 12px",
                          borderRadius: 999,
                          fontSize: 15,
                          fontWeight: 900
                        }}
                      >
                        200 ETB
                      </span>
                    </div>
                    <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 12 }}>
                      Complete preparation for Ethiopian University Entrance Exam (EUEE).
                    </div>
                    <div
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.2)",
                        paddingTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        fontSize: 12,
                        fontWeight: 600
                      }}
                    >
                      <div>✓ All Natural &amp; Social Science Subjects</div>
                      <div>✓ Timed National Mock Exams &amp; Solutions</div>
                      <div>✓ Mistake Review, Progress Tracking &amp; Leaderboard</div>
                    </div>
                  </div>

                  {/* STEP 1 */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span
                        style={{
                          background: COLORS.gold,
                          color: COLORS.onPrimary,
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 900
                        }}
                      >
                        STEP 1
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.text }}>
                        Pay 200 ETB via Any Supported Method
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 12 }}>
                      Select your preferred payment method below to view the official account details:
                    </div>

                    {/* Provider Grid */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                      {PAYMENT_METHODS.map((method) => {
                        const isSelected = selectedProvider === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setSelectedProvider(method.id)}
                            style={{
                              background: isSelected ? method.themeBg : COLORS.surface,
                              border: `2px solid ${isSelected ? method.themeColor : COLORS.border}`,
                              borderRadius: 12,
                              padding: "8px 12px",
                              minWidth: 95,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 6
                            }}
                          >
                            <span
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                background: isSelected ? method.themeColor : COLORS.surfaceMuted,
                                color: isSelected ? "#fff" : COLORS.textMuted,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                fontWeight: 900
                              }}
                            >
                              {method.shortName[0]}
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: isSelected ? 900 : 800,
                                color: isSelected ? method.themeColor : COLORS.textMuted
                              }}
                            >
                              {method.shortName}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Account Detail Card */}
                    <div
                      style={{
                        background: COLORS.surface,
                        border: `1.5px solid ${COLORS.border}`,
                        borderTop: `3px solid ${activeMethod.themeColor}`,
                        borderRadius: 16,
                        padding: 14
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 12,
                          paddingBottom: 6,
                          borderBottom: `1px solid ${COLORS.border}`
                        }}
                      >
                        <span style={{ fontSize: 15, fontWeight: 900, color: activeMethod.themeColor }}>
                          {activeMethod.name}
                        </span>
                        <span
                          style={{
                            background: activeMethod.themeBg,
                            border: `1px solid ${activeMethod.themeColor}`,
                            color: activeMethod.themeColor,
                            padding: "2px 8px",
                            borderRadius: 999,
                            fontSize: 10,
                            fontWeight: 800
                          }}
                        >
                          {activeMethod.category}
                        </span>
                      </div>

                      {/* Account Number */}
                      <div
                        onClick={() => handleCopy(activeMethod.accountNumber, "accountNumber")}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                          padding: 8,
                          background: COLORS.surfaceMuted,
                          borderRadius: 8,
                          border: `1px dashed ${COLORS.border}`,
                          cursor: "pointer"
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted }}>
                            Account Number / Phone:
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 900, color: COLORS.primary }}>
                            {activeMethod.accountNumber}
                          </div>
                        </div>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: copiedField === "accountNumber" ? COLORS.successBg : COLORS.surface,
                            border: `1px solid ${copiedField === "accountNumber" ? COLORS.success : COLORS.border}`,
                            color: copiedField === "accountNumber" ? COLORS.success : activeMethod.themeColor,
                            fontSize: 11,
                            fontWeight: 800
                          }}
                        >
                          {copiedField === "accountNumber" ? "Copied!" : "Copy"}
                        </span>
                      </div>

                      {/* Account Name */}
                      <div
                        onClick={() => handleCopy(activeMethod.accountName, "accountName")}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                          padding: 8,
                          background: COLORS.surfaceMuted,
                          borderRadius: 8,
                          border: `1px dashed ${COLORS.border}`,
                          cursor: "pointer"
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted }}>Account Name:</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>
                            {activeMethod.accountName}
                          </div>
                        </div>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: copiedField === "accountName" ? COLORS.successBg : COLORS.surface,
                            border: `1px solid ${copiedField === "accountName" ? COLORS.success : COLORS.border}`,
                            color: copiedField === "accountName" ? COLORS.success : activeMethod.themeColor,
                            fontSize: 11,
                            fontWeight: 800
                          }}
                        >
                          {copiedField === "accountName" ? "Copied!" : "Copy"}
                        </span>
                      </div>

                      {/* Amount to Pay */}
                      <div
                        onClick={() => handleCopy("200", "amount")}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 8,
                          background: COLORS.surfaceMuted,
                          borderRadius: 8,
                          border: `1px dashed ${COLORS.border}`,
                          cursor: "pointer"
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted }}>Amount to Pay:</div>
                          <div style={{ fontSize: 16, fontWeight: 900, color: COLORS.gold }}>200 ETB</div>
                        </div>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: copiedField === "amount" ? COLORS.successBg : COLORS.surface,
                            border: `1px solid ${copiedField === "amount" ? COLORS.success : COLORS.border}`,
                            color: copiedField === "amount" ? COLORS.success : activeMethod.themeColor,
                            fontSize: 11,
                            fontWeight: 800
                          }}
                        >
                          {copiedField === "amount" ? "Copied!" : "Copy"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span
                        style={{
                          background: COLORS.gold,
                          color: COLORS.onPrimary,
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 900
                        }}
                      >
                        STEP 2
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.text }}>
                        Submit Payment Evidence
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 12 }}>
                      Verify your payment using <strong style={{ color: "#2563eb" }}>Method A</strong> (Transaction Info) OR{" "}
                      <strong style={{ color: "#d97706" }}>Method B</strong> (Receipt Screenshot):
                    </div>

                    {payError && (
                      <div
                        style={{
                          background: COLORS.dangerBg,
                          color: COLORS.danger,
                          border: `1px solid ${COLORS.danger}`,
                          borderRadius: 12,
                          padding: 10,
                          fontSize: 12,
                          marginBottom: 10,
                          whiteSpace: "pre-line"
                        }}
                      >
                        {payError}
                      </div>
                    )}
                    {paySuccess && (
                      <div
                        style={{
                          background: COLORS.successBg,
                          color: COLORS.success,
                          border: `1px solid ${COLORS.success}`,
                          borderRadius: 12,
                          padding: 10,
                          fontSize: 12,
                          marginBottom: 10,
                          fontWeight: 700
                        }}
                      >
                        {paySuccess}
                      </div>
                    )}

                    {/* Method Switcher */}
                    <div
                      style={{
                        display: "flex",
                        background: COLORS.surface,
                        borderRadius: 12,
                        padding: 4,
                        marginBottom: 12,
                        border: `1.5px solid ${COLORS.border}`,
                        gap: 4
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setVerificationMode("details")}
                        style={{
                          flex: 1,
                          padding: "8px 4px",
                          borderRadius: 8,
                          border: "none",
                          background: verificationMode === "details" ? "#2563eb" : "transparent",
                          color: verificationMode === "details" ? "#ffffff" : "#2563eb",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 900 }}>Method A</div>
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: verificationMode === "details" ? "rgba(255,255,255,0.85)" : COLORS.textMuted
                          }}
                        >
                          Transaction Info
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setVerificationMode("screenshot")}
                        style={{
                          flex: 1,
                          padding: "8px 4px",
                          borderRadius: 8,
                          border: "none",
                          background: verificationMode === "screenshot" ? "#d97706" : "transparent",
                          color: verificationMode === "screenshot" ? "#ffffff" : "#d97706",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 900 }}>Method B</div>
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: verificationMode === "screenshot" ? "rgba(255,255,255,0.85)" : COLORS.textMuted
                          }}
                        >
                          Receipt Screenshot
                        </div>
                      </button>
                    </div>

                    <div
                      style={{
                        background: COLORS.surface,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 16,
                        padding: 14
                      }}
                    >
                      {verificationMode === "details" ? (
                        <>
                          <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 12 }}>
                            Enter the details from your payment confirmation SMS / receipt:
                          </div>
                          <div style={{ marginBottom: 10 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                              Full Name *
                            </label>
                            <input
                              value={payFullName}
                              onChange={(e) => setPayFullName(e.target.value)}
                              placeholder="e.g. Abebe Kebede"
                              style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 14 }}
                            />
                          </div>
                          <div style={{ marginBottom: 10 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                              Transaction Number *
                            </label>
                            <input
                              value={transactionNumber}
                              onChange={(e) => setTransactionNumber(e.target.value)}
                              placeholder="e.g. FT23458796 or Telebirr Txn ID"
                              style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 14 }}
                            />
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                              Amount Paid *
                            </label>
                            <input
                              type="number"
                              value={amountPaid}
                              onChange={(e) => setAmountPaid(e.target.value)}
                              placeholder="200 ETB"
                              style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 14 }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 12 }}>
                            Select receipt screenshot from your device gallery or take a clear photo:
                          </div>
                          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                            <label
                              style={{
                                flex: 1,
                                background: COLORS.infoBg,
                                border: `1.5px dashed ${COLORS.info}`,
                                borderRadius: 12,
                                padding: "16px 8px",
                                textAlign: "center",
                                cursor: "pointer"
                              }}
                            >
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) setReceiptScreenshot(file.name);
                                }}
                              />
                              <div style={{ fontSize: 22 }}>🖼️</div>
                              <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.text }}>Browse from Device</div>
                              <div style={{ fontSize: 10, color: COLORS.textMuted }}>Select from Photos / Gallery</div>
                            </label>
                            <label
                              style={{
                                flex: 1,
                                background: COLORS.purpleBg,
                                border: `1.5px dashed ${COLORS.purple}`,
                                borderRadius: 12,
                                padding: "16px 8px",
                                textAlign: "center",
                                cursor: "pointer"
                              }}
                            >
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) setReceiptScreenshot(file.name);
                                }}
                              />
                              <div style={{ fontSize: 22 }}>📷</div>
                              <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.text }}>Take Photo</div>
                              <div style={{ fontSize: 10, color: COLORS.textMuted }}>Capture paper receipt</div>
                            </label>
                          </div>
                          {receiptScreenshot && (
                            <div style={{ fontSize: 12, color: COLORS.success, fontWeight: 700, marginBottom: 8 }}>
                              ✓ Screenshot Selected: {receiptScreenshot}
                            </div>
                          )}
                          <div style={{ marginBottom: 10 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                              Full Name *
                            </label>
                            <input
                              value={payFullName}
                              onChange={(e) => setPayFullName(e.target.value)}
                              placeholder="e.g. Abebe Kebede"
                              style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 14 }}
                            />
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                              Transaction ID / Note (Optional)
                            </label>
                            <input
                              value={transactionNumber}
                              onChange={(e) => setTransactionNumber(e.target.value)}
                              placeholder="e.g. FT23458796 or reference note"
                              style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 14 }}
                            />
                          </div>
                        </>
                      )}

                      <button
                        type="button"
                        disabled={submittingPayment}
                        onClick={handleSubmitPayment}
                        style={{
                          width: "100%",
                          padding: "13px 16px",
                          borderRadius: 12,
                          border: "none",
                          background: COLORS.primary,
                          color: COLORS.onPrimary,
                          fontSize: 14,
                          fontWeight: 800,
                          cursor: "pointer"
                        }}
                      >
                        {submittingPayment ? "Submitting..." : "Submit Payment Verification"}
                      </button>
                    </div>
                  </div>

                  {/* Payment Submissions History */}
                  <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text, marginBottom: 8 }}>
                    Your Payment Submissions
                  </div>
                  {payments.length === 0 ? (
                    <div
                      style={{
                        background: COLORS.surface,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 16,
                        padding: 20,
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.text }}>
                        No payments submitted yet
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
                        After completing Step 1 and Step 2 above, your status will appear here.
                      </div>
                    </div>
                  ) : (
                    payments.map((p, idx) => {
                      const isVerified = p.status === "verified";
                      const isRejected = p.status === "rejected";
                      return (
                        <div
                          key={p._id || idx}
                          style={{
                            background: COLORS.surface,
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 16,
                            padding: 14,
                            marginBottom: 10
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <div>
                              <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text }}>
                                {p.amount || 200} ETB
                              </div>
                              <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                                Method: {(p.provider || "telebirr").toUpperCase()}
                              </div>
                            </div>
                            <span
                              style={{
                                padding: "3px 10px",
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 900,
                                background: isVerified
                                  ? COLORS.successBg
                                  : isRejected
                                  ? COLORS.dangerBg
                                  : COLORS.warningBg,
                                color: isVerified ? COLORS.success : isRejected ? COLORS.danger : COLORS.warning
                              }}
                            >
                              {isVerified ? "APPROVED" : isRejected ? "REJECTED" : "PENDING"}
                            </span>
                          </div>
                          {p.transactionReference && (
                            <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                              Txn Ref: {p.transactionReference}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                /* ── ProfileScreen.js (My Profile + Change Password) ── */
                <div>
                  <div
                    style={{
                      background: COLORS.surface,
                      borderRadius: 16,
                      padding: 20,
                      marginBottom: 16,
                      border: `1px solid ${COLORS.border}`,
                      boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)"
                    }}
                  >
                    <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.primary, marginBottom: 16 }}>
                      My Profile
                    </div>

                    {profileError && (
                      <div
                        style={{
                          background: COLORS.dangerBg,
                          color: COLORS.danger,
                          border: `1px solid ${COLORS.danger}`,
                          borderRadius: 10,
                          padding: 10,
                          fontSize: 12,
                          marginBottom: 12
                        }}
                      >
                        {profileError}
                      </div>
                    )}
                    {profileSuccess && (
                      <div
                        style={{
                          background: COLORS.successBg,
                          color: COLORS.success,
                          border: `1px solid ${COLORS.success}`,
                          borderRadius: 10,
                          padding: 10,
                          fontSize: 12,
                          marginBottom: 12,
                          fontWeight: 700
                        }}
                      >
                        {profileSuccess}
                      </div>
                    )}

                    {isEditingProfile ? (
                      <>
                        <div style={{ marginBottom: 12 }}>
                          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                            Full Name
                          </label>
                          <input
                            value={profileDisplayName}
                            onChange={(e) => setProfileDisplayName(e.target.value)}
                            placeholder="Your full name"
                            style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 14 }}
                          />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                            Email
                          </label>
                          <input
                            value={profileEmail}
                            onChange={(e) => setProfileEmail(e.target.value)}
                            placeholder="your@email.com"
                            style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 14 }}
                          />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                            Phone Number
                          </label>
                          <input
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            placeholder="0911000000"
                            style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 14 }}
                          />
                        </div>

                        <div style={{ marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${COLORS.border}` }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                            Telegram Link (Communication)
                          </div>
                          <div style={{ fontSize: 16, color: COLORS.text, fontWeight: 500 }}>
                            {currentUser?.profile?.telegramLink || "Not set"}
                          </div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted, fontStyle: "italic", marginTop: 2 }}>
                            Managed by admin
                          </div>
                        </div>

                        <div style={{ marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${COLORS.border}` }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                            Q&amp;A (Questions &amp; Answers)
                          </div>
                          <div style={{ fontSize: 16, color: COLORS.text, fontWeight: 500 }}>
                            {currentUser?.profile?.qa || "Not set"}
                          </div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted, fontStyle: "italic", marginTop: 2 }}>
                            Managed by admin
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "8px 0" }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>
                            Enable Notifications
                          </span>
                          <input
                            type="checkbox"
                            checked={profileNotifications}
                            onChange={(e) => setProfileNotifications(e.target.checked)}
                            style={{ width: 18, height: 18, accentColor: COLORS.primary }}
                          />
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            type="button"
                            onClick={handleSaveProfile}
                            style={{
                              flex: 1,
                              padding: 12,
                              borderRadius: 12,
                              border: "none",
                              background: COLORS.primary,
                              color: COLORS.onPrimary,
                              fontWeight: 800,
                              fontSize: 14,
                              cursor: "pointer"
                            }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingProfile(false);
                              setProfileError("");
                            }}
                            style={{
                              flex: 1,
                              padding: 12,
                              borderRadius: 12,
                              border: `1.5px solid ${COLORS.primary}`,
                              background: "transparent",
                              color: COLORS.primaryDark,
                              fontWeight: 800,
                              fontSize: 14,
                              cursor: "pointer"
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${COLORS.border}` }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                            Full Name
                          </div>
                          <div style={{ fontSize: 16, color: COLORS.text, fontWeight: 500 }}>
                            {currentUser?.displayName || "N/A"}
                          </div>
                        </div>
                        <div style={{ marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${COLORS.border}` }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                            Email
                          </div>
                          <div style={{ fontSize: 16, color: COLORS.text, fontWeight: 500 }}>
                            {currentUser?.email || "N/A"}
                          </div>
                        </div>
                        <div style={{ marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${COLORS.border}` }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                            Phone
                          </div>
                          <div style={{ fontSize: 16, color: COLORS.text, fontWeight: 500 }}>
                            {currentUser?.phoneNumber || "Not set"}
                          </div>
                        </div>
                        <div style={{ marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${COLORS.border}` }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                            Telegram Link (Communication)
                          </div>
                          <div style={{ fontSize: 16, color: COLORS.text, fontWeight: 500 }}>
                            {currentUser?.profile?.telegramLink || "Not set"}
                          </div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted, fontStyle: "italic", marginTop: 2 }}>
                            Managed by admin
                          </div>
                        </div>
                        <div style={{ marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${COLORS.border}` }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                            Q&amp;A (Questions &amp; Answers)
                          </div>
                          <div style={{ fontSize: 16, color: COLORS.text, fontWeight: 500 }}>
                            {currentUser?.profile?.qa || "Not set"}
                          </div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted, fontStyle: "italic", marginTop: 2 }}>
                            Managed by admin
                          </div>
                        </div>
                        <div style={{ marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${COLORS.border}` }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                            Notifications
                          </div>
                          <div style={{ fontSize: 16, color: COLORS.text, fontWeight: 500 }}>
                            {currentUser?.notifications !== false ? "Enabled" : "Disabled"}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(true)}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            borderRadius: 12,
                            border: "none",
                            background: COLORS.primary,
                            color: COLORS.onPrimary,
                            fontSize: 14,
                            fontWeight: 800,
                            cursor: "pointer",
                            marginTop: 8
                          }}
                        >
                          Edit Profile
                        </button>
                      </>
                    )}
                  </div>

                  {!isEditingProfile && (
                    <div
                      style={{
                        background: COLORS.surface,
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 16,
                        border: `1px solid ${COLORS.border}`,
                        boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)"
                      }}
                    >
                      <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.primary, marginBottom: 16 }}>
                        Change Password
                      </div>

                      {isChangingPassword ? (
                        <>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                              Current Password
                            </label>
                            <input
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="Enter current password"
                              style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 14 }}
                            />
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                              New Password
                            </label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Min 8 characters"
                              style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 14 }}
                            />
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4 }}>
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm new password"
                              style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 14 }}
                            />
                          </div>

                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              type="button"
                              onClick={handleChangePassword}
                              style={{
                                flex: 1,
                                padding: 12,
                                borderRadius: 12,
                                border: "none",
                                background: COLORS.primary,
                                color: COLORS.onPrimary,
                                fontWeight: 800,
                                fontSize: 14,
                                cursor: "pointer"
                              }}
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsChangingPassword(false);
                                setCurrentPassword("");
                                setNewPassword("");
                                setConfirmPassword("");
                                setProfileError("");
                              }}
                              style={{
                                flex: 1,
                                padding: 12,
                                borderRadius: 12,
                                border: `1.5px solid ${COLORS.primary}`,
                                background: "transparent",
                                color: COLORS.primaryDark,
                                fontWeight: 800,
                                fontSize: 14,
                                cursor: "pointer"
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsChangingPassword(true)}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            borderRadius: 12,
                            border: "none",
                            background: COLORS.primary,
                            color: COLORS.onPrimary,
                            fontSize: 14,
                            fontWeight: 800,
                            cursor: "pointer"
                          }}
                        >
                          Change Password
                        </button>
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      background: COLORS.surface,
                      borderRadius: 16,
                      padding: 20,
                      marginBottom: 16,
                      border: `1px solid ${COLORS.border}`,
                      boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)"
                    }}
                  >
                    <div style={{ fontSize: 18, fontWeight: 900, color: COLORS.danger, marginBottom: 6 }}>
                      Account Session
                    </div>
                    <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 14 }}>
                      Signing out will end your current session on this device.
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onBackToPortal) onBackToPortal();
                      }}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: `1.5px solid ${COLORS.danger}`,
                        background: COLORS.dangerBg,
                        color: COLORS.danger,
                        fontSize: 14,
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.danger} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
