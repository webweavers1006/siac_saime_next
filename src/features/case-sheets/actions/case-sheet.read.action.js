"use server";

/**
 * case-sheet.read.action.js
 * Protected server action for fetching case planilla data.
 * The API route calls this action instead of directly accessing services.
 *
 * Architecture: API route → action → service → repository
 */

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { CASE_SHEET_CONFIG } from "../config/case-sheet.constants";
import { fetchSheetData } from "../services/case-sheet.read.service";
import { logger } from "@/features/shared";

/**
 * Fetches planilla data for a single case. Used by the API route.
 *
 * @param {{ caseId: number }} params
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export const getCaseSheetDataAction = createProtectedFunction(
  CASE_SHEET_CONFIG.PERMISSIONS.GENERATE,
  async (params) => {
    try {
      const { caseId } = params;

      if (!caseId || !Number.isFinite(caseId) || caseId < 1) {
        return { success: false, error: "ID de caso inválido." };
      }

      const data = await fetchSheetData(caseId);

      if (!data) {
        return { success: false, error: "Caso no encontrado." };
      }

      return { success: true, data };
    } catch (error) {
      logger.error("getCaseSheetDataAction failed", { error: error.message });
      return { success: false, error: "Error al obtener datos de la planilla." };
    }
  }
);
