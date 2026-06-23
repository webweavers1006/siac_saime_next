/**
 * Business validation rules for case documents.
 */
export async function validateCaseDocumentRules(data, _excludeId = null) {
  if (!data.caseId) {
    return {
      success: false,
      error: "El caso es requerido.",
      details: { caseId: ["El caso es requerido."] },
    };
  }

  if (!data.filePath || data.filePath.trim().length === 0) {
    return {
      success: false,
      error: "La ruta del archivo es requerida.",
      details: { filePath: ["La ruta del archivo es requerida."] },
    };
  }

  return { success: true };
}
