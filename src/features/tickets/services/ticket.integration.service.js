/**
 * Integration service: creates a Case from a Ticket.
 * Fire-and-forget — the caller uses .catch() to avoid blocking.
 *
 * Used when an advisor derives a ticket to a case during attention.
 *
 * @param {Object} params
 * @param {number} params.ticketId - The ticket being derived
 * @param {Object} params.caseData - Data for the new case
 * @returns {Promise<{ success: boolean, caseId?: number, error?: string }>}
 */
export async function createCaseFromTicket({ ticketId, caseData }) {
  try {
    // Dynamic import to avoid circular deps at module level
    const { default: prisma } = await import("@/features/shared/lib/prisma");

    // Fetch the ticket to get person data
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(ticketId) },
      include: { person: true, office: true },
    });

    if (!ticket) {
      return { success: false, error: "Turno no encontrado." };
    }

    // Build case data merging ticket info
    const createData = {
      description: caseData.description || ticket.notes || "",
      caseDate: new Date(),
      personId: ticket.personId || caseData.personId || null,
      userId: caseData.userId || ticket.userId || null,
      officeId: ticket.officeId || caseData.officeId || null,
      attentionTypeId: ticket.attentionTypeId || caseData.attentionTypeId || null,
      caseStatusId: caseData.caseStatusId || null,
      caseAreaId: caseData.caseAreaId || null,
      reasonId: caseData.reasonId || null,
      attentionChannelId: caseData.attentionChannelId || null,
      ...caseData,
    };

    const newCase = await prisma.case.create({
      data: createData,
    });

    // Link the ticket to the newly created case
    await prisma.ticket.update({
      where: { id: Number(ticketId) },
      data: { caseId: newCase.id },
    });

    return { success: true, caseId: newCase.id };
  } catch (error) {
    const { logger } = await import("@/features/shared/lib/logger");
    logger.error("Failed to create case from ticket", { error: error.message, ticketId });
    return { success: false, error: "Error al crear el caso desde el turno." };
  }
}
