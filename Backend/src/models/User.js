import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";

const profileSchema = new mongoose.Schema(
  {
    school: { type: String, trim: true, maxlength: 160 },
    grade: { type: String, trim: true, maxlength: 40 },
    region: { type: String, trim: true, maxlength: 80 },
    preferredLanguage: {
      type: String,
      enum: ["en", "am", "om", "ti"],
      default: "en"
    },
    telegramLink: { type: String, trim: true, maxlength: 255 },
    qa: { type: String, trim: true, maxlength: 500 }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254
    },
    phoneNumber: { type: String, unique: true, sparse: true, trim: true },
    displayName: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["student", "teacher", "cash_manager", "content_manager", "admin"],
      default: "student"
    },
    stream: {
      type: String,
      enum: ["natural", "social"],
      default: "natural"
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "deleted"],
      default: "pending"
    },
    profile: { type: profileSchema, default: () => ({}) },
    notifications: {
      type: Boolean,
      default: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    verificationOTP: { type: String, select: false },
    verificationOTPExpiresAt: { type: Date, select: false },
    resetPasswordOTP: { type: String, select: false },
    resetPasswordOTPExpiresAt: { type: Date, select: false },
    lastLoginAt: Date
  },
  { timestamps: true, collection: "users" }
);

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hash(password, env.bcryptSaltRounds);
};

userSchema.set("toJSON", {
  transform: (_document, returned) => {
    delete returned.passwordHash;
    delete returned.__v;
    return returned;
  }
});

userSchema.index({ status: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ stream: 1, status: 1 });

export const User = mongoose.model("User", userSchema);
