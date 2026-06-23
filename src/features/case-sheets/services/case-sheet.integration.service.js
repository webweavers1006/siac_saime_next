/**
 * case-sheet.integration.service.js
 * Cross-feature integration: generates planilla PDF for email attachment.
 *
 * Used by: case.write.service.js → notifyEmailCaseCreated()
 * Architecture: this service isolates case-sheets PDF logic so the
 *               cases feature doesn't need to import PDF internals.
 *
 * Fire-and-forget compatible — returns empty array on failure.
 */

import { fetchSheetData } from "./case-sheet.read.service";
import { generateSheetBuffer } from "./case-sheet.write.service";
import { logger } from "@/features/shared";

/**
 * Generates a planilla PDF buffer and wraps it as a nodemailer attachment.
 * Safe to call fire-and-forget — never throws.
 *
 * @param {number} caseId
 * @returns {Promise<Array<{filename: string, content: Buffer, contentType: string}>>}
 */
export async function attachPlanillaToEmail(caseId) {
  try {
    const data = await fetchSheetData(caseId);
    if (!data) return [];

    const buffer = generateSheetBuffer(data);
    const safeName = (data.requestNumber || `caso-${caseId}`).replace(/[^a-zA-Z0-9_-]/g, "_");

    return [
      {
        filename: `planilla_${safeName}.pdf`,
        content: buffer,
        contentType: "application/pdf",
      },
    ];
  } catch (error) {
    logger.error("attachPlanillaToEmail failed (non-blocking)", {
      caseId,
      error: error.message,
    });
    return [];
  }
}
