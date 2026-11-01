import crypto from "node:crypto";
import { sendEmail } from "../config/email.js";

/**
 * Generate a secure 6-digit numeric OTP.
 * @returns {string}
 */
export function generateOTP() {
  // crypto.randomInt produces a cryptographically strong random integer
  return String(crypto.randomInt(100000, 999999));
}

/**
 * Send a verification OTP email to a new user.
 */
export async function sendVerificationEmail(email, otp, displayName) {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
      <div style="background: linear-gradient(135deg, #1a73e8, #0d47a1); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">EthioPrep</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Ethiopian Entrance Exam Preparation</p>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #1a1a2e; margin: 0 0 8px; font-size: 20px;">Verify Your Email</h2>
        <p style="color: #555; line-height: 1.6; margin: 0 0 24px;">
          Hi <strong>${displayName}</strong>, welcome to EthioPrep! Use the code below to verify your email address. This code expires in <strong>15 minutes</strong>.
        </p>
        <div style="background: #f0f4ff; border: 2px dashed #1a73e8; border-radius: 10px; padding: 20px; text-align: center; margin: 0 0 24px;">
          <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #1a73e8; font-family: 'Courier New', monospace;">${otp}</span>
        </div>
        <p style="color: #888; font-size: 13px; line-height: 1.5; margin: 0;">
          If you didn't create an EthioPrep account, you can safely ignore this email.
        </p>
      </div>
      <div style="background: #f8f9fa; padding: 16px 24px; text-align: center; border-top: 1px solid #e8e8e8;">
        <p style="color: #aaa; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} EthioPrep. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `${otp} — Verify your EthioPrep account`,
    html
  });
}

/**
 * Send a password reset OTP email.
 */
export async function sendPasswordResetEmail(email, otp, displayName) {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
      <div style="background: linear-gradient(135deg, #e53935, #b71c1c); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">EthioPrep</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Password Reset Request</p>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #1a1a2e; margin: 0 0 8px; font-size: 20px;">Reset Your Password</h2>
        <p style="color: #555; line-height: 1.6; margin: 0 0 24px;">
          Hi <strong>${displayName}</strong>, we received a request to reset your password. Use the code below. This code expires in <strong>15 minutes</strong>.
        </p>
        <div style="background: #fff5f5; border: 2px dashed #e53935; border-radius: 10px; padding: 20px; text-align: center; margin: 0 0 24px;">
          <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #e53935; font-family: 'Courier New', monospace;">${otp}</span>
        </div>
        <p style="color: #888; font-size: 13px; line-height: 1.5; margin: 0;">
          If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
        </p>
      </div>
      <div style="background: #f8f9fa; padding: 16px 24px; text-align: center; border-top: 1px solid #e8e8e8;">
        <p style="color: #aaa; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} EthioPrep. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `${otp} — Reset your EthioPrep password`,
    html
  });
}
