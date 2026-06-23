import prisma from "@/features/shared/lib/prisma";
import { caseCoordinateMapper } from "../mappers/case-coordinate.mapper";

/**
 * Read repository for the Case Map — queries Parish geo data with case counts.
 *
 * Data chain: Parish ← Person ← Case
 * Uses two separate queries to avoid Prisma nested-count limitations.
 */

export const caseCoordinateReadRepository = {
  /**
   * Returns ALL parishes with geoData polygons, municipality/state info,
   * and case count (via Person → Case). No pagination — used for the map.
   *
   * @param {object} [filters]
   * @param {number} [filters.stateId]
   * @param {number} [filters.municipalityId]
   * @param {string} [filters.searchTerm] — search by parish name
   * @param {number} [filters.caseAreaId] — filter cases by area
   * @param {number} [filters.caseStatusId] — filter cases by status
   */
  async findAllForMap({ stateId, municipalityId, searchTerm, caseAreaId, caseStatusId } = {}) {
    // Build parish WHERE clause
    const parishWhere = {
      deletedAt: null,
      geoData: { not: null },
      ...(stateId != null && { municipality: { stateId: Number(stateId) } }),
      ...(municipalityId != null && { municipalityId: Number(municipalityId) }),
      ...(searchTerm && { name: { contains: searchTerm, mode: "insensitive" } }),
    };

    // Build case WHERE clause for the count
    const caseWhere = { deletedAt: null };
    if (caseAreaId != null) caseWhere.caseAreaId = Number(caseAreaId);
    if (caseStatusId != null) caseWhere.caseStatusId = Number(caseStatusId);

    const hasCaseFilter = caseAreaId != null || caseStatusId != null;

    // ── Query 1: All parishes with geoData ──────────────────────────────
    const parishes = await prisma.parish.findMany({
      where: parishWhere,
      include: {
        municipality: {
          select: {
            id: true,
            name: true,
            stateId: true,
            state: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // ── Query 2: Case count grouped by parish (via Person) ──────────────
    const cases = await prisma.case.findMany({
      where: caseWhere,
      select: {
        person: { select: { parishId: true } },
      },
    });

    // Build a map of parishId → case count
    const caseCountByParish = {};
    for (const c of cases) {
      const pid = c.person?.parishId;
      if (pid != null) {
        caseCountByParish[pid] = (caseCountByParish[pid] || 0) + 1;
      }
    }

    // ── Merge: attach caseCount to each parish domain object ────────────
    return parishes
      .map((p) => {
        const caseCount = caseCountByParish[p.id] || 0;

        // If filtering by case area/status, exclude parishes with 0 matching cases
        if (hasCaseFilter && caseCount === 0) return null;

        return caseCoordinateMapper.toDomain({
          ...p,
          _count: { persons: caseCount },
        });
      })
      .filter(Boolean);
  },

  /**
   * Returns paginated list (for potential table view).
   */
  async findMany({ page = 1, pageSize = 10, searchTerm } = {}) {
    // Simplified — main use is findAllForMap
    const skip = (page - 1) * pageSize;
    const where = {
      deletedAt: null,
      geoData: { not: null },
      ...(searchTerm && { name: { contains: searchTerm, mode: "insensitive" } }),
    };

    const [totalCount, items] = await Promise.all([
      prisma.parish.count({ where }),
      prisma.parish.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          municipality: {
            select: {
              id: true,
              name: true,
              stateId: true,
              state: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { name: "asc" },
      }),
    ]);

    return {
      items: caseCoordinateMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  /**
   * Returns total cases across all parishes (for summary).
   */
  async countTotalCases({ caseAreaId, caseStatusId } = {}) {
    const where = { deletedAt: null };
    if (caseAreaId != null) where.caseAreaId = Number(caseAreaId);
    if (caseStatusId != null) where.caseStatusId = Number(caseStatusId);
    return prisma.case.count({ where });
  },
};
