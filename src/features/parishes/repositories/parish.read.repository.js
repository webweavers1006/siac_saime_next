import prisma from "@/features/shared/lib/prisma";

export const parishReadRepository = {
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection, municipalityId }) {
    const skip = (page - 1) * pageSize;
    const orderBy = { [sortKey || "name"]: sortDirection || "asc" };

    const where = {
      ...(searchTerm && {
        name: { contains: searchTerm, mode: "insensitive" },
      }),
      ...(municipalityId && { municipalityId: Number(municipalityId) }),
      deletedAt: null,
    };

    const [totalCount, items] = await Promise.all([
      prisma.parish.count({ where }),
      prisma.parish.findMany({ where, skip, take: pageSize, orderBy }),
    ]);

    return {
      items: items.map((i) => ({ id: i.id, name: i.name, pcode: i.pcode, geoData: i.geoData })),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },
};
