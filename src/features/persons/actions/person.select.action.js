"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { PERSON_CONFIG } from "../config/person.constants";
import { personReadRepository } from "../repositories/person.read.repository";

/**
 * Returns a flat list of Persons for use in async select dropdowns.
 * Label format: "Nombre Apellido" (trigger) + two-line renderOption (name / idCard).
 * Protected — exposes idCard (PII). Requires persons:read.
 */
export const getPersonsForSelectAction = createProtectedFunction(
  PERSON_CONFIG.PERMISSIONS.READ,
  async ({ searchTerm } = {}) => {
    const result = await personReadRepository.findMany({
      page: 1,
      pageSize: 100,
      searchTerm: searchTerm || "",
      sortKey: "firstName",
      sortDirection: "asc",
    });
    return result.items.map((item) => ({
      label: `${item.firstName} ${item.lastName || ""}`,
      value: item.id,
      firstName: item.firstName,
      lastName: item.lastName || "",
      idCard: item.idCard || "S/C",
    }));
  }
);
