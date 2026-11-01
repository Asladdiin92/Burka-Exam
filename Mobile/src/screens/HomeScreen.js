import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EmptyState } from "../components/EmptyState.js";
import { Icon } from "../components/Icon.js";
import { COLORS, RADIUS, SHADOW, SPACING } from "../utils/theme.js";

const GRADES = [9, 10, 11, 12];
const SUBJECT_ICONS = { BIO: "git-branch-outline", CHEM: "flask-outline", PHYS: "speedometer-outline", ENG: "document-text-outline", GEOG: "earth-outline", HIST: "time-outline", ECON: "wallet-outline", MATH: "calculator-outline", APTITUDE: "bulb-outline", SAT: "school-outline" };
function subjectIcon(subject) { const key = Object.keys(SUBJECT_ICONS).find((code) => (subject.code || "").includes(code)); return key ? SUBJECT_ICONS[key] : "book-outline"; }
function subjectSupportsGrade(subject, grade) { const levels = String(subject.gradeLevel || "").match(/\d+/g)?.map(Number) || []; return !levels.length || (levels.length > 1 ? grade >= Math.min(...levels) && grade <= Math.max(...levels) : levels.includes(grade)); }

export function HomeScreen({ user, subjects = [], onSelectSubject }) {
  const [selectedGrade, setSelectedGrade] = useState(9);
  const isNatural = (user?.stream || "natural") === "natural";
  const streamSubjects = useMemo(() => subjects.filter((subject) => {
    if (subject.stream) return subject.stream === "both" || subject.stream === (isNatural ? "natural" : "social");
    const code = subject.code || "";
    return isNatural ? !["HIST", "GEOG", "ECON", "MATH_SOC"].includes(code) : !["PHYS", "CHEM", "BIO", "MATH_NAT"].includes(code);
  }), [subjects, isNatural]);
  useEffect(() => {
    if (!streamSubjects.some((subject) => subjectSupportsGrade(subject, selectedGrade))) {
      const firstAvailableGrade = GRADES.find((grade) => streamSubjects.some((subject) => subjectSupportsGrade(subject, grade)));
      if (firstAvailableGrade) setSelectedGrade(firstAvailableGrade);
    }
  }, [selectedGrade, streamSubjects]);
  const gradeSubjects = streamSubjects.filter((subject) => subjectSupportsGrade(subject, selectedGrade));
  return <View style={styles.container}>
    <View style={styles.intro}><Text style={styles.title}>Choose a subject</Text><Text style={styles.subtitle}>Select your grade, then pick a subject to practise past exam questions.</Text></View>
    <ScrollView contentContainerStyle={styles.gradeTabs} horizontal showsHorizontalScrollIndicator={false}>{GRADES.map((grade) => { const active = selectedGrade === grade; return <TouchableOpacity key={grade} onPress={() => setSelectedGrade(grade)} style={[styles.gradeTab, active && styles.gradeTabActive]}><Text style={[styles.gradeTabText, active && styles.gradeTabTextActive]}>Grade {grade}</Text></TouchableOpacity>; })}</ScrollView>
    <Text style={styles.sectionTitle}>Grade {selectedGrade} subjects</Text>
    {gradeSubjects.length === 0 ? <EmptyState icon="library-outline" title="No subjects yet" message={`Subjects for Grade ${selectedGrade} will appear here.`} /> : <View style={styles.subjectGrid}>{gradeSubjects.map((subject) => <TouchableOpacity activeOpacity={0.8} key={subject._id || subject.code} onPress={() => onSelectSubject(subject)} style={styles.subjectCard}><View style={styles.subjectIcon}><Icon color={COLORS.onPrimary} name={subjectIcon(subject)} size={28} /></View><Text numberOfLines={2} style={styles.subjectName}>{subject.name}</Text><View style={styles.gradePill}><Text style={styles.gradePillText}>Grade {selectedGrade}</Text></View><View style={styles.cardFooter}><Text style={styles.cardFooterText}>Practice Exams</Text><Icon color={COLORS.primary} name="arrow-forward" size={16} /></View></TouchableOpacity>)}</View>}
  </View>;
}

const styles = StyleSheet.create({
  container: { paddingBottom: SPACING.xl }, intro: { marginBottom: SPACING.md }, title: { color: COLORS.text, fontSize: 25, fontWeight: "800", letterSpacing: -0.5 }, subtitle: { color: COLORS.textMuted, fontSize: 14, lineHeight: 20, marginTop: 5 }, gradeTabs: { gap: SPACING.sm, paddingBottom: SPACING.md }, gradeTab: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: RADIUS.full, borderWidth: 1, paddingHorizontal: 19, paddingVertical: 11 }, gradeTabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary }, gradeTabText: { color: COLORS.textMuted, fontSize: 14, fontWeight: "800" }, gradeTabTextActive: { color: COLORS.onPrimary }, sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: "800", marginBottom: SPACING.sm }, subjectGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.md }, subjectCard: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: RADIUS.xl, borderWidth: 1, minHeight: 202, padding: SPACING.md, width: "47.5%", ...SHADOW.sm }, subjectIcon: { alignItems: "center", backgroundColor: COLORS.primary, borderRadius: 17, height: 58, justifyContent: "center", width: 58 }, subjectName: { color: COLORS.text, fontSize: 17, fontWeight: "800", marginTop: SPACING.md, minHeight: 42 }, gradePill: { alignSelf: "flex-start", backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.full, marginTop: SPACING.sm, paddingHorizontal: 10, paddingVertical: 5 }, gradePillText: { color: COLORS.primaryDark, fontSize: 11, fontWeight: "800" }, cardFooter: { alignItems: "center", borderTopColor: COLORS.border, borderTopWidth: 1, flexDirection: "row", justifyContent: "space-between", marginTop: "auto", paddingTop: SPACING.sm }, cardFooterText: { color: COLORS.textMuted, fontSize: 12, fontWeight: "700" }
});
