import { sentEmailWriteRepository } from "../repositories/sent-email.write.repository";
import { sentEmailReadRepository } from "../repositories/sent-email.read.repository";
import { buildEmail } from "../templates/email-templates";
import { sendEmailViaSmtp } from "../lib/smtp-transport";
import { SENT_EMAIL_CONFIG } from "../config/sent-email.constants";
import { logger } from "@/features/shared/lib/logger";

const { STATUS } = SENT_EMAIL_CONFIG;

/**
 * Orchestrates the full email send pipeline:
 *   1. Build subject + HTML from templates
 *   2. Send via SMTP transport (fire-and-forget per recipient)
 *   3. Record result in SentEmail audit table
 *
 * Fire-and-forget — never throws to the caller.
 * Logs errors internally so the main operation doesn't fail.
 *
 * @param {Object} params
 * @param {string} params.type - One of SENT_EMAIL_CONFIG.REASONS.
 * @param {number} params.caseId
 * @param {string} params.userId - UUID of the user triggering the send.
 * @param {string[]} params.recipients - Array of email addresses.
 * @param {Object} params.data - Template variables:
 *   { citizenName, caseNumber, caseDate?, reason?, status?, directionName?, attentionType? }
 * @returns {Promise<void>}
 */
export async function sendEmail({ type, caseId, userId, recipients, data, attachments }) {
  const { subject, html } = buildEmail({ type, data });

  for (const toAddress of recipients) {
    let status = STATUS.SENT;
    let errorMessage = null;

    // 1. Attempt SMTP delivery
    const smtpResult = await sendEmailViaSmtp({ to: toAddress, subject, html, attachments });

    if (!smtpResult.success) {
      status = STATUS.FAILED;
      errorMessage = smtpResult.error;
    }

    // 2. Record the attempt (always)
    try {
      await sentEmailWriteRepository.create({
        toAddress,
        subject,
        reason: type,
        status,
        caseId,
        userId,
        errorMessage,
        sentAt: new Date(),
      });
    } catch (repoError) {
      logger.error("Failed to record sent email (non-blocking)", {
        error: repoError.message,
        toAddress,
        type,
        caseId,
      });
    }
  }
}

/**
 * Resends a previously sent email using current case data.
 * Fetches the original record, rebuilds the template with fresh data,
 * and dispatches a new email (new audit record).
 *
 * @param {number} sentEmailId - ID of the original SentEmail record.
 * @param {string} actorUserId - UUID of the user performing the resend.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function resendEmail(sentEmailId, actorUserId) {
  // 1. Fetch original record
  const original = await sentEmailReadRepository.findById(sentEmailId);
  if (!original) {
    return { success: false, error: "Correo original no encontrado." };
  }

  // 2. Fetch current case + person data to rebuild template
  const caseRecord = original.caseId
    ? await sentEmailReadRepository.findCaseDataForResend(original.caseId)
    : null;

  const citizenName = caseRecord?.person
    ? [caseRecord.person.firstName, caseRecord.person.lastName]
        .filter(Boolean).join(" ") || "ciudadano"
    : original.toAddress;

  // 3. Rebuild and send using current data
  await sendEmail({
    type: original.reason,
    caseId: original.caseId,
    userId: actorUserId,
    recipients: [original.toAddress],
    data: {
      citizenName,
      caseNumber: caseRecord?.requestNumber || original.caseNumber || `#${original.caseId || "—"}`,
      caseDate: caseRecord?.caseDate?.toISOString() || undefined,
      reason: caseRecord?.reason?.name || caseRecord?.attentionType?.name,
      status: caseRecord?.caseStatus?.name,
      attentionType: caseRecord?.attentionType?.name,
    },
  });

  return { success: true };
}
