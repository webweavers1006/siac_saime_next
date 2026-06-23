import prisma from "@/features/shared/lib/prisma";
import { officeMapper } from "../mappers/offices.mapper";

export const officeReadRepository = {
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection, stateId, isActive, enableQrTicket }) {
    const skip = (page - 1) * pageSize;
    const dbKey = officeMapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "asc" };

    const where = {
      ...(searchTerm && {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { code: { contains: searchTerm, mode: "insensitive" } },
          { chiefName: { contains: searchTerm, mode: "insensitive" } },
        ],
      }),
      ...(stateId && { stateId: Number(stateId) }),
      ...(isActive !== undefined && isActive !== null && { isActive }),
      ...(enableQrTicket !== undefined && enableQrTicket !== null && { enableQrTicket }),
      deletedAt: null,
    };

    const [totalCount, items] = await Promise.all([
      prisma.office.count({ where }),
      prisma.office.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: { state: { select: { name: true } } },
      }),
    ]);

    return {
      items: officeMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.office.findUnique({
      where: { id: Number(id) },
      include: { state: { select: { name: true } } },
    });
    return officeMapper.toDomain(item);
  },

  async findByName(name, excludeId = null) {
    return await prisma.office.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId && { id: { not: Number(excludeId) } }),
      },
    });
  },

  async findByCode(code, excludeId = null) {
    if (!code) return null;
    return await prisma.office.findFirst({
      where: {
        code: { equals: code, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId && { id: { not: Number(excludeId) } }),
      },
    });
  },
};
