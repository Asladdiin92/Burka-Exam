import React, { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from "../components/Button.js";
import { Notice } from "../components/Notice.js";
import { Icon } from "../components/Icon.js";
import { verifyEmail, resendVerification } from "../services/api.js";
import { COLORS, RADIUS, SPACING, SHADOW } from "../utils/theme.js";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export function VerifyEmailScreen({ email, onVerified, onBack }) {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
  const [resendLoading, setResendLoading] = useState(false);

  const inputRefs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true })
    ]).start();
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  function handleOTPChange(text, index) {
    const newOtp = [...otp];
    // Handle paste — if user pastes full OTP
    if (text.length > 1) {
      const chars = text.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
      for (let i = 0; i < OTP_LENGTH; i++) {
        newOtp[i] = chars[i] || "";
      }
      setOtp(newOtp);
      if (chars.length === OTP_LENGTH) {
        Keyboard.dismiss();
      } else {
        inputRefs.current[Math.min(chars.length, OTP_LENGTH - 1)]?.focus();
      }
      return;
    }

    newOtp[index] = text.replace(/\D/g, "");
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(event, index) {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
  }

  async function handleVerify() {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const result = await verifyEmail(email, code);
      setSuccess("Email verified successfully!");
      setTimeout(() => onVerified(result.user), 800);
    } catch (err) {
      setError(err.message || "Verification failed.");
      // Clear OTP on error
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setResendLoading(true);
    try {
      await resendVerification(email);
      setSuccess("A new verification code has been sent to your email.");
      setResendCooldown(RESEND_COOLDOWN);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setResendLoading(false);
    }
  }

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1***$3");

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Header */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon name="mail-outline" size={32} color={COLORS.primary} />
          </View>
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{"\n"}
          <Text style={styles.emailText}>{maskedEmail}</Text>
        </Text>

        <Notice message={error} type="error" />
        <Notice message={success} type="success" />

        {/* OTP Input Row */}
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
              value={digit}
              onChangeText={(text) => handleOTPChange(text, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
              keyboardType="number-pad"
              maxLength={index === 0 ? OTP_LENGTH : 1}
              selectTextOnFocus
              selectionColor={COLORS.primary}
              accessibilityLabel={`Digit ${index + 1}`}
            />
          ))}
        </View>

        <Button loading={loading} onPress={handleVerify} style={styles.verifyBtn}>
          Verify Email
        </Button>

        {/* Resend */}
        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>Didn't receive the code?</Text>
          {resendCooldown > 0 ? (
            <Text style={styles.cooldownText}>Resend in {resendCooldown}s</Text>
          ) : (
            <TouchableOpacity activeOpacity={0.7} onPress={handleResend} disabled={resendLoading}>
              <Text style={styles.resendLink}>{resendLoading ? "Sending..." : "Resend Code"}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Back */}
        <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={16} color={COLORS.textMuted} />
          <Text style={styles.backText}>Back to Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.primary
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOW.md
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: SPACING.lg
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryBg,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.xs
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: SPACING.lg
  },
  emailText: {
    color: COLORS.primary,
    fontWeight: "700"
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: SPACING.lg
  },
  otpInput: {
    width: 46,
    height: 54,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceMuted,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryBg
  },
  verifyBtn: {
    marginBottom: SPACING.lg
  },
  resendRow: {
    alignItems: "center",
    marginBottom: SPACING.md
  },
  resendLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs
  },
  cooldownText: {
    fontSize: 13,
    color: COLORS.textFaint,
    fontWeight: "600"
  },
  resendLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "800"
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: SPACING.sm
  },
  backText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "600"
  }
});
