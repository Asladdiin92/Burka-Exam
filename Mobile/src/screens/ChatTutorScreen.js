import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Icon } from "../components/Icon.js";
import { request } from "../services/api.js";
import { COLORS, RADIUS, SHADOW, SPACING } from "../utils/theme.js";

const TUTOR_ROLES = [
  {
    id: "exam_coach",
    label: "🎯 Exam Coach",
    model: "gemini-3.8-flash",
    modelLabel: "Gemini 3.8 Flash",
    description: "ESSLCE National Entrance Exam strategy & distractor analysis",
    taskType: "general"
  },
  {
    id: "fast_tutor",
    label: "⚡ Fast Answer",
    model: "gemini-3.1-flash-lite",
    modelLabel: "Gemini 3.1 Flash Lite",
    description: "Rapid definitions & formulas under 1 second",
    taskType: "fast"
  },
  {
    id: "stem_solver",
    label: "🔬 Deep STEM",
    model: "gemini-4-argon",
    modelLabel: "Gemini 4 Argon",
    description: "Step-by-step math proofs, physics & chemistry derivations",
    taskType: "complex"
  },
  {
    id: "multilingual_tutor",
    label: "🌍 Oromoo / አማርኛ",
    model: "gemini-3.8-flash",
    modelLabel: "Gemini 3.8 Flash",
    description: "Curriculum concepts in Afaan Oromoo & Amharic",
    taskType: "general"
  }
];

function getContextGreeting(user, ctx, roleId) {
  const name = user?.displayName || "Student";
  if (ctx?.questionPrompt) {
    const qSnippet = ctx.questionPrompt.slice(0, 95).trim();
    return `Hello ${name}! 👋 I see you're studying this **${ctx.subjectName || "entrance exam"}** question:
*"${qSnippet}..."*

I can break down why the correct option is right, explain the distractors, or translate to Afaan Oromoo or Amharic. Tap a suggestion below or ask me anything!`;
  }

  if (ctx?.noteTitle) {
    return `Hello ${name}! 📝 I see you're reviewing study notes for **${ctx.noteTitle}** ${ctx.subjectName ? `(${ctx.subjectName})` : ""}.

What concept, definition, formula, or exam trap can I clarify for you today?`;
  }

  if (roleId === "fast_tutor") {
    return `Akkam ${name}! ⚡ I am your **Rapid Study Assistant**. Ask me for quick formulas, definitions, or high-yield exam facts and I will answer instantly!`;
  }

  if (roleId === "stem_solver") {
    return `Hello ${name}! 🔬 I am your **Deep STEM & Math Solver**. Share any difficult calculus, algebra, physics force, or chemistry problem for a complete step-by-step derivation.`;
  }

  if (roleId === "multilingual_tutor") {
    return `Akkam jirtu! ሰላም! 👋 Ani barsiisaa keessan **Burka Exam Multilingual AI Tutor** dha.
Gafiilee fi yaada barnootaa Grade 9–12 Afaan Oromootiin ykn በአማርኛ ማብራሪያ ማግኘት ትችላላችሁ!`;
  }

  return `Hello ${name}! 👋 I am your **Burka Exam AI Tutor** powered by Gemini.

I'm here to help you conquer the Ethiopian Entrance Exam (ESSLCE / EUEE / Model Exams) across Grades 9–12 curriculum subjects.

Select your preferred tutor mode above, pick a suggestion, or ask any question!`;
}

export function ChatTutorScreen({ user, initialContext = null, onClearContext }) {
  const [activeRole, setActiveRole] = useState("exam_coach");
  const [context, setContext] = useState(initialContext);
  const [contextExpanded, setContextExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const initialGreeting = useMemo(() => {
    return getContextGreeting(user, initialContext, "exam_coach");
  }, [user, initialContext]);

  const [messages, setMessages] = useState([
    {
      id: "msg_init",
      role: "model",
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      source: "gemini-3.8-flash",
      roleId: "exam_coach"
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (initialContext) {
      setContext(initialContext);
      // Add context welcome announcement if not already added
      const ctxGreeting = getContextGreeting(user, initialContext, activeRole);
      setMessages([
        {
          id: "msg_ctx_" + Date.now(),
          role: "model",
          text: ctxGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          source: TUTOR_ROLES.find((r) => r.id === activeRole)?.model || "gemini-3.8-flash",
          roleId: activeRole
        }
      ]);
    }
  }, [initialContext]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages, loading]);

  const currentRoleConfig = useMemo(() => {
    return TUTOR_ROLES.find((r) => r.id === activeRole) || TUTOR_ROLES[0];
  }, [activeRole]);

  // Suggestions dynamic based on role and context
  const dynamicSuggestions = useMemo(() => {
    if (context?.questionPrompt) {
      return [
        "Explain why the correct answer is right",
        "Why are the other options wrong (distractors)?",
        "Afaan Oromootiin naaf ibsi (In Afaan Oromoo)",
        "በአማርኛ በዝርዝር አስረዳኝ (In Amharic)",
        "What formula or rule is needed to solve this?",
        "Quick ESSLCE elimination trick for this question"
      ];
    }
    if (context?.noteTitle) {
      return [
        "Summarize this study note in 3 key points",
        "What entrance exam questions come from this chapter?",
        "Give me a mnemonic trick to memorize this",
        "Ibsa gabaabaa Afaan Oromootiin (Short Oromo summary)",
        "Test me with an entrance exam practice question on this"
      ];
    }
    if (activeRole === "fast_tutor") {
      return [
        "What is Hooke's Law in 1 sentence?",
        "Define exothermic vs endothermic reactions",
        "State Newton's second law with formula",
        "What is the quadratic formula?",
        "Define meiosis vs mitosis"
      ];
    }
    if (activeRole === "stem_solver") {
      return [
        "Solve a projectile motion problem step-by-step",
        "How do I balance a redox chemical equation?",
        "Explain integration by parts with an example",
        "Calculate electric field from Coulomb's Law",
        "Derive kinematic equation v² = u² + 2as"
      ];
    }
    if (activeRole === "multilingual_tutor") {
      return [
        "Seera Niiwutan isa lammaffaa Afaan Oromootiin ibsi",
        "ስለ ፎቶሲንተሲስ (Photosynthesis) በአማርኛ አስረዳኝ",
        "Hiika seelii (cell) fi caasaa isaa naaf qoodi",
        "የኬሚስትሪ ቀመሮችን እንዴት ማስታወስ እችላለሁ?"
      ];
    }
    return [
      "How can I score 90+ on the ESSLCE Exam?",
      "Explain the most repeated Physics entrance questions",
      "Give me Chemistry organic nomenclature rules",
      "Tips for SAT / Aptitude quantitative reasoning",
      "Biology Grade 11 Unit 1 summary"
    ];
  }, [context, activeRole]);

  async function handleSendMessage(customText = null) {
    const textToSend = String(customText || input).trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: "u_" + Date.now(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = nextMessages
        .filter((m) => !m.id.startsWith("msg_init"))
        .map((m) => ({
          role: m.role,
          text: m.text
        }));

      const payload = {
        messages: apiMessages.length > 0 ? apiMessages : [{ role: "user", text: textToSend }],
        context: context || {},
        role: currentRoleConfig.id,
        taskType: currentRoleConfig.taskType,
        model: currentRoleConfig.model
      };

      const res = await request("/ai/chat", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      const replyMsg = {
        id: "m_" + Date.now(),
        role: "model",
        text: res.reply || "I am ready to help you with Ethiopian entrance exam questions and curriculum notes.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: res.source || currentRoleConfig.model,
        roleId: currentRoleConfig.id
      };

      setMessages((prev) => [...prev, replyMsg]);
    } catch (err) {
      const errorMsg = {
        id: "err_" + Date.now(),
        role: "model",
        text: `⚠️ ${err.message || "Unable to reach AI Tutor. Please check your connection and try again."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: "offline"
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyMessage(id, text) {
    try {
      await Clipboard.setStringAsync(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore clipboard error
    }
  }

  function handleClearContext() {
    setContext(null);
    if (onClearContext) onClearContext();
  }

  function handleResetChat() {
    setMessages([
      {
        id: "msg_init_" + Date.now(),
        role: "model",
        text: `Chat reset! 🔄 Mode set to **${currentRoleConfig.label}** (${currentRoleConfig.modelLabel}). What Ethiopian entrance exam question or concept shall we study?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: currentRoleConfig.model,
        roleId: activeRole
      }
    ]);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      style={styles.container}
    >
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.headerTitleRow}>
          <View style={styles.aiIconBadge}>
            <Icon color={COLORS.onPrimary} name="sparkles" size={17} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Burka Exam AI Tutor</Text>
            <Text style={styles.headerSubtitle}>Multi-Turn Gemini Entrance Exam Assistant</Text>
          </View>
        </View>

        <TouchableOpacity
          accessibilityLabel="Reset chat"
          onPress={handleResetChat}
          style={styles.resetBtn}
        >
          <Icon color={COLORS.textMuted} name="refresh-outline" size={14} />
          <Text style={styles.resetBtnText}>New Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Role / Persona Selector Tabs */}
      <View style={styles.rolesContainer}>
        <ScrollView
          contentContainerStyle={styles.rolesScroll}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {TUTOR_ROLES.map((r) => {
            const active = activeRole === r.id;
            return (
              <TouchableOpacity
                accessibilityLabel={r.label}
                key={r.id}
                onPress={() => setActiveRole(r.id)}
                style={[styles.roleChip, active && styles.roleChipActive]}
              >
                <Text style={[styles.roleChipText, active && styles.roleChipTextActive]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Active Role Mini Info Banner */}
      <View style={styles.roleInfoBar}>
        <Text numberOfLines={1} style={styles.roleInfoText}>
          ⚡ <Text style={{ fontWeight: "700" }}>{currentRoleConfig.modelLabel}</Text> · {currentRoleConfig.description}
        </Text>
      </View>

      {/* Attached Context Banner */}
      {context && (
        <View style={styles.contextBanner}>
          <View style={styles.contextHeader}>
            <View style={styles.contextBadge}>
              <Icon
                color={COLORS.primary}
                name={context.questionPrompt ? "document-text-outline" : "book-outline"}
                size={13}
              />
              <Text style={styles.contextBadgeText}>
                {context.questionPrompt ? "Attached Exam Question" : "Attached Study Note"}
                {context.subjectName ? ` · ${context.subjectName}` : ""}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <TouchableOpacity
                onPress={() => setContextExpanded(!contextExpanded)}
                style={styles.contextExpandBtn}
              >
                <Text style={styles.contextExpandBtnText}>
                  {contextExpanded ? "Collapse" : "View"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClearContext} style={styles.clearContextBtn}>
                <Icon color={COLORS.textMuted} name="close-circle-outline" size={16} />
              </TouchableOpacity>
            </View>
          </View>

          <Text
            numberOfLines={contextExpanded ? undefined : 2}
            style={styles.contextContent}
          >
            {context.questionPrompt || context.noteTitle || "Selected Study Material"}
          </Text>

          {contextExpanded && context.options && context.options.length > 0 && (
            <View style={styles.contextOptionsBox}>
              {context.options.map((opt) => (
                <Text key={opt.key} style={styles.contextOptionLine}>
                  <Text style={{ fontWeight: "700" }}>{opt.key}.</Text> {opt.text || opt.label}
                </Text>
              ))}
              {context.correctAnswer && (
                <Text style={styles.contextCorrectLine}>
                  Correct: Option {context.correctAnswer}
                </Text>
              )}
            </View>
          )}
        </View>
      )}

      {/* Scrollable Conversation Thread */}
      <ScrollView
        contentContainerStyle={styles.messagesList}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((item) => {
          const isUser = item.role === "user";
          return (
            <View
              key={item.id}
              style={[
                styles.messageRow,
                isUser ? styles.messageRowUser : styles.messageRowModel
              ]}
            >
              {!isUser && (
                <View style={styles.tutorAvatar}>
                  <Icon color={COLORS.onPrimary} name="sparkles" size={14} />
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  isUser ? styles.userBubble : styles.modelBubble
                ]}
              >
                {!isUser && (
                  <View style={styles.modelHeader}>
                    <Text style={styles.modelName}>Burka Exam AI</Text>
                    {item.source && (
                      <View style={styles.modelSourceTag}>
                        <Text style={styles.modelBadge}>{item.source}</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      accessibilityLabel="Copy response"
                      onPress={() => handleCopyMessage(item.id, item.text)}
                      style={styles.copyBtn}
                    >
                      <Icon
                        color={copiedId === item.id ? COLORS.primary : COLORS.textMuted}
                        name={copiedId === item.id ? "checkmark" : "copy-outline"}
                        size={13}
                      />
                      <Text
                        style={[
                          styles.copyBtnText,
                          copiedId === item.id && { color: COLORS.primary }
                        ]}
                      >
                        {copiedId === item.id ? "Copied" : "Copy"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <Text
                  style={[
                    styles.messageText,
                    isUser ? styles.userText : styles.modelText
                  ]}
                >
                  {item.text}
                </Text>

                <Text
                  style={[
                    styles.timestamp,
                    isUser ? styles.userTimestamp : styles.modelTimestamp
                  ]}
                >
                  {item.timestamp}
                </Text>
              </View>
            </View>
          );
        })}

        {loading && (
          <View style={[styles.messageRow, styles.messageRowModel]}>
            <View style={styles.tutorAvatar}>
              <Icon color={COLORS.onPrimary} name="sparkles" size={14} />
            </View>
            <View style={[styles.messageBubble, styles.modelBubble, styles.loadingBubble]}>
              <ActivityIndicator color={COLORS.primary} size="small" />
              <Text style={styles.loadingText}>
                {currentRoleConfig.modelLabel} is thinking & analyzing...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Dynamic Suggestion Pills */}
      <View style={styles.suggestionsWrapper}>
        <ScrollView
          contentContainerStyle={styles.suggestionsContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {dynamicSuggestions.map((s, idx) => (
            <TouchableOpacity
              disabled={loading}
              key={idx}
              onPress={() => handleSendMessage(s)}
              style={styles.suggestionPill}
            >
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat Input Row */}
      <View style={styles.inputContainer}>
        <TextInput
          editable={!loading}
          multiline
          onChangeText={setInput}
          placeholder="Ask AI Tutor anything (English, Afaan Oromoo, አማርኛ)..."
          placeholderTextColor={COLORS.textMuted}
          style={styles.inputField}
          value={input}
        />
        <TouchableOpacity
          accessibilityLabel="Send message"
          disabled={!input.trim() || loading}
          onPress={() => handleSendMessage()}
          style={[
            styles.sendBtn,
            (!input.trim() || loading) && styles.sendBtnDisabled
          ]}
        >
          <Icon
            color={COLORS.onPrimary}
            name="send"
            size={18}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm
  },
  aiIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW.sm
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "600"
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceElevated
  },
  resetBtnText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "700"
  },
  rolesContainer: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingVertical: 6
  },
  rolesScroll: {
    paddingHorizontal: SPACING.md,
    gap: 8
  },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  roleChipActive: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primary
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted
  },
  roleChipTextActive: {
    color: COLORS.primaryDark,
    fontWeight: "800"
  },
  roleInfoBar: {
    backgroundColor: COLORS.surfaceAlt || "#e6ecf0",
    paddingHorizontal: SPACING.md,
    paddingVertical: 4
  },
  roleInfoText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500"
  },
  contextBanner: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    padding: SPACING.sm + 4,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    borderLeftWidth: 3.5,
    borderLeftColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  contextHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4
  },
  contextBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flex: 1
  },
  contextBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primaryDark
  },
  contextExpandBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: COLORS.primaryBg
  },
  contextExpandBtnText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primaryDark
  },
  clearContextBtn: {
    padding: 2
  },
  contextContent: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18
  },
  contextOptionsBox: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight
  },
  contextOptionLine: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2
  },
  contextCorrectLine: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primaryDark,
    marginTop: 3
  },
  messagesList: {
    padding: SPACING.md,
    paddingBottom: SPACING.lg
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: SPACING.md,
    maxWidth: "92%"
  },
  messageRowUser: {
    alignSelf: "flex-end",
    justifyContent: "flex-end"
  },
  messageRowModel: {
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    gap: 8
  },
  tutorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4
  },
  messageBubble: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.sm
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: RADIUS.xs
  },
  modelBubble: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderBottomLeftRadius: RADIUS.xs
  },
  modelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  },
  modelName: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary
  },
  modelSourceTag: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.sm
  },
  modelBadge: {
    fontSize: 9.5,
    fontWeight: "700",
    color: COLORS.primaryDark
  },
  copyBtn: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceElevated
  },
  copyBtnText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 21
  },
  userText: {
    color: COLORS.onPrimary,
    fontWeight: "600"
  },
  modelText: {
    color: COLORS.text,
    fontWeight: "400"
  },
  timestamp: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: "flex-end"
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.75)"
  },
  modelTimestamp: {
    color: COLORS.textMuted
  },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12
  },
  loadingText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: "italic"
  },
  suggestionsWrapper: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingVertical: 6
  },
  suggestionsContainer: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm
  },
  suggestionPill: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: COLORS.primaryLight
  },
  suggestionText: {
    color: COLORS.primaryDark,
    fontSize: 11.5,
    fontWeight: "700"
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border
  },
  inputField: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
    color: COLORS.text
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center"
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.borderDark || "#cbd5e1",
    opacity: 0.5
  }
});
