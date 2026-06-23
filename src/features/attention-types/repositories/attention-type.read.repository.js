import prisma from "@/features/shared/lib/prisma";
import { attentionTypeMapper } from "../mappers/attention-type.mapper";

export const attentionTypeReadRepository = {
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection }) {
    const skip = (page - 1) * pageSize;
    const dbKey = attentionTypeMapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "asc" };

    const where = {
      ...(searchTerm && {
        name: { contains: searchTerm, mode: "insensitive" },
      }),
      deletedAt: null,
    };

    const [totalCount, items] = await Promise.all([
      prisma.attentionType.count({ where }),
      prisma.attentionType.findMany({ where, skip, take: pageSize, orderBy }),
    ]);

    return {
      items: attentionTypeMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.attentionType.findUnique({
      where: { id: Number(id) },
    });
    return attentionTypeMapper.toDomain(item);
  },

  async findByName(name, excludeId = null) {
    return await prisma.attentionType.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId && { id: { not: Number(excludeId) } }),
      },
    });
  },
};
