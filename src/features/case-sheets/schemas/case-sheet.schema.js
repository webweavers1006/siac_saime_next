/**
 * case-sheet.schema.js
 * Zod validation schemas for case planilla generation params.
 */

import { z } from "zod";

export const generateSheetParamsSchema = z.object({
  caseId: z.number().int().positive("ID de caso inválido"),
});

export const batchGenerateParamsSchema = z.object({
  caseIds: z
    .array(z.number().int().positive())
    .min(1, "Selecciona al menos un caso")
    .max(50, "Máximo 50 casos por lote"),
});
