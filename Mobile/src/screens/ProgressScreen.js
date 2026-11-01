import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "../components/Button.js";
import { Card } from "../components/Card.js";
import { Input } from "../components/Input.js";
import { Notice } from "../components/Notice.js";
import { request } from "../services/api.js";
import { Icon } from "../components/Icon.js";
import { EmptyState } from "../components/EmptyState.js";
import { COLORS, RADIUS, SPACING } from "../utils/theme.js";

const FAVORITES_KEY = "ethioprep_favorite_questions";

export function ProgressScreen({ progress = [], onSaveProgress, saving }) {
  const [activeSubTab, setActiveSubTab] = useState("analytics"); // 'analytics' | 'leaderboard' | 'favorites'
  const [showLogForm, setShowLogForm] = useState(false);
  const [contentId, setContentId] = useState("");
  const [percent, setPercent] = useState("100");
  const [timeSpent, setTimeSpent] = useState("1800");
  const [error, setError] = useState("");

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(1);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Favorite questions state
  const [favoritesList, setFavoritesList] = useState([]);

  useEffect(() => {
    loadLeaderboard();
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      const val = await AsyncStorage.getItem(FAVORITES_KEY);
      if (val) {
        const parsed = JSON.parse(val);
        setFavoritesList(Object.values(parsed));
      }

      // Sync from backend
      const res = await request("/bookmarks");
      if (res?.bookmarks && Array.isArray(res.bookmarks)) {
        const map = {};
        res.bookmarks.forEach((b) => {
          map[b.questionId || b.prompt] = b;
        });
        setFavoritesList(Object.values(map));
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(map));
      }
    } catch {
      // ignore
    }
  }

  async function removeFavorite(qId) {
    try {
      const val = await AsyncStorage.getItem(FAVORITES_KEY);
      if (val) {
        const parsed = JSON.parse(val);
        delete parsed[qId];
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(parsed));
        setFavoritesList(Object.values(parsed));
      }
      // Delete on backend
      request(`/bookmarks/${qId}`, { method: "DELETE" }).catch(() => {});
    } catch {
      // ignore
    }
  }

  async function loadLeaderboard() {
    setLoadingLeaderboard(true);
    try {
      const data = await request("/progress/leaderboard");
      if (data?.leaderboard) setLeaderboard(data.leaderboard);
      if (data?.currentUserRank) setUserRank(data.currentUserRank);
    } catch {
      // fallback mock leaderboard if server offline
      setLeaderboard([
        { rank: 1, displayName: "Abebe Bikila", score: 850, totalTimeSpent: 18000, itemsCompleted: 12 },
        { rank: 2, displayName: "Tirunesh Dibaba", score: 790, totalTimeSpent: 16200, itemsCompleted: 11 },
        { rank: 3, displayName: "Kenenisa Bekele", score: 720, totalTimeSpent: 14400, itemsCompleted: 10 },
        { rank: 4, displayName: "You (Student)", score: 540, totalTimeSpent: 7200, itemsCompleted: 7 }
      ]);
    } finally {
      setLoadingLeaderboard(false);
    }
  }

  const totalTimeSpentSeconds = progress.reduce(
    (acc, curr) => acc + (curr.timeSpentSeconds || 0),
    0
  );
  const completedCount = progress.filter((p) => p.completed).length;

  async function handleLog() {
    setError("");
    if (!contentId.trim()) {
      setError("Please provide a valid Subject or Exam ID.");
      return;
    }

    try {
      await onSaveProgress({
        contentType: "subject",
        contentId: contentId.trim(),
        progressPercent: Number(percent) || 0,
        timeSpentSeconds: Number(timeSpent) || 0,
        completed: Number(percent) >= 100
      });
      setContentId("");
      setShowLogForm(false);
    } catch (err) {
      setError(err.message || "Failed to update learning progress.");
    }
  }

  return (
    <View style={styles.container}>
      {/* Sub Tabs */}
      <View style={styles.subTabBar}>
        <TouchableOpacity
          onPress={() => setActiveSubTab("analytics")}
          style={[styles.subTabItem, activeSubTab === "analytics" && styles.activeSubTabItem]}
        >
          <Text style={[styles.subTabText, activeSubTab === "analytics" && styles.activeSubTabText]}>
            Progress
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveSubTab("leaderboard")}
          style={[styles.subTabItem, activeSubTab === "leaderboard" && styles.activeSubTabItem]}
        >
          <Text style={[styles.subTabText, activeSubTab === "leaderboard" && styles.activeSubTabText]}>
            <Icon color={activeSubTab === "leaderboard" ? COLORS.onPrimary : COLORS.gold} name="trophy-outline" size={13} />{" "}
            Leaderboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setActiveSubTab("favorites");
            loadFavorites();
          }}
          style={[styles.subTabItem, activeSubTab === "favorites" && styles.activeSubTabItem]}
        >
          <Text style={[styles.subTabText, activeSubTab === "favorites" && styles.activeSubTabText]}>
            Favorites ⭐ ({favoritesList.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* 1. Analytics & Progress Tab */}
      {activeSubTab === "analytics" && (
        <>
          <Text style={styles.title}>Learning Analytics</Text>
          <Text style={styles.subtitle}>
            Track your syllabus mastery, study hours, and exam completion.
          </Text>

          <View style={styles.metricsGrid}>
            <Card style={styles.metricCard}>
              <Text style={styles.metricVal}>
                {Math.round(totalTimeSpentSeconds / 60)}m
              </Text>
              <Text style={styles.metricLbl}>Total Study Time</Text>
            </Card>
            <Card style={styles.metricCard}>
              <Text style={styles.metricVal}>{completedCount}</Text>
              <Text style={styles.metricLbl}>Items Mastered</Text>
            </Card>
            <Card style={styles.metricCard}>
              <Text style={[styles.metricVal, { color: COLORS.gold }]}>#{userRank}</Text>
              <Text style={styles.metricLbl}>Your Rank</Text>
            </Card>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Content Progress Log</Text>
            <Button
              onPress={() => setShowLogForm(!showLogForm)}
              size="sm"
              variant="outline"
            >
              {showLogForm ? "Cancel" : "+ Log Progress"}
            </Button>
          </View>

          {showLogForm && (
            <Card style={styles.formCard}>
              <Text style={styles.formTitle}>Record Study Session</Text>
              <Notice message={error} type="error" />
              <Input
                label="Subject or Content Mongo ID"
                onChangeText={setContentId}
                placeholder="e.g. 64f1a2b3c4d5e6f7a8b9c0d1"
                value={contentId}
              />
              <Input
                keyboardType="numeric"
                label="Progress (0 - 100%)"
                onChangeText={setPercent}
                placeholder="100"
                value={percent}
              />
              <Input
                keyboardType="numeric"
                label="Time Spent in Seconds"
                onChangeText={setTimeSpent}
                placeholder="1800"
                value={timeSpent}
              />
              <Button loading={saving} onPress={handleLog}>
                Save Study Record
              </Button>
            </Card>
          )}

          {progress.length === 0 ? (
            <EmptyState
              icon="stats-chart-outline"
              message="Solve subject quizzes or complete timed exams to build your history!"
              title="No progress logged yet"
            />
          ) : (
            progress.map((item) => (
              <Card key={item._id || item.contentId} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <Text style={styles.contentType}>
                    {(item.contentType || "subject").toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      styles.percentText,
                      item.completed && styles.percentCompleted
                    ]}
                  >
                    {item.progressPercent}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(100, Math.max(0, item.progressPercent))}%` }
                    ]}
                  />
                </View>
                <Text style={styles.timeSpent}>
                  Time spent: {Math.round((item.timeSpentSeconds || 0) / 60)} minutes
                </Text>
              </Card>
            ))
          )}
        </>
      )}

      {/* 2. Leaderboard Tab */}
      {activeSubTab === "leaderboard" && (
        <>
          <Card style={styles.userRankCard}>
            <Text style={styles.userRankLabel}>Your Current Standing</Text>
            <View style={styles.userRankRow}>
              <View style={styles.userRankBadge}>
                <Text style={styles.userRankNum}>Rank #{userRank}</Text>
              </View>
              <Text style={styles.userRankSub}>Top percentile among active EUEE candidates</Text>
            </View>
          </Card>

          <Text style={styles.sectionTitle}>Top Students Leaderboard</Text>

          {leaderboard.map((student) => {
            const isTop3 = student.rank <= 3;
            return (
              <Card
                key={student.rank + (student.displayName || "")}
                style={[styles.leaderCard, isTop3 && styles.topLeaderCard]}
              >
                <View style={styles.leaderRow}>
                  <View
                    style={[
                      styles.rankCircle,
                      student.rank === 1 && styles.rank1,
                      student.rank === 2 && styles.rank2,
                      student.rank === 3 && styles.rank3
                    ]}
                  >
                    <Text
                      style={[
                        styles.rankCircleText,
                        isTop3 && { color: COLORS.onPrimary, fontWeight: "900" }
                      ]}
                    >
                      {isTop3 ? <Icon color={COLORS.onPrimary} name="medal" size={16} /> : student.rank}
                    </Text>
                  </View>

                  <View style={styles.leaderInfo}>
                    <Text style={styles.leaderName}>{student.displayName}</Text>
                    <Text style={styles.leaderStats}>
                      {Math.round((student.totalTimeSpent || 0) / 60)}m study · {student.itemsCompleted || 0} completed
                    </Text>
                  </View>

                  <View style={styles.leaderScoreBox}>
                    <Text style={styles.leaderScore}>{student.score || 0}</Text>
                    <Text style={styles.leaderScoreLabel}>PTS</Text>
                  </View>
                </View>
              </Card>
            );
          })}
        </>
      )}

      {/* 3. Favorite Questions Tab */}
      {activeSubTab === "favorites" && (
        <>
          <Text style={styles.title}>Saved Favorite Questions</Text>
          <Text style={styles.subtitle}>
            Review questions you bookmarked during mock exams and practice sessions.
          </Text>

          {favoritesList.length === 0 ? (
            <EmptyState
              icon="star-outline"
              message={'During any timed mock exam, tap "Save Favorite" to review challenging questions here later!'}
              title="No favorite questions saved yet"
            />
          ) : (
            favoritesList.map((q, idx) => (
              <Card key={q._id || idx} style={styles.favCard}>
                <View style={styles.favHeader}>
                  <View style={styles.favBadge}>
                    <Text style={styles.favBadgeText}>Saved Question #{idx + 1}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeFavorite(q._id)}
                    style={styles.removeFavBtn}
                  >
                    <Icon color={COLORS.danger} name="close" size={13} />
                    <Text style={styles.removeFavText}>Remove</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.favPrompt}>{q.prompt}</Text>

                {q.options && (
                  <View style={styles.favOptions}>
                    {q.options.map((opt) => (
                      <View key={opt.key} style={styles.favOptionRow}>
                        <Text style={styles.favOptionKey}>{opt.key}.</Text>
                        <Text style={styles.favOptionText}>{opt.text || opt.label}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {q.explanation ? (
                  <View style={styles.favExplanation}>
                    <Text style={styles.favExpTitle}>Explanation / Solution:</Text>
                    <Text style={styles.favExpText}>{q.explanation}</Text>
                  </View>
                ) : null}
              </Card>
            ))
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.xl
  },
  subTabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 3,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  subTabItem: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: "center",
    borderRadius: RADIUS.sm
  },
  activeSubTabItem: {
    backgroundColor: COLORS.primary
  },
  subTabText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted
  },
  activeSubTabText: {
    color: COLORS.onPrimary
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: SPACING.md
  },
  metricsGrid: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.md
  },
  metricCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.md
  },
  metricVal: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.primary
  },
  metricLbl: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    textAlign: "center"
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.sm
  },
  formCard: {
    backgroundColor: COLORS.surfaceMuted,
    marginBottom: SPACING.md
  },
  formTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: SPACING.xl
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textMuted
  },
  emptySubText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 4
  },
  logCard: {
    marginBottom: SPACING.sm
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs
  },
  contentType: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textMuted
  },
  percentText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary
  },
  percentCompleted: {
    color: COLORS.success
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: "hidden",
    marginVertical: SPACING.xs
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3
  },
  timeSpent: {
    fontSize: 11,
    color: COLORS.textMuted
  },
  userRankCard: {
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.lg
  },
  userRankLabel: {
    fontSize: 12,
    color: COLORS.surfaceMuted,
    fontWeight: "700"
  },
  userRankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    marginTop: SPACING.xs
  },
  userRankBadge: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.full
  },
  userRankNum: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.onPrimary
  },
  userRankSub: {
    fontSize: 12,
    color: COLORS.onPrimary,
    flex: 1
  },
  leaderCard: {
    marginBottom: SPACING.xs
  },
  topLeaderCard: {
    borderColor: COLORS.warning
  },
  leaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md
  },
  rankCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: "center",
    justifyContent: "center"
  },
  rank1: { backgroundColor: COLORS.gold },
  rank2: { backgroundColor: COLORS.silver },
  rank3: { backgroundColor: COLORS.bronze },
  rankCircleText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text
  },
  leaderInfo: {
    flex: 1
  },
  leaderName: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text
  },
  leaderStats: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2
  },
  leaderScoreBox: {
    alignItems: "flex-end"
  },
  leaderScore: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.primary
  },
  leaderScoreLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted
  },
  favCard: {
    marginBottom: SPACING.md
  },
  favHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm
  },
  favBadge: {
    backgroundColor: COLORS.warningBg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm
  },
  favBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.warning
  },
  removeFavBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    minHeight: 32,
    paddingVertical: 2,
    paddingHorizontal: SPACING.xs
  },
  removeFavText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.danger
  },
  favPrompt: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: SPACING.sm
  },
  favOptions: {
    gap: 4,
    marginBottom: SPACING.sm
  },
  favOptionRow: {
    flexDirection: "row",
    gap: 6
  },
  favOptionKey: {
    fontWeight: "700",
    color: COLORS.textMuted,
    fontSize: 13
  },
  favOptionText: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1
  },
  favExplanation: {
    backgroundColor: COLORS.surfaceMuted,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.xs
  },
  favExpTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 2
  },
  favExpText: {
    fontSize: 12,
    color: COLORS.text
  }
});
