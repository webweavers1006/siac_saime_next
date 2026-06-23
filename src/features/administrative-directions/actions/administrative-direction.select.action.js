"use server";

import { administrativeDirectionReadRepository } from "../repositories/administrative-direction.read.repository";

/**
 * Returns a flat list of Administrative Directions for use in async select dropdowns.
 * Public lookup — no permission required (returns only labels and IDs).
 */
export async function getAdministrativeDirectionsForSelectAction({ searchTerm } = {}) {
  const result = await administrativeDirectionReadRepository.findMany({
    page: 1,
    pageSize: 200,
    searchTerm: searchTerm || "",
    sortKey: "name",
    sortDirection: "asc",
  });
  return result.items.map((item) => ({
    label: item.name,
    value: item.id,
  }));
}
