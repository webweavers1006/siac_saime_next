"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { CASE_CONFIG } from "../config/case.constants";
import { fetchCasesList, fetchOperatorCaseDefaults, fetchOperatorAllowedAreas } from "../services/case.read.service";

export const getCasesListAction = createProtectedFunction(
  CASE_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetchCasesList(params);
  }
);

/**
 * Public read-only action — returns the operator's case defaults.
 * No permission check needed (uses session, not role-specific data).
 */
export async function getOperatorDefaultsAction() {
  return fetchOperatorCaseDefaults();
}

/**
 * Returns only the areas the current operator is allowed to use.
 * Server-side filtering — the form dropdown calls this directly.
 */
export async function getOperatorAllowedAreasAction({ searchTerm } = {}) {
  return fetchOperatorAllowedAreas(searchTerm);
}
