import { caseAreaReadRepository } from "../repositories/case-area.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchCaseAreasList(params) {
  try {
    return await caseAreaReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch case areas list", { error: error.message });
    throw new Error("No se pudo obtener la lista.");
  }
}

export async function fetchCaseAreaById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await caseAreaReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch case area by id", { error: error.message, caseAreaId: id });
    throw new Error("No se pudo obtener el registro.");
  }
}
