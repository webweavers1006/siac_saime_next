"use server";

import { attentionTypeReadRepository } from "../repositories/attention-type.read.repository";

/**
 * Returns a flat list of Attention Types for use in async select dropdowns.
 * Public lookup — no permission required (returns only labels and IDs).
 */
export async function getAttentionTypesForSelectAction({ searchTerm } = {}) {
  const result = await attentionTypeReadRepository.findMany({
    page: 1,
    pageSize: 100,
    searchTerm: searchTerm || "",
    sortKey: "name",
    sortDirection: "asc",
  });
  return result.items.map((item) => ({
    label: item.name,
    value: item.id,
    hasComplaint: item.hasComplaint,
    hasAttentionDetail: item.hasAttentionDetail,
    showCoordinates: item.showCoordinates,
    showDocuments: item.showDocuments,
  }));
}
