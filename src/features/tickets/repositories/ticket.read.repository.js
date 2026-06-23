import prisma from "@/features/shared/lib/prisma";
import { ticketMapper } from "../mappers/ticket.mapper";

const TICKET_INCLUDE = {
  office: { select: { name: true } },
  attentionType: { select: { name: true } },
  user: { select: { firstName: true, lastName: true } },
  person: { select: { firstName: true, lastName: true, idCard: true } },
};

export const ticketReadRepository = {
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection, officeId, status, attentionTypeId, dateFrom, dateTo }) {
    const skip = (page - 1) * pageSize;
    const dbKey = ticketMapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "desc" };

    const where = {
      ...(searchTerm && {
        OR: [
          { ticketNumber: { contains: searchTerm, mode: "insensitive" } },
          { person: { firstName: { contains: searchTerm, mode: "insensitive" } } },
          { person: { lastName: { contains: searchTerm, mode: "insensitive" } } },
          { person: { idCard: { contains: searchTerm, mode: "insensitive" } } },
        ],
      }),
      ...(officeId && { officeId: Number(officeId) }),
      ...(status && { status }),
      ...(attentionTypeId && { attentionTypeId: Number(attentionTypeId) }),
      ...(dateFrom && { createdAt: { gte: new Date(dateFrom) } }),
      ...(dateTo && { createdAt: { lte: new Date(dateTo + "T23:59:59.999Z") } }),
      deletedAt: null,
    };

    const [totalCount, items] = await Promise.all([
      prisma.ticket.count({ where }),
      prisma.ticket.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: TICKET_INCLUDE,
      }),
    ]);

    return {
      items: ticketMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.ticket.findUnique({
      where: { id: Number(id) },
      include: TICKET_INCLUDE,
    });
    return ticketMapper.toDomain(item);
  },

  async findByTicketNumber(ticketNumber) {
    const item = await prisma.ticket.findUnique({
      where: { ticketNumber },
      include: TICKET_INCLUDE,
    });
    return ticketMapper.toDomain(item);
  },

  /**
   * Returns the current queue for a display screen (TV/lobby).
   * Shows: currently called/in-attention tickets + waiting count.
   */
  async findDisplayData(officeId) {
    const [activeTickets, waitingTickets, waitingCount, attendedToday] = await Promise.all([
      prisma.ticket.findMany({
        where: {
          officeId: Number(officeId),
          status: { in: ["CALLED", "IN_ATTENTION"] },
          deletedAt: null,
        },
        orderBy: { calledAt: "asc" },
        include: TICKET_INCLUDE,
        take: 20,
      }),
      prisma.ticket.findMany({
        where: {
          officeId: Number(officeId),
          status: "WAITING",
          deletedAt: null,
        },
        orderBy: { createdAt: "asc" },
        select: { id: true, ticketNumber: true },
        take: 15,
      }),
      prisma.ticket.count({
        where: {
          officeId: Number(officeId),
          status: "WAITING",
          deletedAt: null,
        },
      }),
      prisma.ticket.count({
        where: {
          officeId: Number(officeId),
          status: { in: ["FINISHED", "DERIVED"] },
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
          deletedAt: null,
        },
      }),
    ]);

    return {
      activeTickets: ticketMapper.toDomainList(activeTickets),
      waitingTickets: waitingTickets.map(t => ({ id: t.id, ticketNumber: t.ticketNumber })),
      waitingCount,
      attendedToday,
    };
  },

  /**
   * Returns the advisor's current queue.
   */
  async findAdvisorQueue(userId, officeId) {
    const [currentTicket, officeWaiting] = await Promise.all([
      prisma.ticket.findFirst({
        where: {
          userId,
          status: { in: ["CALLED", "IN_ATTENTION"] },
          deletedAt: null,
        },
        include: TICKET_INCLUDE,
        orderBy: { calledAt: "desc" },
      }),
      prisma.ticket.findMany({
        where: {
          officeId: Number(officeId),
          status: "WAITING",
          deletedAt: null,
        },
        include: TICKET_INCLUDE,
        orderBy: { createdAt: "asc" },
        take: 20,
      }),
    ]);

    return {
      currentTicket: ticketMapper.toDomain(currentTicket),
      waitingTickets: ticketMapper.toDomainList(officeWaiting),
    };
  },

  /**
   * Finds the next WAITING ticket for an office (FIFO).
   */
  async findNextWaiting(officeId, serviceType) {
    const item = await prisma.ticket.findFirst({
      where: {
        officeId: Number(officeId),
        status: "WAITING",
        deletedAt: null,
        ...(serviceType && { serviceType }),
      },
      orderBy: { createdAt: "asc" },
      include: TICKET_INCLUDE,
    });
    return ticketMapper.toDomain(item);
  },
};
