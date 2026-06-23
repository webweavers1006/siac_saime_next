"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { SENT_EMAIL_CONFIG } from "../config/sent-email.constants";
import { sendEmail, resendEmail } from "../services/sent-email.write.service";
import { sendEmailSchema } from "../schemas/sent-email.schema";
import { logger } from "@/features/shared/lib/logger";

/**
 * Dispatches an email (build + send + audit record).
 *
 * Called internally by other features (cases, forwards, follow-ups)
 * when an email notification should be sent to the citizen.
 *
 * Fire-and-forget — wraps sendEmail() in a try/catch so the caller
 * never receives an error, even if SMTP is down.
 *
 * @param {Object} params — see sendEmailSchema for shape.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const dispatchEmailAction = createProtectedFunction(
  SENT_EMAIL_CONFIG.PERMISSIONS.READ,
  async (params) => {
    // Validate input
    const parsed = sendEmailSchema.safeParse(params);
    if (!parsed.success) {
      return {
        success: false,
        error: "Datos inválidos para envío de correo.",
        details: parsed.error.flatten().fieldErrors,
      };
    }

    try {
      await sendEmail(parsed.data);
      return { success: true };
    } catch (error) {
      logger.error("dispatchEmailAction failed (non-blocking)", {
        error: error.message,
        type: parsed.data?.type,
        caseId: parsed.data?.caseId,
      });
      return { success: false, error: "Error al enviar el correo." };
    }
  }
);

/**
 * Resends a previously sent email using current case data.
 * Called from the "Correos Enviados" admin page.
 *
 * @param {{ sentEmailId: number }} params
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const resendEmailAction = createProtectedFunction(
  SENT_EMAIL_CONFIG.PERMISSIONS.READ,
  async ({ sentEmailId }, session) => {
    if (!sentEmailId) {
      return { success: false, error: "ID de correo requerido." };
    }

    try {
      const result = await resendEmail(Number(sentEmailId), session.id);
      return result;
    } catch (error) {
      logger.error("resendEmailAction failed", {
        error: error.message,
        sentEmailId,
      });
      return { success: false, error: "Error al reenviar el correo." };
    }
  }
);
