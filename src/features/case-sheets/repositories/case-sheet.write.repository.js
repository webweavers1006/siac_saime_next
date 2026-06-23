/**
 * case-sheet.write.repository.js
 * Write-side data access for case planilla generation.
 *
 * Currently a stub — reserved for future audit trail:
 *   - Register each planilla generation event (who, when, which case)
 *   - Could use a dedicated table or the existing AuditLog model.
 *
 * Following the A-S-R-M standard: every feature should have a write repository,
 * even if initially minimal, to avoid structural inconsistency.
 */

import prisma from "@/features/shared/lib/prisma";
import { logger } from "@/features/shared";

/**
 * Stub: registers a planilla generation event.
 * Implement when audit requirements are defined.
 *
 * @param {{ caseId: number, userId: string }} params
 * @returns {Promise<void>}
 */
export async function createSheetGenerationRecord({ caseId, userId }) {
  try {
    // Placeholder — will be implemented when audit model is ready.
    // Example future implementation:
    // await prisma.auditLog.create({
    //   data: {
    //     action: "PLANILLA_GENERADA",
    //     entityType: "Case",
    //     entityId: caseId,
    //     userId,
    //   },
    // });
    logger.info("Planilla generation recorded (stub)", { caseId, userId });
  } catch (error) {
    // Fire-and-forget — never block the PDF download
    logger.error("Failed to record sheet generation", { error: error.message });
  }
}
