import { ticketWriteRepository } from "../repositories/ticket.write.repository";
import { ticketReadRepository } from "../repositories/ticket.read.repository";
import { TICKET_CONFIG } from "../config/ticket.constants";
import { logger } from "@/features/shared/lib/logger";

/**
 * Generates the next ticket number based on office + attention type counter.
 */
async function generateTicketNumber(officeId, attentionTypeId) {
  const prefix = TICKET_CONFIG.PREFIX_MAP[attentionTypeId] || TICKET_CONFIG.DEFAULT_PREFIX;
  const nextNumber = await ticketWriteRepository.incrementCounter(officeId, attentionTypeId, prefix);
  return `${prefix}-${String(nextNumber).padStart(3, "0")}`;
}

/**
 * Validates that a status transition is allowed.
 */
function isValidTransition(currentStatus, newStatus) {
  const allowed = TICKET_CONFIG.TRANSITIONS[currentStatus];
  return allowed && allowed.includes(newStatus);
}

export async function createTicket({ attentionTypeId, officeId, personId, personIdCard, personFirstName, personLastName, personPhone, serviceType, notes }) {
  try {
    const ticketNumber = await generateTicketNumber(officeId, attentionTypeId);

    let finalPersonId = personId || null;

    // If no personId but we have person data, find or create the person
    if (!finalPersonId && personIdCard) {
      const { default: prisma } = await import("@/features/shared/lib/prisma");
      const existing = await prisma.person.findFirst({
        where: { idCard: personIdCard, deletedAt: null },
      });
      if (existing) {
        finalPersonId = existing.id;
      } else if (personFirstName) {
        const created = await prisma.person.create({
          data: {
            firstName: personFirstName.trim(),
            lastName: personLastName?.trim() || null,
            idCard: personIdCard.trim(),
            phone: personPhone?.trim() || null,
          },
        });
        finalPersonId = created.id;
      }
    }

    const ticket = await ticketWriteRepository.create({
      ticketNumber,
      status: TICKET_CONFIG.STATUS.WAITING,
      officeId,
      attentionTypeId,
      personId: finalPersonId,
      serviceType: serviceType || null,
      notes,
    });

    logger.info("Ticket created", { ticketId: ticket.id, ticketNumber });
    return { success: true, data: ticket, message: `Turno ${ticketNumber} generado.` };
  } catch (error) {
    logger.error("Failed to create ticket", { error: error.message });
    return { success: false, error: "Error al generar el turno." };
  }
}

export async function callNextTicket(officeId, userId, deskNumber, serviceType) {
  try {
    const next = await ticketReadRepository.findNextWaiting(officeId, serviceType || null);
    if (!next) {
      return { success: false, error: TICKET_CONFIG.UI.LABELS.MESSAGES.ERROR.NO_WAITING };
    }

    const updated = await ticketWriteRepository.updateStatus(next.id, TICKET_CONFIG.STATUS.CALLED, {
      userId,
      deskNumber: deskNumber || null,
      calledAt: new Date(),
    });

    logger.info("Ticket called", { ticketId: updated.id, ticketNumber: updated.ticketNumber, userId });
    return { success: true, data: updated, message: `Turno ${updated.ticketNumber} llamado.` };
  } catch (error) {
    logger.error("Failed to call next ticket", { error: error.message, officeId });
    return { success: false, error: "Error al llamar el siguiente turno." };
  }
}

export async function updateTicketStatus(id, newStatus, userId, extra = {}) {
  try {
    const current = await ticketReadRepository.findById(id);
    if (!current) {
      return { success: false, error: "Turno no encontrado." };
    }

    if (!isValidTransition(current.status, newStatus)) {
      return { success: false, error: `No se puede pasar de "${current.status}" a "${newStatus}".` };
    }

    const updateData = { userId };

    if (newStatus === TICKET_CONFIG.STATUS.IN_ATTENTION) {
      updateData.startedAt = new Date();
    }
    if (newStatus === TICKET_CONFIG.STATUS.FINISHED) {
      updateData.finishedAt = new Date();
    }
    if (extra.deskNumber) {
      updateData.deskNumber = extra.deskNumber;
    }
    if (extra.caseId) {
      updateData.caseId = extra.caseId;
    }

    const updated = await ticketWriteRepository.updateStatus(id, newStatus, updateData);

    logger.info("Ticket status updated", { ticketId: id, newStatus, userId });
    return { success: true, data: updated, message: `Turno actualizado a "${TICKET_CONFIG.STATUS_LABELS[newStatus]}".` };
  } catch (error) {
    logger.error("Failed to update ticket status", { error: error.message, ticketId: id });
    return { success: false, error: "Error al actualizar el turno." };
  }
}

export async function cancelTicket(id, userId) {
  try {
    const current = await ticketReadRepository.findById(id);
    if (!current) {
      return { success: false, error: "Turno no encontrado." };
    }

    const updated = await ticketWriteRepository.updateStatus(id, TICKET_CONFIG.STATUS.CANCELLED, {
      userId,
      finishedAt: new Date(),
    });

    logger.info("Ticket cancelled", { ticketId: id, userId });
    return { success: true, data: updated, message: "Turno cancelado." };
  } catch (error) {
    logger.error("Failed to cancel ticket", { error: error.message, ticketId: id });
    return { success: false, error: "Error al cancelar el turno." };
  }
}
