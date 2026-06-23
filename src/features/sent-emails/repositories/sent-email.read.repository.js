import prisma from "@/features/shared/lib/prisma";
import { sentEmailMapper } from "../mappers/sent-email.mapper";

const SENT_EMAIL_INCLUDE = {
  case: { select: { requestNumber: true } },
  user: { select: { id: true, firstName: true, lastName: true } },
};

export const sentEmailReadRepository = {
  /**
   * Paginated list of sent emails with optional filters.
   * @param {Object} params
   * @param {number} params.page
   * @param {number} params.pageSize
   * @param {string} [params.searchTerm] - Search in subject or toAddress.
   * @param {string} [params.reason] - Filter by reason enum.
   * @param {string} [params.status] - Filter by status enum.
   * @param {string} [params.dateFrom] - ISO date string for sentAt range start.
   * @param {string} [params.dateTo] - ISO date string for sentAt range end.
   * @param {number} [params.caseId] - Filter by case.
   * @param {string} [params.sortKey]
   * @param {string} [params.sortDirection]
   */
  async findMany({
    page,
    pageSize,
    searchTerm,
    reason,
    status,
    dateFrom,
    dateTo,
    caseId,
    sortKey,
    sortDirection,
  }) {
    const skip = (page - 1) * pageSize;
    const dbKey = sentEmailMapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "desc" };

    const where = {
      ...(searchTerm && {
        OR: [
          { subject: { contains: searchTerm, mode: "insensitive" } },
          { toAddress: { contains: searchTerm, mode: "insensitive" } },
        ],
      }),
      ...(reason && { reason }),
      ...(status && { status }),
      ...(caseId && { caseId }),
      ...(dateFrom || dateTo) && {
        sentAt: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      },
    };

    const [totalCount, items] = await Promise.all([
      prisma.sentEmail.count({ where }),
      prisma.sentEmail.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: SENT_EMAIL_INCLUDE,
      }),
    ]);

    return {
      items: sentEmailMapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  /**
   * Finds a single sent email by ID, with related case data for resending.
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const record = await prisma.sentEmail.findUnique({
      where: { id },
      include: {
        ...SENT_EMAIL_INCLUDE,
        case: {
          select: {
            requestNumber: true,
            caseDate: true,
            person: { select: { firstName: true, lastName: true, email: true } },
            caseStatus: { select: { name: true } },
            attentionType: { select: { name: true } },
            reason: { select: { name: true } },
          },
        },
      },
    });
    return sentEmailMapper.toDomain(record);
  },

  /**
   * Fetches current case data needed to rebuild an email template for resend.
   * Queries the Case model with person, status, reason, and attention type.
   * @param {number} caseId
   * @returns {Promise<Object|null>}
   */
  async findCaseDataForResend(caseId) {
    return prisma.case.findUnique({
      where: { id: caseId },
      select: {
        requestNumber: true,
        caseDate: true,
        caseStatus: { select: { name: true } },
        attentionType: { select: { name: true } },
        reason: { select: { name: true } },
        person: { select: { firstName: true, lastName: true, email: true } },
      },
    });
  },
};
