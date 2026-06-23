import prisma from "@/features/shared/lib/prisma";
import { caseForwardMapper } from "../mappers/case-forward.mapper";

const FORWARD_INCLUDE = {
  administrativeDirection: { select: { name: true } },
  user: { select: { firstName: true, lastName: true } },
};

export const caseForwardReadRepository = {
  async findMany({ page = 1, pageSize = 20, sortKey = "date", sortDirection = "desc", caseId } = {}) {
    const skip = (page - 1) * pageSize;
    const dbKey = caseForwardMapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "desc" };

    const where = {
      deletedAt: null,
      ...(caseId != null && { caseId: Number(caseId) }),
    };

    const [totalCount, items] = await Promise.all([
      prisma.caseForward.count({ where }),
      prisma.caseForward.findMany({ where, skip, take: pageSize, orderBy, include: FORWARD_INCLUDE }),
    ]);

    return {
      items: caseForwardMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.caseForward.findFirst({
      where: { id: Number(id), deletedAt: null },
      include: FORWARD_INCLUDE,
    });
    return caseForwardMapper.toDomain(item);
  },

  async findByCaseId(caseId) {
    const items = await prisma.caseForward.findMany({
      where: { caseId: Number(caseId), deletedAt: null },
      orderBy: { date: "desc" },
      include: FORWARD_INCLUDE,
    });
    return caseForwardMapper.toDomainList(items);
  },

  /**
   * Returns the currently active forward for a case, if any.
   */
  async findActiveByCaseId(caseId) {
    const item = await prisma.caseForward.findFirst({
      where: { caseId: Number(caseId), deletedAt: null, isActive: true },
      include: FORWARD_INCLUDE,
    });
    return caseForwardMapper.toDomain(item);
  },
};
