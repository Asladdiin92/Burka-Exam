import nodemailer from "nodemailer";
import { env } from "./env.js";
import { logger } from "./logger.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.emailUser,
    pass: env.emailPassword
  }
});

/**
 * Send an email using the configured Gmail SMTP transporter.
 * @param {{ to: string, subject: string, html: string }} options
 */
export async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"EthioPrep" <${env.emailUser}>`,
      to,
      subject,
      html
    });
    logger.info("Email sent", { to, subject, messageId: info.messageId });
    return info;
  } catch (error) {
    logger.error("Failed to send email", { to, subject, error: error.message });
    throw error;
  }
}

/**
 * Verify the email transport connection is working.
 */
export async function verifyEmailTransport() {
  try {
    await transporter.verify();
    logger.info("Email transport verified successfully");
    return true;
  } catch (error) {
    logger.warn("Email transport verification failed — emails will not work", {
      error: error.message
    });
    return false;
  }
}
