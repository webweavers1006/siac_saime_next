"use server";

import { caseAreaReadRepository } from "../repositories/case-area.read.repository";

/**
 * Returns a flat list of Case Areas for use in async select dropdowns.
 * Public read-only lookup — no permission required.
 */
export async function getCaseAreasForSelectAction({ searchTerm } = {}) {
  const result = await caseAreaReadRepository.findMany({
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
