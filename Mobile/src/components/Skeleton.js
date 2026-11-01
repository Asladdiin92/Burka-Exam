import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../utils/theme.js";

export function Skeleton({ width = "100%", height = 14, radius = RADIUS.sm, style }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[{ width, height, borderRadius: radius, backgroundColor: COLORS.surfaceElevated, opacity }, style]}
    />
  );
}

export function SkeletonCard({ lines = 2 }) {
  return (
    <View style={styles.card}>
      <Skeleton height={12} width="30%" />
      <Skeleton height={18} style={styles.gap} width="70%" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton height={12} key={i} style={styles.gapSm} width={i === lines - 1 ? "55%" : "100%"} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.md
  },
  gap: { marginTop: SPACING.md },
  gapSm: { marginTop: SPACING.sm }
});
