import prisma from "@/features/shared/lib/prisma";
import { caseStatusMapper } from "../mappers/case-status.mapper";

export const caseStatusReadRepository = {
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection }) {
    const skip = (page - 1) * pageSize;
    const dbKey = caseStatusMapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "asc" };

    const where = {
      ...(searchTerm && {
        name: { contains: searchTerm, mode: "insensitive" },
      }),
      deletedAt: null,
    };

    const [totalCount, items] = await Promise.all([
      prisma.caseStatus.count({ where }),
      prisma.caseStatus.findMany({ where, skip, take: pageSize, orderBy }),
    ]);

    return {
      items: caseStatusMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.caseStatus.findUnique({
      where: { id: Number(id) },
    });
    return caseStatusMapper.toDomain(item);
  },

  async findByName(name, excludeId = null) {
    return await prisma.caseStatus.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId && { id: { not: Number(excludeId) } }),
      },
    });
  },
};
