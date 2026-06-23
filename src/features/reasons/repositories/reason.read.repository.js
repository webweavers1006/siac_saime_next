import prisma from "@/features/shared/lib/prisma";
import { reasonMapper } from "../mappers/reason.mapper";

export const reasonReadRepository = {
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection, caseAreaId }) {
    const skip = (page - 1) * pageSize;
    const dbKey = reasonMapper.toSortKey(sortKey);
    const orderBy = dbKey.includes(".")
      ? { caseArea: { name: sortDirection || "asc" } }
      : { [dbKey]: sortDirection || "asc" };

    const where = {
      ...(searchTerm && {
        name: { contains: searchTerm, mode: "insensitive" },
      }),
      ...(caseAreaId && { caseAreaId: Number(caseAreaId) }),
      deletedAt: null,
    };

    const [totalCount, items] = await Promise.all([
      prisma.reason.count({ where }),
      prisma.reason.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: { caseArea: { select: { id: true, name: true } } },
      }),
    ]);

    return {
      items: reasonMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.reason.findUnique({
      where: { id: Number(id) },
      include: { caseArea: { select: { id: true, name: true } } },
    });
    return reasonMapper.toDomain(item);
  },

  async findByName(name, excludeId = null) {
    return await prisma.reason.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId && { id: { not: Number(excludeId) } }),
      },
    });
  },
};
