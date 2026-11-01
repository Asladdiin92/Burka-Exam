import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "./Icon.js";
import { COLORS, RADIUS, SPACING } from "../utils/theme.js";

const TYPES = {
  success: { fg: COLORS.success, bg: COLORS.successBg, icon: "checkmark-circle" },
  error: { fg: COLORS.danger, bg: COLORS.dangerBg, icon: "alert-circle" },
  warning: { fg: COLORS.warning, bg: COLORS.warningBg, icon: "warning" },
  info: { fg: COLORS.info, bg: COLORS.infoBg, icon: "information-circle" }
};

export function Notice({ type = "info", message }) {
  if (!message) return null;
  const t = TYPES[type] || TYPES.info;

  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.container, { backgroundColor: t.bg, borderColor: t.fg }]}
    >
      <Icon color={t.fg} name={t.icon} size={18} />
      <Text style={[styles.text, { color: t.fg }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderLeftWidth: 4
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18
  }
});
