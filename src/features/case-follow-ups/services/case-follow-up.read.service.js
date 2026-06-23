import { caseFollowUpReadRepository } from "../repositories/case-follow-up.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchCaseFollowUpsList(params) {
  try {
    return await caseFollowUpReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch follow-ups list", { error: error.message });
    throw new Error("No se pudo obtener la lista de seguimientos.");
  }
}

export async function fetchCaseFollowUpById(id) {
  try {
    return await caseFollowUpReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch follow-up by ID", { error: error.message, id });
    throw new Error("No se pudo obtener el seguimiento.");
  }
}

export async function fetchCaseFollowUpsByCaseId(caseId) {
  try {
    return await caseFollowUpReadRepository.findByCaseId(caseId);
  } catch (error) {
    logger.error("Failed to fetch follow-ups by case ID", { error: error.message, caseId });
    throw new Error("No se pudieron obtener los seguimientos.");
  }
}
