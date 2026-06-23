"use server";

import { stateReadRepository } from "../repositories/state.read.repository";

/**
 * Returns a flat list of States for use in async select dropdowns.
 * Public lookup — no permission required (returns only labels and IDs).
 * @param {Object} options
 * @param {string} [options.searchTerm] - Text search filter
 * @param {number} [options.countryId] - Optional filter by country
 */
export async function getStatesForSelectAction({ searchTerm, countryId } = {}) {
  const result = await stateReadRepository.findMany({
    page: 1,
    pageSize: 30,
    searchTerm: searchTerm || "",
    countryId: countryId || undefined,
    sortKey: "name",
    sortDirection: "asc",
  });
  return result.items.map((item) => ({
    label: item.name,
    value: item.id,
  }));
}
