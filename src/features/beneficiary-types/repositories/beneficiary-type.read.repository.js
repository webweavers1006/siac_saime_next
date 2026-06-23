import prisma from "@/features/shared/lib/prisma";
import { beneficiaryTypeMapper } from "../mappers/beneficiary-type.mapper";

export const beneficiaryTypeReadRepository = {
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection }) {
    const skip = (page - 1) * pageSize;
    const dbKey = beneficiaryTypeMapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "asc" };

    const where = {
      ...(searchTerm && {
        name: { contains: searchTerm, mode: "insensitive" },
      }),
      deletedAt: null,
    };

    const [totalCount, items] = await Promise.all([
      prisma.beneficiaryType.count({ where }),
      prisma.beneficiaryType.findMany({ where, skip, take: pageSize, orderBy }),
    ]);

    return {
      items: beneficiaryTypeMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.beneficiaryType.findUnique({
      where: { id: Number(id) },
    });
    return beneficiaryTypeMapper.toDomain(item);
  },

  async findByName(name, excludeId = null) {
    return await prisma.beneficiaryType.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId && { id: { not: Number(excludeId) } }),
      },
    });
  },
};
