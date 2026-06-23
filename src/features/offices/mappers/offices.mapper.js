/**
 * Mapper for the Office entity.
 * Centralizes transformation between Prisma and Domain.
 */

export const officeMapper = {
  /**
   * Transforms a Prisma record into a Domain object.
   */
  toDomain(raw) {
    if (!raw) return null;
    return {
      id: raw.id,
      name: raw.name,
      code: raw.code,
      address: raw.address,
      stateId: raw.stateId,
      stateName: raw.state?.name || null,
      chiefName: raw.chiefName,
      chiefIdCard: raw.chiefIdCard,
      chiefPhone: raw.chiefPhone,
      chiefEmail: raw.chiefEmail,
      hasEmailChange: raw.hasEmailChange,
      hasForeignAffairs: raw.hasForeignAffairs,
      hasMigration: raw.hasMigration,
      enableQrTicket: raw.enableQrTicket,
      observation: raw.observation,
      isActive: raw.isActive,
      lastUpdatedAt: raw.lastUpdatedAt,
      createdAt: raw.createdAt,
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
      name: domain.name?.trim(),
      code: domain.code?.trim() || null,
      address: domain.address?.trim() || null,
      stateId: domain.stateId || null,
      chiefName: domain.chiefName?.trim() || null,
      chiefIdCard: domain.chiefIdCard?.trim() || null,
      chiefPhone: domain.chiefPhone?.trim() || null,
      chiefEmail: domain.chiefEmail?.trim() || null,
      hasEmailChange: domain.hasEmailChange ?? false,
      hasForeignAffairs: domain.hasForeignAffairs ?? false,
      hasMigration: domain.hasMigration ?? false,
      enableQrTicket: domain.enableQrTicket ?? false,
      observation: domain.observation?.trim() || null,
      isActive: domain.isActive ?? true,
    };
  },

  /**
   * Maps a domain-level sort key to the database column name.
   */
  toSortKey(domainKey) {
    const map = {
      name: "name",
      code: "code",
      stateName: "state",
      chiefName: "chiefName",
      isActive: "isActive",
      createdAt: "createdAt",
    };
    return map[domainKey] || "createdAt";
  },
};
