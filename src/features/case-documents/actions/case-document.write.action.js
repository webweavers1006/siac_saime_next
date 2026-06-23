"use server";

import { revalidatePath } from "next/cache";
import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { CASE_DOCUMENT_CONFIG } from "../config/case-document.constants";
import { validateClientFile } from "@/features/shared/lib/file-validation";
import { saveUploadedFile, deleteStoredFile } from "../services/case-document.storage.service";
import { createCaseDocument, deleteCaseDocument } from "../services/case-document.write.service";
import { logger } from "@/features/shared/lib/logger";

const { LABELS } = CASE_DOCUMENT_CONFIG.UI;

/**
 * Uploads a case document from FormData.
 *
 * Expected FormData fields:
 *   - file: File
 *   - caseId: string (number)
 *   - description: string (optional)
 */
export const uploadCaseDocumentAction = createProtectedFunction(
  CASE_DOCUMENT_CONFIG.PERMISSIONS.WRITE,
  async (formData) => {
    if (!(formData instanceof FormData)) {
      return { success: false, error: "Datos inválidos." };
    }

    const file = formData.get("file");
    const caseIdRaw = formData.get("caseId");
    const description = formData.get("description") || "";

    if (!caseIdRaw) {
      return { success: false, error: "El caso es requerido." };
    }

    const caseId = Number(caseIdRaw);
    if (isNaN(caseId) || caseId < 1) {
      return { success: false, error: "ID de caso inválido." };
    }

    // Validate file
    const validation = validateClientFile(file);
    if (!validation.valid) {
      const errorKey = validation.error;
      const messages = LABELS.MESSAGES.ERROR;
      return { success: false, error: messages[errorKey] || "Archivo inválido." };
    }

    // Save file to disk
    const saveResult = await saveUploadedFile(file, caseId);
    if (!saveResult.success) {
      return { success: false, error: LABELS.MESSAGES.ERROR.STORAGE };
    }

    // Create DB record
    const { fileInfo } = validation;
    const createResult = await createCaseDocument({
      caseId,
      filePath: saveResult.filePath,
      description: description?.trim() || null,
      originalName: fileInfo.originalName,
      fileSize: fileInfo.fileSize,
      mimeType: fileInfo.mimeType,
      extension: fileInfo.extension,
    });

    if (!createResult.success) {
      // Rollback: delete the saved file if DB insert fails
      deleteStoredFile(saveResult.filePath).catch(() => {});
      return createResult;
    }

    revalidatePath("/admin/casos");
    return { success: true, data: createResult.data, message: LABELS.MESSAGES.SUCCESS.UPLOAD };
  }
);

/**
 * Soft-deletes a case document (DB + physical file).
 */
export const deleteCaseDocumentAction = createProtectedFunction(
  CASE_DOCUMENT_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    const result = await deleteCaseDocument(id);
    if (result.success) {
      revalidatePath("/admin/casos");
    }
    return result;
  }
);
