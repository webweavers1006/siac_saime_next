import prisma from "@/features/shared/lib/prisma";
import { caseMapper } from "../mappers/case.mapper";

/**
 * Shared include object for all case reads.
 * Includes all FK relations with only the fields needed for display.
 */
const CASE_INCLUDE = {
  person: { select: { id: true, firstName: true, lastName: true, idCard: true } },
  user: { select: { id: true, firstName: true, lastName: true } },
  caseStatus: { select: { id: true, name: true } },
  caseArea: { select: { id: true, name: true } },
  reason: { select: { id: true, name: true } },
  attentionType: { select: { id: true, name: true } },
  attentionTypeDetail: { select: { id: true, name: true } },
  attentionChannel: { select: { id: true, name: true } },
  attachedEntity: { select: { id: true, name: true } },
  popularOrganization: { select: { id: true, name: true } },
  office: { select: { id: true, name: true } },
  caseComplaints: true,
};

export const caseReadRepository = {
  /**
   * @param {Object} params
   * @param {Object} [params.scope] - Scope filter for row-level access control.
   *   { type: 'all' } → no filter (admin / read_all permission)
   *   { type: 'scoped', userId, administrativeDirectionId } → own cases + forwarded to direction
   *   { type: 'none' } → no access (should never happen, returns empty)
   */
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection, scope }) {
    const skip = (page - 1) * pageSize;
    const dbKey = caseMapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "asc" };

    const where = {
      ...(searchTerm && {
        requestNumber: { contains: searchTerm, mode: "insensitive" },
      }),
      deletedAt: null,
      ...buildScopeFilter(scope),
    };

    const [totalCount, items] = await Promise.all([
      prisma.case.count({ where }),
      prisma.case.findMany({ where, skip, take: pageSize, orderBy, include: CASE_INCLUDE }),
    ]);

    return {
      items: caseMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.case.findUnique({
      where: { id: Number(id) },
      include: CASE_INCLUDE,
    });
    return caseMapper.toDomain(item);
  },

  async findByRequestNumber(requestNumber, excludeId = null) {
    return await prisma.case.findFirst({
      where: {
        requestNumber: { equals: requestNumber, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId && { id: { not: Number(excludeId) } }),
      },
    });
  },
};

/**
 * Builds the Prisma WHERE clause for row-level scope.
 *
 * - scope.type === 'all' → no extra filter (admin / read_all)
 * - scope.type === 'scoped' → userId matches OR an active forward exists to user's direction
 * - scope.type === 'none' or undefined → force empty result (safety)
 */
function buildScopeFilter(scope) {
  if (!scope || scope.type === 'none') {
    // No scope → force empty (safety: should never reach here without a valid scope)
    return { id: -1 };
  }

  if (scope.type === 'all') {
    return {};
  }

  if (scope.type === 'scoped') {
    const { userId, administrativeDirectionId } = scope;
    const conditions = [];

    // User's own cases
    if (userId) {
      conditions.push({ userId });
    }

    // Cases forwarded to user's direction (active forward)
    if (administrativeDirectionId) {
      conditions.push({
        caseForwards: {
          some: {
            administrativeDirectionId,
            isActive: true,
            deletedAt: null,
          },
        },
      });
    }

    // If no conditions can be built, force empty
    if (conditions.length === 0) {
      return { id: -1 };
    }

    // If only one condition, use it directly
    if (conditions.length === 1) {
      return conditions[0];
    }

    // Multiple conditions → OR
    return { OR: conditions };
  }

  // Unknown scope type → force empty
  return { id: -1 };
}
