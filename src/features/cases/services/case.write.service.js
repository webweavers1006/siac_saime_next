import { caseWriteRepository } from "../repositories/case.write.repository";
import { validateCaseRules } from "./case.validation.service";
import prisma from "@/features/shared/lib/prisma";
import { createNotification } from "@/features/notifications/services/notification.write.service";
import { NOTIFICATION_CONFIG } from "@/features/notifications/config/notification.constants";
import { sendEmail } from "@/features/sent-emails/services/sent-email.write.service";
import { SENT_EMAIL_CONFIG } from "@/features/sent-emails/config/sent-email.constants";
import { attachPlanillaToEmail } from "@/features/case-sheets/services/case-sheet.integration.service";
import { logger } from "@/features/shared/lib/logger";

export async function createCase(data) {
  const validation = await validateCaseRules(data);
  if (!validation.success) return validation;

  try {
    const result = await caseWriteRepository.create(data);

    // ── Fire-and-forget: send email if attentionType.sendEmail ─────────
    if (data.attentionTypeId && data.personId) {
      notifyEmailCaseCreated(result.id, data).catch((err) => {
        logger.error("Case created email failed (non-blocking)", { error: err.message });
      });
    }

    return { success: true, data: result, message: "Caso creado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al crear el caso." };
  }
}

export async function updateCase(id, data, actorUserId = null) {
  const validation = await validateCaseRules(data, id);
  if (!validation.success) return validation;

  try {
    // Snapshot previous status BEFORE update (for CIERRE notification)
    let previousStatusId = null;
    let caseCreatorId = null;
    let caseRequestNumber = null;

    if (data.caseStatusId != null) {
      const snapshot = await prisma.case.findUnique({
        where: { id: Number(id) },
        select: { caseStatusId: true, userId: true, requestNumber: true },
      });
      previousStatusId = snapshot?.caseStatusId ?? null;
      caseCreatorId = snapshot?.userId ?? null;
      caseRequestNumber = snapshot?.requestNumber ?? null;
    }

    const result = await caseWriteRepository.update(id, data);

    // ── Fire-and-forget: notify case creator on closure ────────────────
    if (
      data.caseStatusId != null &&
      Number(data.caseStatusId) === 2 &&
      previousStatusId !== 2 &&
      caseRequestNumber &&
      caseCreatorId
    ) {
      notifyCaseClosure(caseRequestNumber, caseCreatorId, id, actorUserId).catch((err) => {
        logger.error("Case closure notification failed (non-blocking)", { error: err.message });
      });

      // Also dispatch closure email to the citizen
      notifyEmailCaseClosed(id, caseRequestNumber, actorUserId).catch((err) => {
        logger.error("Case closure email failed (non-blocking)", { error: err.message });
      });
    }

    return { success: true, data: result, message: "Caso actualizado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al actualizar el caso." };
  }
}

/**
 * Sends a CIERRE notification to the case creator.
 * Only called when status changes TO "Cerrado" (id: 2) FROM something else.
 * Fire-and-forget — never throws.
 */
async function notifyCaseClosure(requestNumber, creatorUserId, caseId, actorUserId) {
  const message = NOTIFICATION_CONFIG.TEMPLATES.CIERRE(requestNumber);

  await createNotification({
    caseId: Number(caseId),
    type: NOTIFICATION_CONFIG.TYPES.CIERRE,
    message,
    recipientUserId: creatorUserId,
    actionUserId: actorUserId || null,
  });
}

/**
 * Dispatches a CASE_CREATED email to the citizen, if attentionType.sendEmail is true.
 * Fetches person email + attention type flag after the case is persisted.
 * Fire-and-forget — never throws.
 */
async function notifyEmailCaseCreated(caseId, data) {
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    select: {
      requestNumber: true,
      caseDate: true,
      caseStatus: { select: { name: true } },
      attentionType: { select: { sendEmail: true, name: true } },
      reason: { select: { name: true } },
      person: { select: { firstName: true, lastName: true, email: true } },
    },
  });

  if (!caseRecord?.attentionType?.sendEmail) {
    logger.info("Email skipped: attentionType.sendEmail is false", {
      caseId,
      attentionTypeId: caseRecord?.attentionType ? "present" : "missing",
      sendEmail: caseRecord?.attentionType?.sendEmail,
    });
    return;
  }
  if (!caseRecord?.person?.email) {
    logger.info("Email skipped: person has no email", { caseId });
    return;
  }

  const citizenName = [caseRecord.person.firstName, caseRecord.person.lastName]
    .filter(Boolean).join(" ") || "ciudadano";

  // Generate planilla PDF attachment (fire-and-forget safe, returns [] on failure)
  const attachments = await attachPlanillaToEmail(caseId).catch(() => []);

  await sendEmail({
    type: SENT_EMAIL_CONFIG.REASONS.CASE_CREATED,
    caseId,
    userId: data.userId,
    recipients: [caseRecord.person.email],
    data: {
      citizenName,
      caseNumber: caseRecord.requestNumber || `#${caseId}`,
      caseDate: caseRecord.caseDate?.toISOString() || undefined,
      reason: caseRecord.reason?.name || caseRecord.attentionType?.name,
      status: caseRecord.caseStatus?.name,
      attentionType: caseRecord.attentionType?.name,
    },
    attachments,
  });
}

/**
 * Dispatches a CASE_CLOSED email to the citizen.
 * Fetches person email from the case.
 * Fire-and-forget — never throws.
 */
async function notifyEmailCaseClosed(caseId, requestNumber, actorUserId) {
  const caseRecord = await prisma.case.findUnique({
    where: { id: Number(caseId) },
    select: {
      caseDate: true,
      caseStatus: { select: { name: true } },
      attentionType: { select: { name: true } },
      reason: { select: { name: true } },
      person: { select: { firstName: true, lastName: true, email: true } },
      userId: true,
    },
  });

  if (!caseRecord?.person?.email) return;

  const citizenName = [caseRecord.person.firstName, caseRecord.person.lastName]
    .filter(Boolean).join(" ") || "ciudadano";

  await sendEmail({
    type: SENT_EMAIL_CONFIG.REASONS.CASE_CLOSED,
    caseId: Number(caseId),
    userId: actorUserId || caseRecord.userId,
    recipients: [caseRecord.person.email],
    data: {
      citizenName,
      caseNumber: requestNumber || `#${caseId}`,
      caseDate: caseRecord.caseDate?.toISOString() || undefined,
      reason: caseRecord.reason?.name || caseRecord.attentionType?.name,
      status: caseRecord.caseStatus?.name,
      attentionType: caseRecord.attentionType?.name,
    },
  });
}

export async function deleteCase(id) {
  try {
    await caseWriteRepository.softDelete(id);
    return { success: true, message: "Caso eliminado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al eliminar el caso." };
  }
}
