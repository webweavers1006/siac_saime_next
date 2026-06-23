import prisma from "@/features/shared/lib/prisma";
import { attentionChannelMapper } from "../mappers/attention-channel.mapper";

export const attentionChannelReadRepository = {
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection }) {
    const skip = (page - 1) * pageSize;
    const dbKey = attentionChannelMapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "asc" };

    const where = {
      ...(searchTerm && {
        name: { contains: searchTerm, mode: "insensitive" },
      }),
      deletedAt: null,
    };

    const [totalCount, items] = await Promise.all([
      prisma.attentionChannel.count({ where }),
      prisma.attentionChannel.findMany({ where, skip, take: pageSize, orderBy }),
    ]);

    return {
      items: attentionChannelMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.attentionChannel.findUnique({
      where: { id: Number(id) },
    });
    return attentionChannelMapper.toDomain(item);
  },

  async findByName(name, excludeId = null) {
    return await prisma.attentionChannel.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId && { id: { not: Number(excludeId) } }),
      },
    });
  },
};
