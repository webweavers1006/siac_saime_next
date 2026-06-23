/**
 * Mapper for the AttentionTypeDetail entity.
 * Centralizes transformation between Prisma and Domain.
 */

export const attentionTypeDetailMapper = {
  /**
   * Transforms a Prisma record into a Domain object.
   */
  toDomain(raw) {
    if (!raw) return null;
    return {
      id: raw.id,
      name: raw.name,
      attentionTypeId: raw.attentionTypeId,
      attentionTypeName: raw.attentionType?.name || null,
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
      attentionTypeId: domain.attentionTypeId ? Number(domain.attentionTypeId) : null,
    };
  },

  /**
   * Maps a domain-level sort key to the database column name.
   */
  toSortKey(domainKey) {
    const map = {
      name: "name",
      attentionTypeName: "attentionType.name",
      createdAt: "createdAt",
    };
    return map[domainKey] || "createdAt";
  },
};
