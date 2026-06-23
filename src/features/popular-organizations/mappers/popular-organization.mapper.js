/**
 * Mapper for the PopularOrganization entity.
 * Centralizes transformation between Prisma and Domain.
 */

export const popularOrganizationMapper = {
  /**
   * Transforms a Prisma record into a Domain object.
   */
  toDomain(raw) {
    if (!raw) return null;
    return {
      id: raw.id,
      name: raw.name,
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
    };
  },

  /**
   * Maps a domain-level sort key to the database column name.
   */
  toSortKey(domainKey) {
    const map = {
      name: "name",
      createdAt: "createdAt",
    };
    return map[domainKey] || "createdAt";
  },
};
