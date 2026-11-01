import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "./Icon.js";
import { COLORS, RADIUS, SPACING } from "../utils/theme.js";

export function EmptyState({ icon = "file-tray-outline", title, message, children }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon color={COLORS.primary} name={icon} size={28} />
      </View>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    marginBottom: SPACING.md
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center"
  },
  message: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: SPACING.xs,
    lineHeight: 19
  }
});
