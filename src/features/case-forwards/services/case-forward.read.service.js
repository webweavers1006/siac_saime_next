import { caseForwardReadRepository } from "../repositories/case-forward.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchCaseForwardsList(params) {
  try {
    return await caseForwardReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch forwards list", { error: error.message });
    throw new Error("No se pudo obtener la lista de remisiones.");
  }
}

export async function fetchCaseForwardById(id) {
  try {
    return await caseForwardReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch forward by ID", { error: error.message, id });
    throw new Error("No se pudo obtener la remisión.");
  }
}

export async function fetchCaseForwardsByCaseId(caseId) {
  try {
    return await caseForwardReadRepository.findByCaseId(caseId);
  } catch (error) {
    logger.error("Failed to fetch forwards by case ID", { error: error.message, caseId });
    throw new Error("No se pudieron obtener las remisiones.");
  }
}
