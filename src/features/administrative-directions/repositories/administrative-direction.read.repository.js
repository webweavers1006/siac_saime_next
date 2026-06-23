import prisma from "@/features/shared/lib/prisma";
import { administrativeDirectionMapper } from "../mappers/administrative-direction.mapper";

export const administrativeDirectionReadRepository = {
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection }) {
    const skip = (page - 1) * pageSize;
    const dbKey = administrativeDirectionMapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "asc" };

    const where = {
      ...(searchTerm && {
        name: { contains: searchTerm, mode: "insensitive" },
      }),
      deletedAt: null,
    };

    const [totalCount, items] = await Promise.all([
      prisma.administrativeDirection.count({ where }),
      prisma.administrativeDirection.findMany({
        where, skip, take: pageSize, orderBy,
        include: { defaultCaseArea: true, directionAreas: { include: { area: true } } },
      }),
    ]);

    return {
      items: administrativeDirectionMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.administrativeDirection.findUnique({
      where: { id: Number(id) },
      include: { defaultCaseArea: true, directionAreas: { include: { area: true } } },
    });
    return administrativeDirectionMapper.toDomain(item);
  },

  async findByName(name, excludeId = null) {
    return await prisma.administrativeDirection.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId && { id: { not: Number(excludeId) } }),
      },
    });
  },
};
