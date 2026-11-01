import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS, RADIUS, SPACING, TOUCH_TARGET } from "../utils/theme.js";

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  error,
  style,
  inputStyle
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onBlur={() => setFocused(false)}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textFaint}
        secureTextEntry={secureTextEntry}
        selectionColor={COLORS.primary}
        style={[
          styles.input,
          focused && styles.inputFocused,
          error && styles.inputError,
          multiline && styles.multiline,
          inputStyle
        ]}
        value={value}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textMuted,
    letterSpacing: 0.3,
    marginBottom: 6
  },
  input: {
    minHeight: TOUCH_TARGET + 4,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    fontSize: 15,
    color: COLORS.text
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surfaceElevated
  },
  inputError: {
    borderColor: COLORS.danger
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: "top"
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 4
  }
});
