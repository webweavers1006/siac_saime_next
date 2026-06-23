import { attentionTypeDetailReadRepository } from "../repositories/attention-type-detail.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchAttentionTypeDetailsList(params) {
  try {
    return await attentionTypeDetailReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch attention type details list", { error: error.message });
    throw new Error("No se pudo obtener la lista.");
  }
}

export async function fetchAttentionTypeDetailById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await attentionTypeDetailReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch attention type detail by id", { error: error.message, attentionTypeDetailId: id });
    throw new Error("No se pudo obtener el registro.");
  }
}
