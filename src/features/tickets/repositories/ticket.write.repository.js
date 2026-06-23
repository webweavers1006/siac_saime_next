import prisma from "@/features/shared/lib/prisma";
import { ticketMapper } from "../mappers/ticket.mapper";

export const ticketWriteRepository = {
  async create(data) {
    const persistence = ticketMapper.toPersistence(data);
    const item = await prisma.ticket.create({
      data: persistence,
      include: {
        office: { select: { name: true } },
        attentionType: { select: { name: true } },
        user: { select: { firstName: true, lastName: true } },
        person: { select: { firstName: true, lastName: true, idCard: true } },
      },
    });
    return ticketMapper.toDomain(item);
  },

  async updateStatus(id, status, extra = {}) {
    const data = {
      status,
      ...extra,
    };
    const item = await prisma.ticket.update({
      where: { id: Number(id) },
      data,
      include: {
        office: { select: { name: true } },
        attentionType: { select: { name: true } },
        user: { select: { firstName: true, lastName: true } },
        person: { select: { firstName: true, lastName: true, idCard: true } },
      },
    });
    return ticketMapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.ticket.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },

  // ── Counter management ──────────────────────────────────────────────

  /**
   * Atomically increments the ticket counter for a given office + attention type.
   * Creates the counter row if it doesn't exist (upsert).
   * Returns the new number.
   */
  async incrementCounter(officeId, attentionTypeId, prefix) {
    const numericOfficeId = Number(officeId);

    // Handle null attentionTypeId separately — Prisma upsert can't match null in compound unique
    if (attentionTypeId == null) {
      const existing = await prisma.ticketCounter.findFirst({
        where: { officeId: numericOfficeId, attentionTypeId: null },
      });
      if (existing) {
        const updated = await prisma.ticketCounter.update({
          where: { id: existing.id },
          data: { currentNumber: { increment: 1 } },
        });
        return updated.currentNumber;
      }
      const created = await prisma.ticketCounter.create({
        data: { officeId: numericOfficeId, attentionTypeId: null, prefix, currentNumber: 1 },
      });
      return created.currentNumber;
    }

    // Normal upsert when attentionTypeId is not null
    const counter = await prisma.ticketCounter.upsert({
      where: {
        officeId_attentionTypeId: {
          officeId: numericOfficeId,
          attentionTypeId: Number(attentionTypeId),
        },
      },
      update: { currentNumber: { increment: 1 } },
      create: {
        officeId: numericOfficeId,
        attentionTypeId: Number(attentionTypeId),
        prefix,
        currentNumber: 1,
      },
    });
    return counter.currentNumber;
  },

  /**
   * Optionally resets all counters for an office at the start of a new day.
   */
  async resetDailyCounters(officeId) {
    await prisma.ticketCounter.updateMany({
      where: { officeId: Number(officeId) },
      data: {
        currentNumber: 0,
        lastResetDate: new Date(),
      },
    });
  },
};
