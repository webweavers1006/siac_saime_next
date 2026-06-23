import { ticketReadRepository } from "../repositories/ticket.read.repository";
import { findUserOfficeById } from "@/features/users/repositories/user.read.repository";
import { TICKET_CONFIG } from "../config/ticket.constants";
import { logger } from "@/features/shared";

export async function fetchTicketsList(session, { page, pageSize, searchTerm, sortKey, sortDirection, officeId, status, attentionTypeId, dateFrom, dateTo } = {}) {
  const safePageSize = Number(pageSize) || TICKET_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
  const safePage = Number(page) || 1;
  try {
    const safeSearchTerm = searchTerm?.trim() || "";

    const [ticketsResult, userOffice] = await Promise.all([
      ticketReadRepository.findMany({
        page: safePage,
        pageSize: safePageSize,
        searchTerm: safeSearchTerm,
        sortKey: sortKey || "createdAt",
        sortDirection: sortDirection || "desc",
        officeId: officeId ? Number(officeId) : null,
        status: status || null,
        attentionTypeId: attentionTypeId ? Number(attentionTypeId) : null,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
      }),
      session?.id ? findUserOfficeById(session.id) : null,
    ]);

    return {
      items: ticketsResult.items,
      totalCount: ticketsResult.totalCount,
      page: ticketsResult.page,
      pageSize: ticketsResult.pageSize,
      totalPages: ticketsResult.totalPages,
      userOfficeId: userOffice?.officeId || null,
    };
  } catch (error) {
    logger.error("Failed to fetch tickets list", { error: error.message });
    return { items: [], totalCount: 0, page: 1, pageSize: safePageSize, totalPages: 1, userOfficeId: null };
  }
}

export async function fetchTicketById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await ticketReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch ticket by id", { error: error.message, ticketId: id });
    throw new Error("No se pudo obtener el turno.");
  }
}

export async function fetchDisplayPanel(officeId) {
  try {
    return await ticketReadRepository.findDisplayData(officeId);
  } catch (error) {
    logger.error("Failed to fetch display panel", { error: error.message, officeId });
    return { activeTickets: [], waitingCount: 0, attendedToday: 0 };
  }
}

export async function fetchAdvisorQueue(userId, officeId) {
  try {
    return await ticketReadRepository.findAdvisorQueue(userId, officeId);
  } catch (error) {
    logger.error("Failed to fetch advisor queue", { error: error.message, userId, officeId });
    return { currentTicket: null, waitingTickets: [] };
  }
}

export async function fetchAdvisorOffice(userId) {
  try {
    const { default: prisma } = await import("@/features/shared/lib/prisma");
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { officeId: true } });
    return user?.officeId || null;
  } catch {
    return null;
  }
}
