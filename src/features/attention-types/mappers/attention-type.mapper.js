export const attentionTypeMapper = {
  toDomain(raw) {
    if (!raw) return null;
    return {
      id: raw.id,
      name: raw.name,
      showCaseArea: raw.showCaseArea,
      showParticipants: raw.showParticipants,
      sendEmail: raw.sendEmail,
      showPopularOrg: raw.showPopularOrg,
      showCoordinates: raw.showCoordinates,
      showDocuments: raw.showDocuments,
      showPuntoCuenta: raw.showPuntoCuenta,
      hasComplaint: raw.hasComplaint,
      hasAttentionDetail: raw.hasAttentionDetail,
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
      showCaseArea: domain.showCaseArea ?? false,
      showParticipants: domain.showParticipants ?? false,
      sendEmail: domain.sendEmail ?? false,
      showPopularOrg: domain.showPopularOrg ?? false,
      showCoordinates: domain.showCoordinates ?? false,
      showDocuments: domain.showDocuments ?? false,
      showPuntoCuenta: domain.showPuntoCuenta ?? false,
      hasComplaint: domain.hasComplaint ?? false,
      hasAttentionDetail: domain.hasAttentionDetail ?? false,
    };
  },

  toSortKey(domainKey) {
    const map = {
      name: "name",
      createdAt: "createdAt",
    };
    return map[domainKey] || "createdAt";
  },
};
