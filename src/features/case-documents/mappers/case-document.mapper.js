/**
 * Mapper for the CaseDocument entity.
 * Centralizes transformation between Prisma and Domain.
 */

export const caseDocumentMapper = {
  toDomain(raw) {
    if (!raw) return null;
    return {
      id: raw.id,
      caseId: raw.caseId,
      filePath: raw.filePath,
      description: raw.description,
      originalName: raw.originalName,
      fileSize: raw.fileSize != null ? Number(raw.fileSize) : null,
      mimeType: raw.mimeType,
      extension: raw.extension,
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
      filePath: domain.filePath?.trim() || "",
      description: domain.description?.trim() || null,
      originalName: domain.originalName?.trim() || null,
      fileSize: domain.fileSize != null ? Number(domain.fileSize) : null,
      mimeType: domain.mimeType || null,
      extension: domain.extension?.toLowerCase() || null,
    };
  },

  toSortKey(domainKey) {
    const map = {
      filePath: "filePath",
      originalName: "originalName",
      fileSize: "fileSize",
      createdAt: "createdAt",
    };
    return map[domainKey] || "createdAt";
  },
};
