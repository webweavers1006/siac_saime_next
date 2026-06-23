/**
 * Mapper for the CaseFollowUp entity.
 */

import { parseDateInput } from "@/features/shared/lib/date-utils";

export const caseFollowUpMapper = {
  toDomain(raw) {
    if (!raw) return null;

    // Combine date + time into a single display DateTime.
    let displayDateTime = null;
    if (raw.date) {
      const dateStr = raw.date instanceof Date
        ? raw.date.toISOString().split('T')[0]
        : String(raw.date).split('T')[0];
      if (raw.time) {
        // Use Venezuela timezone offset (-04:00) so the Date represents
        // the correct Caracas time, not UTC/local time.
        displayDateTime = new Date(`${dateStr}T${raw.time}:00-04:00`);
      } else {
        displayDateTime = raw.date;
      }
    }

    return {
      id: raw.id,
      caseId: raw.caseId,
      callStatusId: raw.callStatusId,
      callStatusName: raw.callStatus?.name || null,
      comment: raw.comment,
      date: displayDateTime,
      time: raw.time || null,
      userId: raw.userId,
      userName: raw.user
        ? `${raw.user.firstName || ""} ${raw.user.lastName || ""}`.trim() || null
        : null,
      currentDirectionId: raw.currentDirectionId,
      currentDirectionName: raw.currentDirection?.name || null,
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
      callStatusId: domain.callStatusId != null ? Number(domain.callStatusId) : null,
      comment: domain.comment?.trim() || null,
      date: parseDateInput(domain.date),
      time: domain.time || null,
      userId: domain.userId || undefined,
      currentDirectionId: domain.currentDirectionId != null ? Number(domain.currentDirectionId) : null,
    };
  },

  toSortKey(domainKey) {
    const map = { date: "date", createdAt: "createdAt" };
    return map[domainKey] || "date";
  },
};
