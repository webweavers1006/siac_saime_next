export const administrativeDirectionMapper = {
  toDomain(raw) {
    if (!raw) return null;
    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      isAudit: raw.isAudit,
      caseAreaId: raw.caseAreaId,
      defaultCaseArea: raw.defaultCaseArea ? {
        id: raw.defaultCaseArea.id,
        name: raw.defaultCaseArea.name,
      } : null,
      allowedAreas: raw.directionAreas?.map(da => ({
        areaId: da.areaId,
        areaName: da.area?.name,
      })) || [],
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
      name: domain.name?.trim(),
      email: domain.email?.trim() || null,
      isAudit: domain.isAudit ?? false,
      caseAreaId: domain.caseAreaId ? Number(domain.caseAreaId) : null,
    };
  },

  /**
   * Returns the Prisma payload for updating directionAreas M2M.
   * Deletes all existing and creates new ones for the given areaIds.
   * @param {number[]} areaIds - Array of area IDs
   */
  toDirectionAreasPayload(areaIds) {
    if (!Array.isArray(areaIds)) return undefined;
    return {
      deleteMany: {},
      create: areaIds.map(id => ({ areaId: Number(id) })),
    };
  },

  toSortKey(domainKey) {
    const map = {
      name: "name",
      email: "email",
      isAudit: "isAudit",
      createdAt: "createdAt",
    };
    return map[domainKey] || "createdAt";
  },
};
