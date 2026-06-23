import { attentionTypeReadRepository } from "../repositories/attention-type.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchAttentionTypesList(params) {
  try {
    return await attentionTypeReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch attention types list", { error: error.message });
    throw new Error("No se pudo obtener la lista.");
  }
}

export async function fetchAttentionTypeById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await attentionTypeReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch attention type by id", { error: error.message, attentionTypeId: id });
    throw new Error("No se pudo obtener el registro.");
  }
}
