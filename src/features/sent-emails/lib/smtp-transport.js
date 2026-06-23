import nodemailer from "nodemailer";
import { SENT_EMAIL_CONFIG } from "../config/sent-email.constants";
import { logger } from "@/features/shared/lib/logger";

const { SMTP } = SENT_EMAIL_CONFIG;

/** @type {import('nodemailer').Transporter|null} */
let transporter = null;

/**
 * Returns (or creates) a reusable pooled nodemailer transporter.
 * Falls back to jsonTransport (console log) when SMTP is not configured.
 *
 * @returns {import('nodemailer').Transporter}
 */
function getTransporter() {
  if (transporter) return transporter;

  if (!SMTP.HOST || !SMTP.USER || !SMTP.PASS) {
    logger.warn("SMTP not configured — emails will be logged but not sent", {
      hasHost: !!SMTP.HOST,
      hasUser: !!SMTP.USER,
      hasPass: !!SMTP.PASS,
    });
    transporter = nodemailer.createTransport({
      jsonTransport: true,
    });
  } else {
    transporter = nodemailer.createTransport({
      host: SMTP.HOST,
      port: SMTP.PORT,
      secure: SMTP.SECURE,
      auth: {
        user: SMTP.USER,
        pass: SMTP.PASS,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });
  }

  return transporter;
}

/**
 * Sends a single email via SMTP.
 * This is the ONLY place in the codebase that knows about nodemailer.
 *
 * @param {Object} params
 * @param {string} params.to - Recipient email address.
 * @param {string} params.subject - Email subject.
 * @param {string} params.html - HTML body.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendEmailViaSmtp({ to, subject, html, attachments }) {
  const transport = getTransporter();

  try {
    await transport.sendMail({
      from: `"${SMTP.FROM_NAME}" <${SMTP.FROM_ADDRESS}>`,
      to,
      subject,
      html,
      attachments: attachments || [],
    });
    return { success: true };
  } catch (error) {
    const message = error.message?.slice(0, 1000) || "Unknown SMTP error";
    logger.error("SMTP send failed", { to, subject, error: message });
    return { success: false, error: message };
  }
}
