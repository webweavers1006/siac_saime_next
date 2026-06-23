/**
 * Mapper for the CaseComplaint entity.
 */

import { parseDateInput } from "@/features/shared/lib/date-utils";

export const caseComplaintMapper = {
  toDomain(raw) {
    if (!raw) return null;
    return {
      id: raw.id,
      caseId: raw.caseId,
      affectsPerson: raw.affectsPerson,
      affectsCommunity: raw.affectsCommunity,
      affectsThirdParties: raw.affectsThirdParties,
      involvedParties: raw.involvedParties,
      incidentDate: raw.incidentDate,
      popularInstance: raw.popularInstance,
      instanceRif: raw.instanceRif,
      financingEntity: raw.financingEntity,
      projectName: raw.projectName,
      approvedAmount: raw.approvedAmount,
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
      affectsPerson: domain.affectsPerson ?? false,
      affectsCommunity: domain.affectsCommunity ?? false,
      affectsThirdParties: domain.affectsThirdParties ?? false,
      involvedParties: domain.involvedParties?.trim() || null,
      incidentDate: parseDateInput(domain.incidentDate),
      popularInstance: domain.popularInstance?.trim() || null,
      instanceRif: domain.instanceRif?.trim() || null,
      financingEntity: domain.financingEntity?.trim() || null,
      projectName: domain.projectName?.trim() || null,
      approvedAmount: domain.approvedAmount?.trim() || null,
    };
  },

  toSortKey(domainKey) {
    const map = { incidentDate: "incidentDate", createdAt: "createdAt" };
    return map[domainKey] || "createdAt";
  },
};
