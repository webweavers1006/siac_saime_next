"use server";

import { beneficiaryTypeReadRepository } from "../repositories/beneficiary-type.read.repository";

/**
 * Returns a flat list of Beneficiary Types for use in async select dropdowns.
 * Public lookup — no permission required (returns only labels and IDs).
 */
export async function getBeneficiaryTypesForSelectAction({ searchTerm } = {}) {
  const result = await beneficiaryTypeReadRepository.findMany({
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
