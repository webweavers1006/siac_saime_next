import { caseDocumentReadRepository } from "../repositories/case-document.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchCaseDocumentsList(params) {
  try {
    return await caseDocumentReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch case documents list", { error: error.message });
    throw new Error("No se pudo obtener la lista de documentos.");
  }
}

export async function fetchCaseDocumentById(id) {
  try {
    return await caseDocumentReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch case document by ID", { error: error.message, id });
    throw new Error("No se pudo obtener el documento.");
  }
}

export async function fetchCaseDocumentsByCaseId(caseId) {
  try {
    return await caseDocumentReadRepository.findByCaseId(caseId);
  } catch (error) {
    logger.error("Failed to fetch documents by case ID", { error: error.message, caseId });
    throw new Error("No se pudieron obtener los documentos del caso.");
  }
}
