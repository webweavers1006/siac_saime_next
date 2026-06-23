import { caseCoordinateWriteRepository } from "../repositories/case-coordinate.write.repository";
import { caseCoordinateReadRepository } from "../repositories/case-coordinate.read.repository";
import { logger } from "@/features/shared/lib/logger";

/**
 * Upserts a coordinate for a case.
 * Since case-coordinate is 1:1, we soft-delete any existing and create a new one.
 */
export async function upsertCaseCoordinate(data) {
  if (!data.caseId) {
    return { success: false, error: "El caso es requerido." };
  }

  try {
    // Soft-delete existing coordinate for this case
    await caseCoordinateWriteRepository.softDeleteByCaseId(data.caseId);

    // Create the new coordinate
    const result = await caseCoordinateWriteRepository.create(data);
    return { success: true, data: result, message: "Coordenada guardada exitosamente." };
  } catch (error) {
    logger.error("Failed to upsert coordinate", { error: error.message });
    return { success: false, error: "Error al guardar la coordenada." };
  }
}

/**
 * Updates an existing coordinate by ID.
 */
export async function updateCaseCoordinate(id, data) {
  try {
    const existing = await caseCoordinateReadRepository.findById(id);
    if (!existing) {
      return { success: false, error: "La coordenada no existe." };
    }

    const result = await caseCoordinateWriteRepository.update(id, data);
    return { success: true, data: result, message: "Coordenada actualizada exitosamente." };
  } catch (error) {
    logger.error("Failed to update coordinate", { error: error.message, id });
    return { success: false, error: "Error al actualizar la coordenada." };
  }
}

/**
 * Soft-deletes a coordinate.
 */
export async function deleteCaseCoordinate(id) {
  try {
    await caseCoordinateWriteRepository.softDelete(id);
    return { success: true, message: "Coordenada eliminada exitosamente." };
  } catch (error) {
    logger.error("Failed to delete coordinate", { error: error.message, id });
    return { success: false, error: "Error al eliminar la coordenada." };
  }
}
