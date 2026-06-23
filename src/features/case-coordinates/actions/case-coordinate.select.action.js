"use server";

import { caseCoordinateReadRepository } from "../repositories/case-coordinate.read.repository";

/**
 * Returns coordinates for a specific case for use in async select dropdowns or embedded views.
 * Public lookup — no permission required (returns only labels and IDs).
 *
 * @param {object} [options]
 * @param {string} [options.searchTerm] - Search by case request number or coordinate name
 * @param {number} [options.caseId] - Filter by specific case
 */
export async function getCaseCoordinatesForSelectAction({ searchTerm, caseId } = {}) {
  const result = await caseCoordinateReadRepository.findMany({
    page: 1,
    pageSize: 100,
    searchTerm: searchTerm || "",
    caseId: caseId || undefined,
    sortKey: "createdAt",
    sortDirection: "desc",
  });
  return result.items.map((item) => ({
    label: item.caseRequestNumber
      ? `${item.caseRequestNumber} — ${item.name || "Sin nombre"}`
      : item.name || `Coord #${item.id}`,
    value: item.id,
  }));
}
