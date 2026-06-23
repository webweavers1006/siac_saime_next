"use server";

import { attentionChannelReadRepository } from "../repositories/attention-channel.read.repository";

/**
 * Returns a flat list of Attention Channels for use in async select dropdowns.
 * Public lookup — no permission required (returns only labels and IDs).
 */
export async function getAttentionChannelsForSelectAction({ searchTerm } = {}) {
  const result = await attentionChannelReadRepository.findMany({
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
