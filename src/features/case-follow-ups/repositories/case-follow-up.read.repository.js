import prisma from "@/features/shared/lib/prisma";
import { caseFollowUpMapper } from "../mappers/case-follow-up.mapper";

const FOLLOW_UP_INCLUDE = {
  callStatus: { select: { name: true } },
  user: { select: { firstName: true, lastName: true } },
  currentDirection: { select: { name: true } },
};

export const caseFollowUpReadRepository = {
  async findMany({ page = 1, pageSize = 20, sortKey = "date", sortDirection = "desc", caseId } = {}) {
    const skip = (page - 1) * pageSize;
    const dbKey = caseFollowUpMapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "desc" };

    const where = {
      deletedAt: null,
      ...(caseId != null && { caseId: Number(caseId) }),
    };

    const [totalCount, items] = await Promise.all([
      prisma.caseFollowUp.count({ where }),
      prisma.caseFollowUp.findMany({ where, skip, take: pageSize, orderBy, include: FOLLOW_UP_INCLUDE }),
    ]);

    return {
      items: caseFollowUpMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.caseFollowUp.findFirst({
      where: { id: Number(id), deletedAt: null },
      include: FOLLOW_UP_INCLUDE,
    });
    return caseFollowUpMapper.toDomain(item);
  },

  async findByCaseId(caseId) {
    const items = await prisma.caseFollowUp.findMany({
      where: { caseId: Number(caseId), deletedAt: null },
      orderBy: { date: "desc" },
      include: FOLLOW_UP_INCLUDE,
    });
    return caseFollowUpMapper.toDomainList(items);
  },
};
