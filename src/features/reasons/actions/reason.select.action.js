"use server";

import { reasonReadRepository } from "../repositories/reason.read.repository";

/**
 * Returns a flat list of Reasons for use in async select dropdowns.
 * Public lookup — no permission required (returns only labels and IDs).
 * @param {Object} options
 * @param {string} [options.searchTerm] - Text search filter
 * @param {number} [options.caseAreaId] - Optional filter by case area
 */
export async function getReasonsForSelectAction({ searchTerm, caseAreaId } = {}) {
  const result = await reasonReadRepository.findMany({
    page: 1,
    pageSize: 100,
    searchTerm: searchTerm || "",
    caseAreaId: caseAreaId || undefined,
    sortKey: "name",
    sortDirection: "asc",
  });
  return result.items.map((item) => ({
    label: item.name,
    value: item.id,
  }));
}
