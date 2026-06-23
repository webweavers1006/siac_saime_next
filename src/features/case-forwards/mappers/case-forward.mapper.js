/**
 * Mapper for the CaseForward entity.
 */

import { parseDateInput } from "@/features/shared/lib/date-utils";

export const caseForwardMapper = {
  toDomain(raw) {
    if (!raw) return null;

    return {
      id: raw.id,
      caseId: raw.caseId,
      administrativeDirectionId: raw.administrativeDirectionId,
      administrativeDirectionName: raw.administrativeDirection?.name || null,
      userId: raw.userId,
      userName: raw.user
        ? `${raw.user.firstName || ""} ${raw.user.lastName || ""}`.trim() || null
        : null,
      isActive: raw.isActive,
      date: raw.date,
      description: raw.description,
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
      caseId: domain.caseId != null ? Number(domain.caseId) : null,
      administrativeDirectionId:
        domain.administrativeDirectionId != null
          ? Number(domain.administrativeDirectionId)
          : null,
      userId: domain.userId || undefined,
      isActive: domain.isActive ?? true,
      date: parseDateInput(domain.date),
      description: domain.description?.trim() || null,
    };
  },

  toSortKey(domainKey) {
    const map = { date: "date", createdAt: "createdAt" };
    return map[domainKey] || "date";
  },
};
