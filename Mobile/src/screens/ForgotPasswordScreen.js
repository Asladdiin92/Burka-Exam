import React, { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from "../components/Button.js";
import { Input } from "../components/Input.js";
import { Notice } from "../components/Notice.js";
import { Icon } from "../components/Icon.js";
import { forgotPassword, verifyResetOTP, resetPassword } from "../services/api.js";
import { COLORS, RADIUS, SPACING, SHADOW } from "../utils/theme.js";

const OTP_LENGTH = 6;

/**
 * Three-step forgot password flow:
 *   1. Enter email → sends OTP
 *   2. Enter OTP → verifies code
 *   3. Enter new password → resets password
 */
export function ForgotPasswordScreen({ onBack, onResetSuccess }) {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true })
    ]).start();
  }, [step]);

  // ── Step 1: Send Reset Email ──
  async function handleSendEmail() {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email.trim().toLowerCase());
      setSuccess("If an account exists, a reset code has been sent to your email.");
      setTimeout(() => {
        setSuccess("");
        setStep(2);
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: Verify OTP ──
  function handleOTPChange(text, index) {
    const newOtp = [...otp];
    if (text.length > 1) {
      const chars = text.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
      for (let i = 0; i < OTP_LENGTH; i++) {
        newOtp[i] = chars[i] || "";
      }
      setOtp(newOtp);
      if (chars.length === OTP_LENGTH) Keyboard.dismiss();
      else inputRefs.current[Math.min(chars.length, OTP_LENGTH - 1)]?.focus();
      return;
    }
    newOtp[index] = text.replace(/\D/g, "");
    setOtp(newOtp);
    if (text && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyPress(event, index) {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
  }

  async function handleVerifyOTP() {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await verifyResetOTP(email, code);
      setStep(3);
    } catch (err) {
      setError(err.message || "Invalid reset code.");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  // ── Step 3: Set New Password ──
  async function handleResetPassword() {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const code = otp.join("");
      await resetPassword(email, code, newPassword);
      setSuccess("Password reset successful! Redirecting to sign in...");
      setTimeout(() => onResetSuccess(), 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  const stepConfig = {
    1: { icon: "mail-outline", title: "Forgot Password", color: COLORS.primary },
    2: { icon: "keypad-outline", title: "Enter Reset Code", color: COLORS.primary },
    3: { icon: "lock-closed-outline", title: "New Password", color: COLORS.primary }
  };

  const { icon, title, color } = stepConfig[step];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Progress dots */}
        <View style={styles.progressRow}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                s === step && styles.progressDotActive,
                s < step && styles.progressDotDone
              ]}
            />
          ))}
        </View>

        {/* Header */}
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: `${color}18` }]}>
            <Icon name={icon} size={28} color={color} />
          </View>
        </View>
        <Text style={styles.title}>{title}</Text>

        <Notice message={error} type="error" />
        <Notice message={success} type="success" />

        {/* Step 1: Email */}
        {step === 1 && (
          <>
            <Text style={styles.description}>
              Enter the email address associated with your account. We'll send you a code to reset your password.
            </Text>
            <Input
              keyboardType="email-address"
              label="Email Address"
              onChangeText={setEmail}
              placeholder="student@example.com"
              value={email}
            />
            <Button loading={loading} onPress={handleSendEmail}>
              Send Reset Code
            </Button>
          </>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <>
            <Text style={styles.description}>
              Enter the 6-digit code sent to your email.
            </Text>
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
            <Button loading={loading} onPress={handleVerifyOTP}>
              Verify Code
            </Button>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <>
            <Text style={styles.description}>
              Create a strong new password with at least 8 characters.
            </Text>
            <Input
              label="New Password"
              onChangeText={setNewPassword}
              placeholder="Min 8 characters"
              secureTextEntry
              value={newPassword}
            />
            <Input
              label="Confirm New Password"
              onChangeText={setConfirmPassword}
              placeholder="Re-enter password"
              secureTextEntry
              value={confirmPassword}
            />
            <Button loading={loading} onPress={handleResetPassword}>
              Reset Password
            </Button>
          </>
        )}

        {/* Back button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={step === 1 ? onBack : () => { setError(""); setStep(step - 1); }}
          style={styles.backBtn}
        >
          <Icon name="arrow-back" size={16} color={COLORS.textMuted} />
          <Text style={styles.backText}>
            {step === 1 ? "Back to Sign In" : "Go Back"}
          </Text>
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
  progressRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: SPACING.lg
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
    width: 28,
    borderRadius: 5
  },
  progressDotDone: {
    backgroundColor: COLORS.primaryDark
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: SPACING.md
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.sm
  },
  description: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: SPACING.lg
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
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.lg
  },
  backText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "600"
  }
});
