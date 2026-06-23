import { callStatusReadRepository } from "../repositories/call-status.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchCallStatusesList(params) {
  try {
    return await callStatusReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch call statuses list", { error: error.message });
    throw new Error("No se pudo obtener la lista.");
  }
}

export async function fetchCallStatusById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await callStatusReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch call status by id", { error: error.message, callStatusId: id });
    throw new Error("No se pudo obtener el registro.");
  }
}
