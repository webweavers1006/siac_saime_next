"use server";

import { popularOrganizationReadRepository } from "../repositories/popular-organization.read.repository";

/**
 * Returns a flat list of Popular Organizations for use in async select dropdowns.
 * Public lookup — no permission required (returns only labels and IDs).
 */
export async function getPopularOrganizationsForSelectAction({ searchTerm } = {}) {
  const result = await popularOrganizationReadRepository.findMany({
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
