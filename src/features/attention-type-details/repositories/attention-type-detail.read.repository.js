import prisma from "@/features/shared/lib/prisma";
import { attentionTypeDetailMapper } from "../mappers/attention-type-detail.mapper";

export const attentionTypeDetailReadRepository = {
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection, attentionTypeId }) {
    const skip = (page - 1) * pageSize;
    const dbKey = attentionTypeDetailMapper.toSortKey(sortKey);
    const orderBy = dbKey.includes(".")
      ? { attentionType: { name: sortDirection || "asc" } }
      : { [dbKey]: sortDirection || "asc" };

    const where = {
      ...(searchTerm && {
        name: { contains: searchTerm, mode: "insensitive" },
      }),
      ...(attentionTypeId && { attentionTypeId: Number(attentionTypeId) }),
      deletedAt: null,
    };

    const [totalCount, items] = await Promise.all([
      prisma.attentionTypeDetail.count({ where }),
      prisma.attentionTypeDetail.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: { attentionType: { select: { id: true, name: true } } },
      }),
    ]);

    return {
      items: attentionTypeDetailMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.attentionTypeDetail.findUnique({
      where: { id: Number(id) },
      include: { attentionType: { select: { id: true, name: true } } },
    });
    return attentionTypeDetailMapper.toDomain(item);
  },

  async findByName(name, excludeId = null) {
    return await prisma.attentionTypeDetail.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId && { id: { not: Number(excludeId) } }),
      },
    });
  },
};
