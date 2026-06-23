import prisma from "@/features/shared/lib/prisma";
import { caseDocumentMapper } from "../mappers/case-document.mapper";

export const caseDocumentReadRepository = {
  async findMany({ page = 1, pageSize = 10, searchTerm, sortKey = "createdAt", sortDirection = "desc", caseId } = {}) {
    const skip = (page - 1) * pageSize;
    const dbKey = caseDocumentMapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "desc" };

    const where = {
      deletedAt: null,
      ...(caseId != null && { caseId: Number(caseId) }),
      ...(searchTerm && {
        OR: [
          { originalName: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
        ],
      }),
    };

    const [totalCount, items] = await Promise.all([
      prisma.caseDocument.count({ where }),
      prisma.caseDocument.findMany({ where, skip, take: pageSize, orderBy }),
    ]);

    return {
      items: caseDocumentMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.caseDocument.findFirst({
      where: { id: Number(id), deletedAt: null },
    });
    return caseDocumentMapper.toDomain(item);
  },

  async findByCaseId(caseId) {
    const items = await prisma.caseDocument.findMany({
      where: { caseId: Number(caseId), deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return caseDocumentMapper.toDomainList(items);
  },
};
