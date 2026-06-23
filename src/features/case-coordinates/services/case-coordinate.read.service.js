import { caseCoordinateReadRepository } from "../repositories/case-coordinate.read.repository";
import { logger } from "@/features/shared/lib/logger";

/**
 * Fetches ALL parish features with case counts for the choropleth map.
 *
 * @param {object} [filters]
 * @param {number} [filters.stateId]
 * @param {number} [filters.municipalityId]
 * @param {string} [filters.searchTerm]
 * @param {number} [filters.caseAreaId]
 * @param {number} [filters.caseStatusId]
 */
export async function fetchAllCoordinatesForMap(filters) {
  try {
    return await caseCoordinateReadRepository.findAllForMap(filters);
  } catch (error) {
    logger.error("Failed to fetch parish geo data for map", { error: error.message });
    throw new Error("No se pudieron cargar los datos del mapa.");
  }
}

/**
 * Fetches total case count for summary.
 */
export async function fetchTotalCaseCount(filters) {
  try {
    return await caseCoordinateReadRepository.countTotalCases(filters);
  } catch (error) {
    logger.error("Failed to fetch total case count", { error: error.message });
    return 0;
  }
}

