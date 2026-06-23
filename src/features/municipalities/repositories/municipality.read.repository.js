import prisma from "@/features/shared/lib/prisma";

export const municipalityReadRepository = {
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection, stateId }) {
    const skip = (page - 1) * pageSize;
    const orderBy = { [sortKey || "name"]: sortDirection || "asc" };

    const where = {
      ...(searchTerm && {
        name: { contains: searchTerm, mode: "insensitive" },
      }),
      ...(stateId && { stateId: Number(stateId) }),
      deletedAt: null,
    };

    const [totalCount, items] = await Promise.all([
      prisma.municipality.count({ where }),
      prisma.municipality.findMany({ where, skip, take: pageSize, orderBy }),
    ]);

    return {
      items: items.map((i) => ({ id: i.id, name: i.name, pcode: i.pcode })),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },
};
