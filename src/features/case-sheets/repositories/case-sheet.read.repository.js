/**
 * case-sheet.read.repository.js
 * Read-only data access for case planilla generation.
 * Queries Case with all related entities needed for PDF templates.
 */

import prisma from "@/features/shared/lib/prisma";

/**
 * Fetches all data needed to render a planilla PDF for a given case.
 * Matches the legacy Pdf_Model::obtenerCasos() JOIN across ~11 tables.
 *
 * @param {number} caseId
 * @returns {Promise<object|null>} Raw Prisma result with nested relations
 */
export async function findCaseSheetData(caseId) {
  return prisma.case.findUnique({
    where: { id: caseId, deletedAt: null },
    include: {
      person: {
        include: {
          municipality: { select: { name: true } },
          parish: { select: { name: true } },
        },
      },
      attentionType: { select: { id: true, name: true } },
      attachedEntity: { select: { name: true } },
      user: { select: { firstName: true, lastName: true } },
      caseComplaints: {
        where: { deletedAt: null },
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

/**
 * Fetches data for multiple cases (batch generation).
 *
 * @param {number[]} caseIds
 * @returns {Promise<object[]>} Array of raw Prisma results
 */
export async function findBatchCaseSheetData(caseIds) {
  return prisma.case.findMany({
    where: { id: { in: caseIds }, deletedAt: null },
    include: {
      person: {
        include: {
          municipality: { select: { name: true } },
          parish: { select: { name: true } },
        },
      },
      attentionType: { select: { id: true, name: true } },
      attachedEntity: { select: { name: true } },
      user: { select: { firstName: true, lastName: true } },
      caseComplaints: {
        where: { deletedAt: null },
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
