import prisma from "@/features/shared/lib/prisma";
import { popularOrganizationMapper } from "../mappers/popular-organization.mapper";

export const popularOrganizationReadRepository = {
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection }) {
    const skip = (page - 1) * pageSize;
    const dbKey = popularOrganizationMapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "asc" };

    const where = {
      ...(searchTerm && {
        name: { contains: searchTerm, mode: "insensitive" },
      }),
      deletedAt: null,
    };

    const [totalCount, items] = await Promise.all([
      prisma.popularOrganization.count({ where }),
      prisma.popularOrganization.findMany({ where, skip, take: pageSize, orderBy }),
    ]);

    return {
      items: popularOrganizationMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.popularOrganization.findUnique({
      where: { id: Number(id) },
    });
    return popularOrganizationMapper.toDomain(item);
  },

  async findByName(name, excludeId = null) {
    return await prisma.popularOrganization.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId && { id: { not: Number(excludeId) } }),
      },
    });
  },
};
