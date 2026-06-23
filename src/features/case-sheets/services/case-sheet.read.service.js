/**
 * case-sheet.read.service.js
 * Business logic for fetching case data needed for planilla PDF generation.
 */

import { findCaseSheetData, findBatchCaseSheetData } from "../repositories/case-sheet.read.repository";
import { toSheetData, toSheetDataList } from "../mappers/case-sheet.mapper";
import { logger } from "@/features/shared";

/**
 * Fetches and transforms all data needed to render a planilla for one case.
 *
 * @param {number} caseId
 * @returns {Promise<object|null>} Template-ready data or null if case not found
 */
export async function fetchSheetData(caseId) {
  try {
    const raw = await findCaseSheetData(caseId);
    if (!raw) return null;
    return toSheetData(raw);
  } catch (error) {
    logger.error("Failed to fetch case sheet data", { caseId, error: error.message });
    throw new Error("No se pudo obtener los datos del caso para la planilla.");
  }
}

/**
 * Fetches planilla data for multiple cases (batch).
 *
 * @param {number[]} caseIds
 * @returns {Promise<object[]>} Array of template-ready data objects
 */
export async function fetchBatchSheetData(caseIds) {
  try {
    const rawList = await findBatchCaseSheetData(caseIds);
    return toSheetDataList(rawList);
  } catch (error) {
    logger.error("Failed to fetch batch case sheet data", { caseIds, error: error.message });
    throw new Error("No se pudo obtener los datos para las planillas por lote.");
  }
}
