import { caseComplaintWriteRepository } from "../repositories/case-complaint.write.repository";
import { logger } from "@/features/shared/lib/logger";

/**
 * Checks if a complaint object has any meaningful data.
 */
function hasComplaintData(complaint) {
  if (!complaint) return false;
  return Object.values(complaint).some(
    (v) => v !== null && v !== undefined && v !== "" && v !== false
  );
}

/**
 * Upserts a complaint for a case.
 * - If complaint data is provided: soft-delete existing + create new
 * - If complaint data is null/empty: do nothing
 *
 * @param {number} caseId
 * @param {Object|null} complaintData - The complaint fields from the form.
 * @returns {Promise<Object>} Result object.
 */
export async function upsertComplaint(caseId, complaintData) {
  if (!hasComplaintData(complaintData)) {
    return { success: true, data: null };
  }

  try {
    // Soft-delete any existing complaint for this case
    await caseComplaintWriteRepository.softDeleteByCaseId(caseId);

    // Create the new complaint
    const result = await caseComplaintWriteRepository.create({
      caseId,
      ...complaintData,
    });

    return { success: true, data: result };
  } catch (error) {
    logger.error("Failed to upsert complaint", { error: error.message, caseId });
    return { success: false, error: "Error al guardar la denuncia." };
  }
}
