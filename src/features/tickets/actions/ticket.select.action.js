"use server";

import { ticketReadRepository } from "../repositories/ticket.read.repository";

/**
 * Returns a flat list of tickets for use in async select dropdowns.
 * Public lookup — no permission required (returns only labels and IDs).
 *
 * @param {Object} options
 * @param {string} [options.searchTerm] - Text search filter
 * @param {number} [options.officeId] - Optional filter by office
 * @param {string} [options.status] - Optional filter by status
 */
export async function getTicketsForSelectAction({ searchTerm, officeId, status } = {}) {
  const result = await ticketReadRepository.findMany({
    page: 1,
    pageSize: 100,
    searchTerm: searchTerm || "",
    officeId: officeId || undefined,
    status: status || undefined,
    sortKey: "createdAt",
    sortDirection: "desc",
  });
  return result.items.map((item) => ({
    label: `${item.ticketNumber} — ${item.personFirstName || "Sin nombre"}`,
    value: item.id,
  }));
}
