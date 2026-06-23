/**
 * Mapper for the BeneficiaryType entity.
 * Centralizes transformation between Prisma and Domain.
 */

export const beneficiaryTypeMapper = {
  /**
   * Transforms a Prisma record into a Domain object.
   */
  toDomain(raw) {
    if (!raw) return null;
    return {
      id: raw.id,
      name: raw.name,
      requiresIdCard: raw.requiresIdCard,
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
      requiresIdCard: domain.requiresIdCard !== undefined ? domain.requiresIdCard : true,
    };
  },

  /**
   * Maps a domain-level sort key to the database column name.
   */
  toSortKey(domainKey) {
    const map = {
      name: "name",
      requiresIdCard: "requiresIdCard",
      createdAt: "createdAt",
    };
    return map[domainKey] || "createdAt";
  },
};
