import nodemailer from "nodemailer";
import { env } from "./env.js";
import { logger } from "./logger.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.emailUser,
    pass: env.emailPassword
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000
});

/**
 * Send an email via HTTPS REST API (Resend / Brevo) or SMTP fallback.
 * @param {{ to: string, subject: string, html: string }} options
 */
export async function sendEmail({ to, subject, html }) {
  // Option 1: Resend HTTPS API (Port 443 — works seamlessly on Render)
  if (env.resendApiKey) {
    try {
      const fromAddress = env.emailUser ? `Burka Exam <${env.emailUser}>` : "Burka Exam <onboarding@resend.dev>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: fromAddress,
          to: Array.isArray(to) ? to : [to],
          subject,
          html
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Resend error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      logger.info("Email sent via Resend API", { to, subject, id: data.id });
      return data;
    } catch (error) {
      logger.error("Failed to send email via Resend API", { to, subject, error: error.message });
      throw error;
    }
  }

  // Option 2: Brevo HTTPS API (Port 443 — works seamlessly on Render)
  if (env.brevoApiKey) {
    try {
      const senderEmail = env.emailUser || "burkamuhammed3@gmail.com";
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": env.brevoApiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sender: { name: "Burka Exam", email: senderEmail },
          to: [{ email: to }],
          subject,
          htmlContent: html
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Brevo error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      logger.info("Email sent via Brevo API", { to, subject, messageId: data.messageId });
      return data;
    } catch (error) {
      logger.error("Failed to send email via Brevo API", { to, subject, error: error.message });
      throw error;
    }
  }

  // Option 3: Standard SMTP (port 587/465 — blocked on Render free tier, works on local development)
  try {
    const info = await transporter.sendMail({
      from: `"Burka Exam" <${env.emailUser || "noreply@burkaexam.com"}>`,
      to,
      subject,
      html
    });
    logger.info("Email sent via SMTP", { to, subject, messageId: info.messageId });
    return info;
  } catch (error) {
    logger.error("Failed to send email via SMTP", { to, subject, error: error.message });
    throw error;
  }
}

/**
 * Verify the email transport connection is working.
 */
export async function verifyEmailTransport() {
  if (env.resendApiKey || env.brevoApiKey) {
    logger.info("Email transport verified (using HTTPS REST API)");
    return true;
  }

  try {
    await transporter.verify();
    logger.info("Email transport verified successfully");
    return true;
  } catch (error) {
    logger.warn("Email transport verification failed — SMTP ports may be blocked on Render", {
      error: error.message
    });
    return false;
  }
}
