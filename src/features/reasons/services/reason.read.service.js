import { reasonReadRepository } from "../repositories/reason.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchReasonsList(params) {
  try {
    return await reasonReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch reasons list", { error: error.message });
    throw new Error("No se pudo obtener la lista.");
  }
}

export async function fetchReasonById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await reasonReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch reason by id", { error: error.message, reasonId: id });
    throw new Error("No se pudo obtener el registro.");
  }
}
