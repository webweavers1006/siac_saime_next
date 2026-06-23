import prisma from "@/features/shared/lib/prisma";
import { parseDateInput, nowVE } from "@/features/shared/lib/date-utils";
import { logger } from "@/features/shared/lib/logger";
import { createNotification } from "@/features/notifications/services/notification.write.service";
import { NOTIFICATION_CONFIG } from "@/features/notifications/config/notification.constants";
import { sendEmail } from "@/features/sent-emails/services/sent-email.write.service";
import { SENT_EMAIL_CONFIG } from "@/features/sent-emails/config/sent-email.constants";

export async function createCaseForward(data) {
  if (!data.caseId) {
    return { success: false, error: "El caso es requerido." };
  }
  if (!data.administrativeDirectionId) {
    return { success: false, error: "La dirección administrativa es requerida." };
  }

  try {
    // Use a transaction to deactivate previous forwards and create the new one
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deactivate all previous active forwards for this case
      await tx.caseForward.updateMany({
        where: { caseId: Number(data.caseId), isActive: true, deletedAt: null },
        data: { isActive: false },
      });

      // 2. Create the new forward as active
      return await tx.caseForward.create({
        data: {
          caseId: Number(data.caseId),
          administrativeDirectionId: Number(data.administrativeDirectionId),
          userId: data.userId,
          isActive: true,
          date: data.date ? parseDateInput(data.date) : nowVE(),
          description: data.description?.trim() || null,
        },
      });
    });

    // ── Fire-and-forget: notify users in destination direction ─────────
    notifyForwardRecipients(data).catch((err) => {
      logger.error("Forward notification failed (non-blocking)", { error: err.message });
    });

    // ── Fire-and-forget: email citizen about forward ───────────────────
    notifyEmailCaseForwarded(data).catch((err) => {
      logger.error("Forward email failed (non-blocking)", { error: err.message });
    });

    return { success: true, data: result };
  } catch (error) {
    logger.error("Failed to create forward", { error: error.message });
    return { success: false, error: "Error al registrar la remisión." };
  }
}

/**
 * Sends REMISION notifications to all users in the destination
 * administrative direction. Fire-and-forget — never throws.
 */
async function notifyForwardRecipients(data) {
  const caseId = Number(data.caseId);
  const directionId = Number(data.administrativeDirectionId);

  // Fetch case requestNumber + actor's direction name in parallel
  const [caseRecord, actorUser, usersInDirection] = await Promise.all([
    prisma.case.findUnique({
      where: { id: caseId },
      select: { requestNumber: true },
    }),
    data.userId
      ? prisma.user.findUnique({
          where: { id: data.userId },
          select: {
            administrativeDirectionId: true,
            administrativeDirection: { select: { name: true } },
          },
        })
      : null,
    prisma.user.findMany({
      where: {
        administrativeDirectionId: directionId,
        deletedAt: null,
      },
      select: { id: true },
    }),
  ]);

  if (!caseRecord?.requestNumber || usersInDirection.length === 0) return;

  const originName = actorUser?.administrativeDirection?.name || "otra dirección";
  const message = NOTIFICATION_CONFIG.TEMPLATES.REMISION(
    caseRecord.requestNumber,
    originName
  );

  // Create one notification per user in the destination direction
  const notifications = usersInDirection.map((u) =>
    createNotification({
      caseId,
      type: NOTIFICATION_CONFIG.TYPES.REMISION,
      message,
      recipientUserId: u.id,
      actionUserId: data.userId || null,
      originDirectionId: actorUser?.administrativeDirectionId ?? null,
    })
  );

  await Promise.allSettled(notifications);
}

/**
 * Dispatches CASE_FORWARDED emails to:
 *  1. The citizen associated with the case.
 *  2. The destination direction's institutional email.
 * Fire-and-forget — never throws.
 */
async function notifyEmailCaseForwarded(data) {
  const caseId = Number(data.caseId);
  const directionId = Number(data.administrativeDirectionId);

  const [caseRecord, direction] = await Promise.all([
    prisma.case.findUnique({
      where: { id: caseId },
      select: {
        requestNumber: true,
        caseDate: true,
        caseStatus: { select: { name: true } },
        attentionType: { select: { name: true } },
        reason: { select: { name: true } },
        person: { select: { firstName: true, lastName: true, email: true } },
      },
    }),
    prisma.administrativeDirection.findUnique({
      where: { id: directionId },
      select: { name: true, email: true },
    }),
  ]);

  if (!caseRecord) return;

  const directionName = direction?.name || "la dirección correspondiente";

  // Collect unique recipients (citizen + direction email)
  const recipients = [];

  // 1. Citizen
  if (caseRecord.person?.email) {
    const citizenName = [caseRecord.person.firstName, caseRecord.person.lastName]
      .filter(Boolean).join(" ") || "ciudadano";
    recipients.push({
      email: caseRecord.person.email,
      name: citizenName,
    });
  }

  // 2. Direction's institutional email (not individual users)
  if (direction?.email && !recipients.some((r) => r.email === direction.email)) {
    recipients.push({
      email: direction.email,
      name: directionName,
    });
  }

  if (recipients.length === 0) return;

  for (const { email, name } of recipients) {
    await sendEmail({
      type: SENT_EMAIL_CONFIG.REASONS.CASE_FORWARDED,
      caseId,
      userId: data.userId,
      recipients: [email],
      data: {
        citizenName: name,
        caseNumber: caseRecord.requestNumber || `#${caseId}`,
        caseDate: caseRecord.caseDate?.toISOString() || undefined,
        reason: caseRecord.reason?.name || caseRecord.attentionType?.name,
        status: caseRecord.caseStatus?.name,
        directionName,
        attentionType: caseRecord.attentionType?.name,
      },
    });
  }
}

export async function deleteCaseForward(id) {
  try {
    await caseForwardWriteRepository.softDelete(id);
    return { success: true, message: "Remisión eliminada exitosamente." };
  } catch (error) {
    logger.error("Failed to delete forward", { error: error.message, id });
    return { success: false, error: "Error al eliminar la remisión." };
  }
}
