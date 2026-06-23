"use server";

import { countryReadRepository } from "../repositories/country.read.repository";

/**
 * Returns a flat list of Countries for use in async select dropdowns.
 * Public lookup — no permission required (returns only labels and IDs).
 */
export async function getCountriesForSelectAction({ searchTerm } = {}) {
  const result = await countryReadRepository.findMany({
    page: 1,
    pageSize: 300,
    searchTerm: searchTerm || "",
    sortKey: "name",
    sortDirection: "asc",
  });
  return result.items.map((item) => ({
    label: item.name,
    value: item.id,
  }));
}
