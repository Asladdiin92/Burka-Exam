import { signToken, signRefreshToken, verifyToken } from "../config/jwt.js";
import { User } from "../models/User.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { AppError, ValidationError, ConflictError, NotFoundError, AuthenticationError, asyncHandler } from "../middleware/errorHandler.middleware.js";
import { generateOTP, sendVerificationEmail, sendPasswordResetEmail } from "../services/email.service.js";
import { logger } from "../config/logger.js";

const OTP_EXPIRY_MINUTES = 15;

export const registerUser = asyncHandler(async (request, response) => {
  const { email, password, displayName, phoneNumber, stream = "natural" } = request.body;

  if (!email || !password || !displayName) {
    throw new ValidationError("Email, password, and displayName are required.");
  }

  if (String(password).length < 8) {
    throw new ValidationError("Password must be at least 8 characters long.");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ConflictError("User already exists with this email.");
  }

  const passwordHash = await User.hashPassword(password);
  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  const user = await User.create({
    email: normalizedEmail,
    displayName,
    phoneNumber,
    passwordHash,
    role: "student",
    stream: ["natural", "social"].includes(stream) ? stream : "natural",
    status: "pending",
    emailVerified: false,
    verificationOTP: otp,
    verificationOTPExpiresAt: otpExpiresAt
  });

  // Send verification email (non-blocking — don't fail registration if email fails)
  sendVerificationEmail(normalizedEmail, otp, displayName).catch((err) => {
    logger.error("Failed to send verification email during registration", {
      userId: user._id,
      error: err.message
    });
  });

  return response.status(201).json({
    message: "Registration successful. Please verify your email with the OTP sent to your inbox.",
    requiresVerification: true,
    user: {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      stream: user.stream,
      isPremium: Boolean(user.isPremium),
      status: user.status,
      emailVerified: user.emailVerified
    }
  });
});

export const verifyEmail = asyncHandler(async (request, response) => {
  const { email, otp } = request.body;

  if (!email || !otp) {
    throw new ValidationError("Email and OTP code are required.");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail })
    .select("+verificationOTP +verificationOTPExpiresAt");

  if (!user) {
    throw new NotFoundError("No account found with this email.");
  }

  if (user.emailVerified) {
    throw new ValidationError("Email is already verified.");
  }

  if (!user.verificationOTP || !user.verificationOTPExpiresAt) {
    throw new ValidationError("No verification code found. Please request a new one.");
  }

  if (new Date() > user.verificationOTPExpiresAt) {
    throw new ValidationError("Verification code has expired. Please request a new one.");
  }

  if (user.verificationOTP !== String(otp).trim()) {
    throw new AuthenticationError("Invalid verification code.");
  }

  // Mark as verified and activate
  user.emailVerified = true;
  user.status = "active";
  user.verificationOTP = undefined;
  user.verificationOTPExpiresAt = undefined;
  await user.save();

  // Issue tokens after verification
  const accessToken = signToken({ userId: user._id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt,
    deviceId: request.headers["user-agent"]
  });

  return response.json({
    message: "Email verified successfully.",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      stream: user.stream,
      isPremium: Boolean(user.isPremium),
      status: user.status,
      emailVerified: user.emailVerified
    }
  });
});

export const resendVerificationOTP = asyncHandler(async (request, response) => {
  const { email } = request.body;

  if (!email) {
    throw new ValidationError("Email is required.");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    // Don't reveal whether the email exists
    return response.json({ message: "If that email is registered, a new verification code has been sent." });
  }

  if (user.emailVerified) {
    throw new ValidationError("Email is already verified.");
  }

  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  user.verificationOTP = otp;
  user.verificationOTPExpiresAt = otpExpiresAt;
  await user.save();

  try {
    await sendVerificationEmail(normalizedEmail, otp, user.displayName);
  } catch (err) {
    logger.error("Failed to send verification email during resend", {
      userId: user._id,
      error: err.message
    });
    throw new AppError("Failed to send verification email. Please check your network or try again later.", 500);
  }

  return response.json({ message: "If that email is registered, a new verification code has been sent." });
});

export const forgotPassword = asyncHandler(async (request, response) => {
  const { email } = request.body;

  if (!email) {
    throw new ValidationError("Email is required.");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  // Always return success to prevent email enumeration
  if (!user || user.status === "deleted") {
    return response.json({ message: "If an account exists with that email, a password reset code has been sent." });
  }

  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  user.resetPasswordOTP = otp;
  user.resetPasswordOTPExpiresAt = otpExpiresAt;
  await user.save();

  try {
    await sendPasswordResetEmail(normalizedEmail, otp, user.displayName);
  } catch (err) {
    logger.error("Failed to send password reset email", {
      userId: user._id,
      error: err.message
    });
    throw new AppError("Failed to send password reset email. Please try again later.", 500);
  }

  return response.json({ message: "If an account exists with that email, a password reset code has been sent." });
});

export const verifyResetOTP = asyncHandler(async (request, response) => {
  const { email, otp } = request.body;

  if (!email || !otp) {
    throw new ValidationError("Email and OTP code are required.");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail })
    .select("+resetPasswordOTP +resetPasswordOTPExpiresAt");

  if (!user) {
    throw new AuthenticationError("Invalid email or reset code.");
  }

  if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiresAt) {
    throw new ValidationError("No reset code found. Please request a new one.");
  }

  if (new Date() > user.resetPasswordOTPExpiresAt) {
    throw new ValidationError("Reset code has expired. Please request a new one.");
  }

  if (user.resetPasswordOTP !== String(otp).trim()) {
    throw new AuthenticationError("Invalid reset code.");
  }

  return response.json({ message: "OTP verified. You can now reset your password.", valid: true });
});

export const resetPassword = asyncHandler(async (request, response) => {
  const { email, otp, newPassword } = request.body;

  if (!email || !otp || !newPassword) {
    throw new ValidationError("Email, OTP code, and new password are required.");
  }

  if (String(newPassword).length < 8) {
    throw new ValidationError("New password must be at least 8 characters long.");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail })
    .select("+resetPasswordOTP +resetPasswordOTPExpiresAt");

  if (!user) {
    throw new AuthenticationError("Invalid email or reset code.");
  }

  if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiresAt) {
    throw new ValidationError("No reset code found. Please request a new one.");
  }

  if (new Date() > user.resetPasswordOTPExpiresAt) {
    throw new ValidationError("Reset code has expired. Please request a new one.");
  }

  if (user.resetPasswordOTP !== String(otp).trim()) {
    throw new AuthenticationError("Invalid reset code.");
  }

  // Update password and clear reset token
  user.passwordHash = await User.hashPassword(newPassword);
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpiresAt = undefined;
  await user.save();

  // Revoke all existing refresh tokens for security
  await RefreshToken.updateMany(
    { userId: user._id, revoked: false },
    { revoked: true, revokedAt: new Date() }
  );

  return response.json({ message: "Password reset successful. Please sign in with your new password." });
});

export const loginUser = asyncHandler(async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    throw new ValidationError("Email and password are required.");
  }

  const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select("+passwordHash");

  if (!user) {
    throw new AuthenticationError("Invalid email or password.");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AuthenticationError("Invalid email or password.");
  }

  // Block unverified users
  if (!user.emailVerified) {
    return response.status(403).json({
      error: "Please verify your email before signing in.",
      requiresVerification: true,
      email: user.email
    });
  }

  if (user.status === "suspended") {
    throw new AuthenticationError("Your account has been suspended. Please contact support.");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = signToken({ userId: user._id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt,
    deviceId: request.headers["user-agent"]
  });

  return response.json({
    message: "Login successful.",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      stream: user.stream || "natural",
      isPremium: Boolean(user.isPremium),
      status: user.status,
      emailVerified: user.emailVerified
    }
  });
});

export const updateStream = asyncHandler(async (request, response) => {
  const { stream } = request.body;
  if (!["natural", "social"].includes(stream)) {
    throw new ValidationError("Stream must be 'natural' or 'social'.");
  }

  const user = await User.findByIdAndUpdate(
    request.user._id,
    { $set: { stream } },
    { new: true }
  );

  return response.json({
    message: `Stream updated to ${stream === "natural" ? "Natural Science" : "Social Science"}.`,
    user: {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      stream: user.stream,
      status: user.status
    }
  });
});

export function me(request, response) {
  return response.json({ user: request.user });
}

export const getProfile = asyncHandler(async (request, response) => {
  const user = await User.findById(request.user._id).select("-passwordHash");
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  return response.json({ user });
});

export const updateProfile = asyncHandler(async (request, response) => {
  const { displayName, phoneNumber, email, telegramLink, qa, notifications } = request.body;

  const updates = {};
  if (displayName) updates.displayName = displayName;
  if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
  if (email) updates.email = email.trim().toLowerCase();
  if (telegramLink !== undefined) updates["profile.telegramLink"] = telegramLink;
  if (qa !== undefined) updates["profile.qa"] = qa;
  if (typeof notifications === "boolean") updates.notifications = notifications;

  const user = await User.findByIdAndUpdate(
    request.user._id,
    { $set: updates },
    { new: true }
  ).select("-passwordHash");

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  return response.json({
    message: "Profile updated successfully.",
    user
  });
});

export const updatePassword = asyncHandler(async (request, response) => {
  const { currentPassword, newPassword } = request.body;

  if (!currentPassword || !newPassword) {
    throw new ValidationError("Current password and new password are required.");
  }

  if (String(newPassword).length < 8) {
    throw new ValidationError("New password must be at least 8 characters long.");
  }

  const user = await User.findById(request.user._id).select("+passwordHash");

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new AuthenticationError("Current password is incorrect.");
  }

  user.passwordHash = await User.hashPassword(newPassword);
  await user.save();

  return response.json({
    message: "Password updated successfully."
  });
});

export const refreshTokenHandler = asyncHandler(async (request, response) => {
  const { refreshToken: token } = request.body;

  if (!token) {
    throw new ValidationError("Refresh token is required.");
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    throw new AuthenticationError("Invalid or expired refresh token.");
  }

  if (!decoded || !decoded.userId) {
    throw new AuthenticationError("Invalid or expired refresh token.");
  }

  const user = await User.findById(decoded.userId);

  if (!user || user.status !== "active") {
    throw new AuthenticationError("Invalid or inactive user.");
  }

  const existingTokenDoc = await RefreshToken.findOne({
    token,
    userId: decoded.userId
  });

  if (existingTokenDoc && existingTokenDoc.revoked) {
    const revokedAgeMs = existingTokenDoc.revokedAt
      ? Date.now() - new Date(existingTokenDoc.revokedAt).getTime()
      : Infinity;

    // Grace window for concurrent refresh requests using the same token within 60s
    if (existingTokenDoc.replacedByToken && revokedAgeMs < 60 * 1000) {
      const graceAccessToken = signToken({ userId: user._id, role: user.role });
      return response.json({
        accessToken: graceAccessToken,
        refreshToken: existingTokenDoc.replacedByToken
      });
    }

    throw new AuthenticationError("Invalid or expired refresh token.");
  }

  if (existingTokenDoc && existingTokenDoc.expiresAt <= new Date()) {
    throw new AuthenticationError("Invalid or expired refresh token.");
  }

  const newAccessToken = signToken({ userId: user._id, role: user.role });
  const newRefreshToken = signRefreshToken({ userId: user._id });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  if (existingTokenDoc) {
    existingTokenDoc.revoked = true;
    existingTokenDoc.revokedAt = new Date();
    existingTokenDoc.replacedByToken = newRefreshToken;
    await existingTokenDoc.save();
  }

  await RefreshToken.findOneAndUpdate(
    { token: newRefreshToken },
    {
      userId: user._id,
      token: newRefreshToken,
      expiresAt,
      revoked: false,
      deviceId: request.headers["user-agent"]
    },
    { upsert: true, new: true }
  );

  return response.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  });
});

export const logout = asyncHandler(async (request, response) => {
  const { refreshToken: token } = request.body;

  if (token) {
    await RefreshToken.updateOne(
      { token, userId: request.user._id },
      { revoked: true, revokedAt: new Date() }
    );
  }

  return response.json({
    message: "Logged out successfully."
  });
});
