"use server";

import { caseStatusReadRepository } from "../repositories/case-status.read.repository";

/**
 * Returns a flat list of Case Statuses for use in async select dropdowns.
 * Public lookup — no permission required (returns only labels and IDs).
 */
export async function getCaseStatusesForSelectAction({ searchTerm } = {}) {
  const result = await caseStatusReadRepository.findMany({
    page: 1,
    pageSize: 100,
    searchTerm: searchTerm || "",
    sortKey: "name",
    sortDirection: "asc",
  });
  return result.items.map((item) => ({
    label: item.name,
    value: item.id,
  }));
}
