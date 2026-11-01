import { signToken } from "../config/jwt.js";
import { User } from "../models/User.js";

export async function register({ email, password, displayName, phoneNumber }) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const error = new Error("User already exists with this email.");
    error.status = 409;
    throw error;
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({
    email: normalizedEmail,
    displayName: String(displayName).trim(),
    phoneNumber: phoneNumber ? String(phoneNumber).trim() : undefined,
    passwordHash,
    role: "student",
    status: "active"
  });

  const token = signToken({ userId: user._id, role: user.role });

  return {
    user: {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      status: user.status
    },
    token
  };
}

export async function login({ email, password }) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user || user.status === "deleted") {
    const error = new Error("Invalid email or password.");
    error.status = 401;
    throw error;
  }

  if (user.status === "suspended") {
    const error = new Error("Your account has been suspended.");
    error.status = 403;
    throw error;
  }

  const isMatch = await user.verifyPassword(password);
  if (!isMatch) {
    const error = new Error("Invalid email or password.");
    error.status = 401;
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken({ userId: user._id, role: user.role });

  return {
    user: {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      status: user.status
    },
    token
  };
}
