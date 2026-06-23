import prisma from "@/features/shared/lib/prisma";
import { callStatusMapper } from "../mappers/call-status.mapper";

export const callStatusReadRepository = {
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection }) {
    const skip = (page - 1) * pageSize;
    const dbKey = callStatusMapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "asc" };

    const where = {
      ...(searchTerm && {
        name: { contains: searchTerm, mode: "insensitive" },
      }),
      deletedAt: null,
    };

    const [totalCount, items] = await Promise.all([
      prisma.callStatus.count({ where }),
      prisma.callStatus.findMany({ where, skip, take: pageSize, orderBy }),
    ]);

    return {
      items: callStatusMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.callStatus.findUnique({
      where: { id: Number(id) },
    });
    return callStatusMapper.toDomain(item);
  },

  async findByName(name, excludeId = null) {
    return await prisma.callStatus.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId && { id: { not: Number(excludeId) } }),
      },
    });
  },
};
