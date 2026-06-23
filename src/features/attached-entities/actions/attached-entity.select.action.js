"use server";

import { attachedEntityReadRepository } from "../repositories/attached-entity.read.repository";

/**
 * Returns a flat list of Attached Entities for use in async select dropdowns.
 * Public lookup — no permission required (returns only labels and IDs).
 */
export async function getAttachedEntitiesForSelectAction({ searchTerm } = {}) {
  const result = await attachedEntityReadRepository.findMany({
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
