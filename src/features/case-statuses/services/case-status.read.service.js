import { caseStatusReadRepository } from "../repositories/case-status.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchCaseStatusesList(params) {
  try {
    return await caseStatusReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch case statuses list", { error: error.message });
    throw new Error("No se pudo obtener la lista.");
  }
}

export async function fetchCaseStatusById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await caseStatusReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch case status by id", { error: error.message, caseStatusId: id });
    throw new Error("No se pudo obtener el registro.");
  }
}
