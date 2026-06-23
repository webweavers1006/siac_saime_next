import prisma from "@/features/shared/lib/prisma";
import { attachedEntityMapper } from "../mappers/attached-entity.mapper";

export const attachedEntityReadRepository = {
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection }) {
    const skip = (page - 1) * pageSize;
    const dbKey = attachedEntityMapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "asc" };

    const where = {
      ...(searchTerm && {
        name: { contains: searchTerm, mode: "insensitive" },
      }),
      deletedAt: null,
    };

    const [totalCount, items] = await Promise.all([
      prisma.attachedEntity.count({ where }),
      prisma.attachedEntity.findMany({ where, skip, take: pageSize, orderBy }),
    ]);

    return {
      items: attachedEntityMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.attachedEntity.findUnique({
      where: { id: Number(id) },
    });
    return attachedEntityMapper.toDomain(item);
  },

  async findByName(name, excludeId = null) {
    return await prisma.attachedEntity.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId && { id: { not: Number(excludeId) } }),
      },
    });
  },
};
