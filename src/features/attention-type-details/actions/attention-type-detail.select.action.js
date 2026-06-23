"use server";

import { attentionTypeDetailReadRepository } from "../repositories/attention-type-detail.read.repository";

/**
 * Returns a flat list of Attention Type Details for use in async select dropdowns.
 * Public lookup — no permission required (returns only labels and IDs).
 * @param {Object} options
 * @param {string} [options.searchTerm] - Text search filter
 * @param {number} [options.attentionTypeId] - Optional filter by attention type
 */
export async function getAttentionTypeDetailsForSelectAction({ searchTerm, attentionTypeId } = {}) {
  const result = await attentionTypeDetailReadRepository.findMany({
    page: 1,
    pageSize: 100,
    searchTerm: searchTerm || "",
    attentionTypeId: attentionTypeId || undefined,
    sortKey: "name",
    sortDirection: "asc",
  });
  return result.items.map((item) => ({
    label: item.name,
    value: item.id,
  }));
}
