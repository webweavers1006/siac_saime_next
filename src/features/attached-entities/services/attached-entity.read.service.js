import { attachedEntityReadRepository } from "../repositories/attached-entity.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchAttachedEntitiesList(params) {
  try {
    return await attachedEntityReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch attached entities list", { error: error.message });
    throw new Error("No se pudo obtener la lista.");
  }
}

export async function fetchAttachedEntityById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await attachedEntityReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch attached entity by id", { error: error.message, attachedEntityId: id });
    throw new Error("No se pudo obtener el registro.");
  }
}
