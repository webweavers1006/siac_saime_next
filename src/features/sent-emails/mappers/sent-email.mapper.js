/**
 * Mapper for the SentEmail entity.
 *
 * DB fields (via @map): destinatario, asunto, motivo, estado, caso_id,
 *   usuario_id, mensaje_error, enviado_en, creado_en, actualizado_en.
 *
 * Domain fields (English): toAddress, subject, reason, status, caseId,
 *   userId, errorMessage, sentAt, createdAt, updatedAt.
 */

export const sentEmailMapper = {
  toDomain(raw) {
    if (!raw) return null;
    return {
      id: raw.id,
      toAddress: raw.toAddress,
      subject: raw.subject,
      reason: raw.reason,
      status: raw.status,
      caseId: raw.caseId ?? null,
      caseNumber: raw.case?.requestNumber ?? null,
      userId: raw.userId ?? null,
      userName: raw.user
        ? `${raw.user.firstName || ""} ${raw.user.lastName || ""}`.trim() || null
        : null,
      errorMessage: raw.errorMessage ?? null,
      sentAt: raw.sentAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  },

  toDomainList(list) {
    if (!list) return [];
    return list.map(this.toDomain);
  },

  toPersistence(domain) {
    return {
      toAddress: domain.toAddress?.trim() || "",
      subject: domain.subject?.trim() || "",
      reason: domain.reason,
      status: domain.status || "sent",
      caseId: domain.caseId ?? null,
      userId: domain.userId ?? null,
      errorMessage: domain.errorMessage ?? null,
      sentAt: domain.sentAt ?? new Date(),
    };
  },

  /**
   * Maps a domain-level sort key to the DB column name.
   * @param {string} domainKey
   * @returns {string} Prisma column name
   */
  toSortKey(domainKey) {
    const map = {
      sentAt: "sentAt",
      createdAt: "createdAt",
      toAddress: "toAddress",
      subject: "subject",
      reason: "reason",
      status: "status",
    };
    return map[domainKey] || "sentAt";
  },
};
