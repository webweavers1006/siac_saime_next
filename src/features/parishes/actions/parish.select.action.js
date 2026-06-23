"use server";

import { parishReadRepository } from "../repositories/parish.read.repository";

/**
 * Returns a flat list of Parishes for use in async select dropdowns.
 * Public lookup — no permission required (returns only labels and IDs).
 * @param {Object} options
 * @param {string} [options.searchTerm] - Text search filter
 * @param {number} [options.municipalityId] - Optional filter by municipality
 */
export async function getParishesForSelectAction({ searchTerm, municipalityId } = {}) {
  const result = await parishReadRepository.findMany({
    page: 1,
    pageSize: 1200,
    searchTerm: searchTerm || "",
    municipalityId: municipalityId || undefined,
    sortKey: "name",
    sortDirection: "asc",
  });
  return result.items.map((item) => ({
    label: item.name,
    value: item.id,
  }));
}
