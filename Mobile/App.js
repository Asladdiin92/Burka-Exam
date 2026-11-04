import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "./src/components/Header.js";
import { SkeletonCard } from "./src/components/Skeleton.js";
import { Icon } from "./src/components/Icon.js";
import { Notice } from "./src/components/Notice.js";
import { AuthScreen } from "./src/screens/AuthScreen.js";
import { HomeScreen } from "./src/screens/HomeScreen.js";
import { SubjectScreen } from "./src/screens/SubjectScreen.js";
import { ExamsScreen } from "./src/screens/ExamsScreen.js";
import { ExamActiveScreen } from "./src/screens/ExamActiveScreen.js";
import { NotesScreen } from "./src/screens/NotesScreen.js";
import { PracticeModeScreen } from "./src/screens/PracticeModeScreen.js";
import { PaymentScreen } from "./src/screens/PaymentScreen.js";
import { ProfileScreen } from "./src/screens/ProfileScreen.js";
import { ChatTutorScreen } from "./src/screens/ChatTutorScreen.js";
import {
  request,
  requestWithOfflineQueue
} from "./src/services/api.js";
import { getQueue } from "./src/services/offlineQueue.js";
import { COLORS, RADIUS, SPACING } from "./src/utils/theme.js";

const TABS = [
  { id: "home", label: "Home", icon: "home" },
  { id: "exams", label: "Exams", icon: "document-text" },
  { id: "notes", label: "Study Notes", icon: "book" },
  { id: "ai", label: "AI Tutor", icon: "sparkles" },
  { id: "practice", label: "Practice", icon: "flash" },
  { id: "payments", label: "Pay", icon: "card" },
  { id: "profile", label: "Profile", icon: "person" }
];

function generateId() {
  return "m_" + Math.random().toString(36).substring(2, 10);
}

function MainDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("home");
  const [notice, setNotice] = useState(null);
  const [queueCount, setQueueCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(user);

  // App domain state
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [notes, setNotes] = useState([]);
  const [progress, setProgress] = useState([]);
  const [payments, setPayments] = useState([]);

  // Active exam session
  const [activeExamSession, setActiveExamSession] = useState(null);
  const [showAnswerMode, setShowAnswerMode] = useState("after_finishing");
  const [pendingExamPrompt, setPendingExamPrompt] = useState(null);
  const [loadingExamId, setLoadingExamId] = useState(null);
  const [submittingExam, setSubmittingExam] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [aiContext, setAiContext] = useState(null);
  const [isPracticeActive, setIsPracticeActive] = useState(false);

  function handleAskAi(ctx) {
    if (activeExamSession) {
      setActiveExamSession(null);
    }
    setSelectedSubject(null);
    setAiContext(ctx);
    setTab("ai");
  }

  useEffect(() => {
    loadCachedData();
    loadDashboardData();
    refreshQueue();
  }, []);

  async function loadCachedData() {
    try {
      const [cachedNotes, cachedSubjects, cachedExams] = await Promise.all([
        AsyncStorage.getItem("@ethioprep_cached_notes"),
        AsyncStorage.getItem("@ethioprep_cached_subjects"),
        AsyncStorage.getItem("@ethioprep_cached_exams")
      ]);
      if (cachedNotes) setNotes(JSON.parse(cachedNotes));
      if (cachedSubjects) setSubjects(JSON.parse(cachedSubjects));
      if (cachedExams) setExams(JSON.parse(cachedExams));
    } catch {
      // ignore
    }
  }

  async function refreshQueue() {
    try {
      const q = await getQueue();
      setQueueCount(q.length);
    } catch {
      // ignore
    }
  }

  async function loadDashboardData() {
    try {
      const [subjRes, examsRes, notesRes, progRes, payRes, profileRes] = await Promise.allSettled([
        request("/question-bank/subjects"),
        request("/exams"),
        request("/notes"),
        request("/progress"),
        request("/payments"),
        request("/auth/profile")
      ]);

      if (subjRes.status === "fulfilled") {
        const s = subjRes.value.subjects || [];
        setSubjects(s);
        AsyncStorage.setItem("@ethioprep_cached_subjects", JSON.stringify(s)).catch(() => {});
      }
      if (examsRes.status === "fulfilled") {
        const e = examsRes.value.exams || [];
        setExams(e);
        AsyncStorage.setItem("@ethioprep_cached_exams", JSON.stringify(e)).catch(() => {});
      }
      if (notesRes.status === "fulfilled") {
        const n = notesRes.value.notes || [];
        setNotes(n);
        AsyncStorage.setItem("@ethioprep_cached_notes", JSON.stringify(n)).catch(() => {});
      }
      if (progRes.status === "fulfilled") setProgress(progRes.value.progress || []);
      if (payRes.status === "fulfilled") setPayments(payRes.value.payments || []);
      if (profileRes?.status === "fulfilled" && profileRes.value?.user) {
        const u = profileRes.value.user;
        setCurrentUser(u);
        AsyncStorage.setItem("ethioprep_user", JSON.stringify(u)).catch(() => {});
      }
    } catch (error) {
      setNotice({ type: "error", message: "Failed to sync remote data. Offline cache active." });
    } finally {
      setDashboardLoading(false);
    }
  }

  function handlePromptStartExam(examItem, options = {}) {
    if (!examItem) return;
    if (options?.showAnswerMode) {
      handleStartExam(examItem, options);
      return;
    }
    setPendingExamPrompt({ examItem, options });
  }

  async function handleStartExam(examItem, options = {}) {
    if (options?.showAnswerMode) {
      setShowAnswerMode(options.showAnswerMode);
    }
    setPendingExamPrompt(null);
    const loadingKey = options?.chapterId
      ? `${examItem._id}_${options.chapterId}${options.allYears ? "_all" : ""}`
      : examItem._id;
    setLoadingExamId(loadingKey);
    setNotice(null);
    try {
      const params = new URLSearchParams();
      if (options?.chapterId) params.set("chapterId", options.chapterId);
      if (options?.allYears) params.set("allYears", "true");
      const qs = params.toString();
      const url = `/exams/${examItem._id}/start${qs ? `?${qs}` : ""}`;
      const examData = await request(url, { method: "POST" });
      setActiveExamSession(examData);
    } catch (error) {
      setNotice({ type: "error", message: error.message || "Failed to start exam session." });
    } finally {
      setLoadingExamId(null);
    }
  }

  async function handleSubmitExam(attemptId, answers) {
    setSubmittingExam(true);
    setNotice(null);
    try {
      const result = await request(`/exams/attempts/${attemptId}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers })
      });
      setNotice({
        type: "success",
        message: `Exam submitted! Score: ${result.attempt.percentage}%`
      });
      loadDashboardData();
      return result;
    } catch (error) {
      setNotice({ type: "error", message: error.message || "Failed to submit exam." });
      throw error;
    } finally {
      setSubmittingExam(false);
    }
  }

  async function handleSaveNote(notePayload) {
    setSavingNote(true);
    setNotice(null);
    const localId = generateId();
    try {
      const result = await requestWithOfflineQueue(
        "/notes",
        {
          method: "POST",
          body: JSON.stringify({ ...notePayload, localId })
        },
        { operation: "create", entity: "note", entityId: localId, payload: notePayload }
      );

      setNotice({
        type: "success",
        message: result.online ? "Note saved to server." : "Offline: Note queued for sync."
      });

      refreshQueue();
      if (result.online) loadDashboardData();
    } catch (error) {
      setNotice({ type: "error", message: error.message || "Failed to save note." });
    } finally {
      setSavingNote(false);
    }
  }

  async function handleSaveProgress(progressPayload) {
    setSavingProgress(true);
    setNotice(null);
    const localId = generateId();
    try {
      const result = await requestWithOfflineQueue(
        "/progress",
        {
          method: "POST",
          body: JSON.stringify({ ...progressPayload, localUpdatedAt: new Date().toISOString() })
        },
        { operation: "upsert", entity: "progress", entityId: localId, payload: progressPayload }
      );

      setNotice({
        type: "success",
        message: result.online ? "Progress recorded." : "Offline: Progress queued for sync."
      });

      refreshQueue();
      if (result.online) loadDashboardData();
    } catch (error) {
      setNotice({ type: "error", message: error.message || "Failed to log progress." });
    } finally {
      setSavingProgress(false);
    }
  }

  async function handleSubmitPayment(paymentPayload) {
    setSubmittingPayment(true);
    setNotice(null);
    const clientMutationId = generateId();
    try {
      const result = await requestWithOfflineQueue(
        "/payments",
        {
          method: "POST",
          body: JSON.stringify({ ...paymentPayload, clientMutationId })
        },
        { operation: "create", entity: "payment", entityId: clientMutationId, payload: paymentPayload }
      );

      setNotice({
        type: "success",
        message: result.online
          ? "Payment submitted for review."
          : "Offline: Payment queued for verification."
      });

      refreshQueue();
      if (result.online) loadDashboardData();
    } catch (error) {
      setNotice({ type: "error", message: error.message || "Failed to submit payment." });
    } finally {
      setSubmittingPayment(false);
    }
  }

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {TABS.map((t) => {
        const active = tab === t.id;
        return (
          <TouchableOpacity
            accessibilityLabel={t.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            key={t.id}
            onPress={() => { setSelectedSubject(null); setTab(t.id); }}
            style={[styles.tabItem, active && styles.activeTabItem]}
          >
            <Icon
              color={active ? COLORS.onPrimary : COLORS.textMuted}
              name={active ? t.icon : `${t.icon}-outline`}
              size={18}
            />
            <Text style={[styles.tabText, active && styles.activeTabText]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <Modal
        animationType="fade"
        transparent
        visible={Boolean(pendingExamPrompt)}
        onRequestClose={() => setPendingExamPrompt(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalPill}>Practice Full Exam</Text>
            <Text style={styles.modalTitle}>When to show correct answer?</Text>
            <Text style={styles.modalSub}>
              Choose when you want to see correct answers and explanations for{" "}
              {pendingExamPrompt?.examItem?.title || "this exam"}:
            </Text>

            <TouchableOpacity
              onPress={() =>
                handleStartExam(pendingExamPrompt.examItem, {
                  ...pendingExamPrompt.options,
                  showAnswerMode: "after_finishing"
                })
              }
              style={[
                styles.modeOptionBtn,
                showAnswerMode === "after_finishing" && styles.modeOptionBtnActive
              ]}
            >
              <Text style={styles.modeOptionTitle}>🏁 After finishing</Text>
              <Text style={styles.modeOptionDesc}>
                Answer all questions first, then see your score, correct answers, and explanations after submitting.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleStartExam(pendingExamPrompt.examItem, {
                  ...pendingExamPrompt.options,
                  showAnswerMode: "right_away"
                })
              }
              style={[
                styles.modeOptionBtn,
                showAnswerMode === "right_away" && styles.modeOptionBtnActive
              ]}
            >
              <Text style={styles.modeOptionTitle}>⚡ Right away</Text>
              <Text style={styles.modeOptionDesc}>
                Reveal the correct answer and detailed explanation immediately as soon as you select an option.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPendingExamPrompt(null)}
              style={styles.modalCancelBtn}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {(tab === "ai" || tab === "practice") && !activeExamSession ? (
        <View style={styles.flexContainer}>
          {!(tab === "practice" && isPracticeActive) && (
            <View style={{ paddingHorizontal: SPACING.lg, paddingTop: SPACING.md }}>
              <Header
                onLogout={onLogout}
                onNavigateProfile={() => setTab("profile")}
                queueCount={queueCount}
                user={currentUser}
              />
              <Notice message={notice?.message} type={notice?.type} />
              {renderTabBar()}
            </View>
          )}
          <View style={{ flex: 1 }}>
            {tab === "ai" ? (
              <ChatTutorScreen
                initialContext={aiContext}
                onClearContext={() => setAiContext(null)}
                user={currentUser}
              />
            ) : (
              <PracticeModeScreen
                exams={exams}
                onAskAi={handleAskAi}
                onSaveProgress={handleSaveProgress}
                onSessionActiveChange={setIsPracticeActive}
                subjects={subjects}
                user={currentUser}
              />
            )}
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Header
            onLogout={onLogout}
            onNavigateProfile={() => setTab("profile")}
            queueCount={queueCount}
            user={currentUser}
          />

          <Notice message={notice?.message} type={notice?.type} />

          {activeExamSession ? (
            <ExamActiveScreen
              examData={activeExamSession}
              onAskAi={handleAskAi}
              onChangeShowAnswerMode={setShowAnswerMode}
              onExit={() => setActiveExamSession(null)}
              onSubmit={handleSubmitExam}
              showAnswerMode={showAnswerMode}
              submitting={submittingExam}
            />
          ) : (
            <>
              {renderTabBar()}

              {dashboardLoading && tab !== "profile" && (
                <View accessibilityLabel="Loading content">
                  <SkeletonCard lines={2} />
                  <SkeletonCard lines={3} />
                  <SkeletonCard lines={2} />
                </View>
              )}

              {!dashboardLoading && selectedSubject ? (
                <SubjectScreen
                  exams={exams}
                  loadingExamId={loadingExamId}
                  onAskAi={handleAskAi}
                  onBack={() => setSelectedSubject(null)}
                  onNavigatePayments={() => {
                    setSelectedSubject(null);
                    setTab("payments");
                  }}
                  onStartExam={handlePromptStartExam}
                  subject={selectedSubject}
                  subjects={subjects}
                  user={currentUser}
                />
              ) : !dashboardLoading && tab === "home" && (
                <HomeScreen
                  onSelectSubject={setSelectedSubject}
                  subjects={subjects}
                  user={currentUser}
                />
              )}

              {!dashboardLoading && tab === "exams" && (
                <ExamsScreen
                  exams={exams}
                  loadingExamId={loadingExamId}
                  onStartExam={handlePromptStartExam}
                  user={currentUser}
                />
              )}

              {!dashboardLoading && tab === "notes" && (
                <NotesScreen
                  notes={notes}
                  onAskAi={handleAskAi}
                  onSaveNote={handleSaveNote}
                  saving={savingNote}
                  subjects={subjects}
                  user={currentUser}
                />
              )}

              {!dashboardLoading && tab === "practice" && (
                <PracticeModeScreen
                  exams={exams}
                  onAskAi={handleAskAi}
                  onSaveProgress={handleSaveProgress}
                  subjects={subjects}
                  user={currentUser}
                />
              )}

              {!dashboardLoading && tab === "payments" && (
                <PaymentScreen
                  onSubmitPayment={handleSubmitPayment}
                  payments={payments}
                  submitting={submittingPayment}
                  user={currentUser}
                />
              )}

              {tab === "profile" && (
                <ProfileScreen
                  onLogout={onLogout}
                  onUpdateUser={setCurrentUser}
                  user={currentUser}
                />
              )}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("ethioprep_user")
      .then((val) => {
        if (val) setUser(JSON.parse(val));
      })
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    AsyncStorage.multiRemove(["ethioprep_token", "ethioprep_user"]).then(() => {
      setUser(null);
    });
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingLogo}>
          <Text style={styles.loadingLogoText}>E</Text>
        </View>
        <Text style={styles.loadingBrand}>
          Ethio<Text style={{ color: COLORS.primary }}>Prep</Text>
        </Text>
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: SPACING.lg }} />
      </View>
    );
  }

  return user ? (
    <MainDashboard onLogout={handleLogout} user={user} />
  ) : (
    <AuthScreen onLoginSuccess={setUser} />
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  flexContainer: {
    flex: 1
  },
  container: {
    padding: SPACING.lg
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  tabItem: {
    flex: 1,
    minHeight: 52,
    paddingVertical: SPACING.xs + 2,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    borderRadius: RADIUS.sm
  },
  activeTabItem: {
    backgroundColor: COLORS.primary
  },
  tabText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted
  },
  activeTabText: {
    color: COLORS.onPrimary
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background
  },
  loadingLogo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md
  },
  loadingLogoText: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.onPrimary
  },
  loadingBrand: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.6,
    color: COLORS.text
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  modalPill: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primaryBg,
    color: COLORS.primaryDark,
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 6
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 6
  },
  modalSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 14,
    lineHeight: 18
  },
  modeOptionBtn: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 10,
    backgroundColor: COLORS.surface
  },
  modeOptionBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryBg
  },
  modeOptionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4
  },
  modeOptionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17
  },
  modalCancelBtn: {
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: "center"
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textSecondary
  }
});
