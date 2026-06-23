import { caseFollowUpWriteRepository } from "../repositories/case-follow-up.write.repository";
import { validateCaseFollowUpRules } from "./case-follow-up.validation.service";
import { logger } from "@/features/shared/lib/logger";
import prisma from "@/features/shared/lib/prisma";
import { createNotification } from "@/features/notifications/services/notification.write.service";
import { NOTIFICATION_CONFIG } from "@/features/notifications/config/notification.constants";

export async function createCaseFollowUp(data) {
  const validation = await validateCaseFollowUpRules(data);
  if (!validation.success) return validation;

  try {
    const result = await caseFollowUpWriteRepository.create(data);

    // ── Fire-and-forget: notify case creator ───────────────────────────
    notifyFollowUpCaseCreator(data).catch((err) => {
      logger.error("Follow-up notification failed (non-blocking)", { error: err.message });
    });

    return { success: true, data: result };
  } catch (error) {
    logger.error("Failed to create follow-up", { error: error.message });
    return { success: false, error: "Error al crear el seguimiento." };
  }
}

/**
 * Sends a SEGUIMIENTO notification to the case creator.
 * Skips if the actor is the case creator (don't notify yourself).
 * Fire-and-forget — never throws.
 */
async function notifyFollowUpCaseCreator(data) {
  const caseId = Number(data.caseId);

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    select: { requestNumber: true, userId: true },
  });

  if (!caseRecord?.requestNumber || !caseRecord?.userId) return;

  // Don't notify if actor is the case creator
  if (data.userId && caseRecord.userId === data.userId) return;

  const message = NOTIFICATION_CONFIG.TEMPLATES.SEGUIMIENTO(
    caseRecord.requestNumber
  );

  await createNotification({
    caseId,
    type: NOTIFICATION_CONFIG.TYPES.SEGUIMIENTO,
    message,
    recipientUserId: caseRecord.userId,
    actionUserId: data.userId || null,
  });
}

export async function deleteCaseFollowUp(id) {
  try {
    await caseFollowUpWriteRepository.softDelete(id);
    return { success: true, message: "Seguimiento eliminado exitosamente." };
  } catch (error) {
    logger.error("Failed to delete follow-up", { error: error.message, id });
    return { success: false, error: "Error al eliminar el seguimiento." };
  }
}
