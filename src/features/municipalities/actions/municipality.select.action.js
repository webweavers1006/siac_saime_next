"use server";

import { municipalityReadRepository } from "../repositories/municipality.read.repository";

/**
 * Returns a flat list of Municipalities for use in async select dropdowns.
 * Public lookup — no permission required (returns only labels and IDs).
 * @param {Object} options
 * @param {string} [options.searchTerm] - Text search filter
 * @param {number} [options.stateId] - Optional filter by state
 */
export async function getMunicipalitiesForSelectAction({ searchTerm, stateId } = {}) {
  const result = await municipalityReadRepository.findMany({
    page: 1,
    pageSize: 400,
    searchTerm: searchTerm || "",
    stateId: stateId || undefined,
    sortKey: "name",
    sortDirection: "asc",
  });
  return result.items.map((item) => ({
    label: item.name,
    value: item.id,
  }));
}
