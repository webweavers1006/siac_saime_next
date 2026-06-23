import { caseDocumentWriteRepository } from "../repositories/case-document.write.repository";
import { validateCaseDocumentRules } from "./case-document.validation.service";
import { saveUploadedFile } from "./case-document.storage.service";
import { logger } from "@/features/shared/lib/logger";

/**
 * Creates a case document from an already-validated file.
 * The file validation and storage happens BEFORE calling this.
 *
 * @param {Object} data - { caseId, filePath, description, originalName, fileSize, mimeType, extension }
 */
export async function createCaseDocument(data) {
  const validation = await validateCaseDocumentRules(data);
  if (!validation.success) return validation;

  try {
    const result = await caseDocumentWriteRepository.create(data);
    return { success: true, data: result };
  } catch (error) {
    logger.error("Failed to create case document", { error: error.message });
    return { success: false, error: "Error al crear el documento." };
  }
}

/**
 * Soft-deletes a case document (DB + physical file).
 */
export async function deleteCaseDocument(id) {
  try {
    await caseDocumentWriteRepository.softDelete(id);
    return { success: true, message: "Documento eliminado exitosamente." };
  } catch (error) {
    logger.error("Failed to delete case document", { error: error.message, id });
    return { success: false, error: "Error al eliminar el documento." };
  }
}
