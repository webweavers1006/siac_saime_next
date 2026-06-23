"use server";

import { officeReadRepository } from "../repositories/offices.read.repository";

/**
 * Returns a flat list of Offices for use in async select dropdowns.
 * Public lookup — no permission required (returns only labels and IDs).
 * @param {Object} options
 * @param {string} [options.searchTerm] - Text search filter
 * @param {number} [options.stateId] - Optional filter by state
 * @param {boolean} [options.enableQrTicket] - Optional filter by QR ticket enabled
 */
export async function getOfficesForSelectAction({ searchTerm, stateId, enableQrTicket } = {}) {
  const result = await officeReadRepository.findMany({
    page: 1,
    pageSize: 100,
    searchTerm: searchTerm || "",
    stateId: stateId || undefined,
    enableQrTicket: enableQrTicket !== undefined ? enableQrTicket : undefined,
    sortKey: "name",
    sortDirection: "asc",
  });
  return result.items.map((item) => ({
    label: item.name,
    value: item.id,
  }));
}
