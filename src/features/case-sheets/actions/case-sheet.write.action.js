/**
 * case-sheet.write.action.js
 * Protected server actions for generating case planilla PDFs.
 *
 * Individual: generateCaseSheetAction(caseId) → PDF download
 * Batch: generateBatchSheetsAction(caseIds) → ZIP download
 */

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { CASE_SHEET_CONFIG } from "../config/case-sheet.constants";
import { generateSheetParamsSchema, batchGenerateParamsSchema } from "../schemas/case-sheet.schema";
import { fetchSheetData, fetchBatchSheetData } from "../services/case-sheet.read.service";
import { generateSheetBuffer, generateBatchSheetBuffers } from "../services/case-sheet.write.service";
import { logger } from "@/features/shared";

/**
 * Generates a planilla PDF for a single case.
 * Returns the PDF buffer ready for download.
 *
 * @param {{ caseId: number }} params
 * @returns {Promise<{ success: boolean, buffer?: Buffer, filename?: string, error?: string }>}
 */
export const generateCaseSheetAction = createProtectedFunction(
  CASE_SHEET_CONFIG.PERMISSIONS.GENERATE,
  async (params) => {
    try {
      const parsed = generateSheetParamsSchema.safeParse(params);
      if (!parsed.success) {
        return { success: false, error: "ID de caso inválido." };
      }

      const { caseId } = parsed.data;

      // 1. Fetch case data
      const sheetData = await fetchSheetData(caseId);
      if (!sheetData) {
        return { success: false, error: "Caso no encontrado." };
      }

      // 2. Generate PDF
      const buffer = generateSheetBuffer(sheetData);

      // 3. Build filename
      const safeName = (sheetData.requestNumber || `caso-${caseId}`).replace(/[^a-zA-Z0-9_-]/g, "_");
      const filename = `planilla_${safeName}.pdf`;

      return { success: true, buffer, filename };
    } catch (error) {
      logger.error("Failed to generate case sheet", { error: error.message });
      return { success: false, error: "Error al generar la planilla." };
    }
  }
);

/**
 * Generates planilla PDFs for multiple cases (batch).
 * Returns an array of { caseId, buffer, filename } for the route handler to ZIP.
 *
 * @param {{ caseIds: number[] }} params
 * @returns {Promise<{ success: boolean, sheets?: Array, error?: string }>}
 */
export const generateBatchSheetsAction = createProtectedFunction(
  CASE_SHEET_CONFIG.PERMISSIONS.GENERATE,
  async (params) => {
    try {
      const parsed = batchGenerateParamsSchema.safeParse(params);
      if (!parsed.success) {
        return { success: false, error: "Selección inválida. Máximo 50 casos." };
      }

      const { caseIds } = parsed.data;

      // 1. Fetch all case data
      const sheetDataList = await fetchBatchSheetData(caseIds);

      if (sheetDataList.length === 0) {
        return { success: false, error: "No se encontraron casos para generar planillas." };
      }

      // 2. Generate PDFs
      const sheets = generateBatchSheetBuffers(sheetDataList);

      return { success: true, sheets };
    } catch (error) {
      logger.error("Failed to generate batch sheets", { error: error.message });
      return { success: false, error: "Error al generar las planillas por lote." };
    }
  }
);
