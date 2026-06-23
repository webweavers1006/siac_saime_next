import prisma from "@/features/shared/lib/prisma";
import { personMapper } from "../mappers/person.mapper";

export const personReadRepository = {
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection }) {
    const skip = (page - 1) * pageSize;
    const dbKey = personMapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "asc" };

    const where = {
      ...(searchTerm && {
        OR: [
          { firstName: { contains: searchTerm, mode: "insensitive" } },
          { lastName: { contains: searchTerm, mode: "insensitive" } },
          { idCard: { contains: searchTerm, mode: "insensitive" } },
        ],
      }),
      deletedAt: null,
    };

    const include = {
      country: { select: { id: true, name: true } },
      state: { select: { id: true, name: true } },
    };

    const [totalCount, items] = await Promise.all([
      prisma.person.count({ where }),
      prisma.person.findMany({ where, skip, take: pageSize, orderBy, include }),
    ]);

    return {
      items: personMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.person.findUnique({
      where: { id: Number(id) },
      include: {
        country: { select: { id: true, name: true } },
        state: { select: { id: true, name: true } },
        municipality: { select: { id: true, name: true } },
        parish: { select: { id: true, name: true } },
        beneficiaryType: { select: { id: true, name: true } },
      },
    });
    return personMapper.toDomain(item);
  },

  async findByIdCard(idCard, excludeId = null) {
    const item = await prisma.person.findFirst({
      where: {
        idCard: { equals: idCard, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId && { id: { not: Number(excludeId) } }),
      },
    });
    return personMapper.toDomain(item);
  },
};
