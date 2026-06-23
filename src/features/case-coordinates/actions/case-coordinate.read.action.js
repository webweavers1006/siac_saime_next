"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { CASE_COORDINATE_CONFIG } from "../config/case-coordinate.constants";
import { fetchAllCoordinatesForMap } from "../services/case-coordinate.read.service";

/**
 * Returns ALL parish features with case counts for the choropleth map.
 * Supports filters: stateId, municipalityId, searchTerm, caseAreaId, caseStatusId.
 */
export const getMapCoordinatesAction = createProtectedFunction(
  CASE_COORDINATE_CONFIG.PERMISSIONS.READ,
  async (filters) => {
    return fetchAllCoordinatesForMap(filters || {});
  }
);

