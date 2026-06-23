/**
 * Mapper for the Ticket entity.
 * Centralizes transformation between Prisma and Domain.
 */

export const ticketMapper = {
  /**
   * Transforms a Prisma record into a Domain object.
   */
  toDomain(raw) {
    if (!raw) return null;
    return {
      id: raw.id,
      ticketNumber: raw.ticketNumber,
      status: raw.status,
      officeId: raw.officeId,
      officeName: raw.office?.name || null,
      attentionTypeId: raw.attentionTypeId,
      attentionTypeName: raw.attentionType?.name || null,
      userId: raw.userId,
      userName: raw.user ? `${raw.user.firstName} ${raw.user.lastName}` : null,
      personId: raw.personId,
      personFirstName: raw.person?.firstName || null,
      personLastName: raw.person?.lastName || null,
      personIdCard: raw.person?.idCard || null,
      caseId: raw.caseId,
      deskNumber: raw.deskNumber,
      serviceType: raw.serviceType,
      notes: raw.notes,
      createdAt: raw.createdAt,
      createdAtTime: raw.createdAt
        ? new Date(raw.createdAt).toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", timeZone: "America/Caracas" })
        : null,
      calledAt: raw.calledAt,
      startedAt: raw.startedAt,
      finishedAt: raw.finishedAt,
      updatedAt: raw.updatedAt,
    };
  },

  /**
   * Transforms a list of Prisma records.
   */
  toDomainList(list) {
    if (!list) return [];
    return list.map(this.toDomain);
  },

  /**
   * Transforms a Domain object into a Prisma write payload.
   */
  toPersistence(domain) {
    return {
      ticketNumber: domain.ticketNumber?.trim(),
      status: domain.status || "CREATED",
      officeId: domain.officeId || null,
      attentionTypeId: domain.attentionTypeId || null,
      userId: domain.userId || null,
      personId: domain.personId || null,
      caseId: domain.caseId || null,
      deskNumber: domain.deskNumber?.trim() || null,
      serviceType: domain.serviceType || null,
      notes: domain.notes?.trim() || null,
      calledAt: domain.calledAt || null,
      startedAt: domain.startedAt || null,
      finishedAt: domain.finishedAt || null,
    };
  },

  /**
   * Maps a domain-level sort key to the database column name.
   */
  toSortKey(domainKey) {
    const map = {
      ticketNumber: "ticketNumber",
      status: "status",
      officeName: "office",
      createdAt: "createdAt",
      calledAt: "calledAt",
    };
    return map[domainKey] || "createdAt";
  },
};
