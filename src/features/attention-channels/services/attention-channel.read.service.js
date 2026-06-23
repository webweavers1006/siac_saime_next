import { attentionChannelReadRepository } from "../repositories/attention-channel.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchAttentionChannelsList(params) {
  try {
    return await attentionChannelReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch social networks list", { error: error.message });
    throw new Error("No se pudo obtener la lista.");
  }
}

export async function fetchAttentionChannelById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await attentionChannelReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch social network by id", { error: error.message, attentionChannelId: id });
    throw new Error("No se pudo obtener el registro.");
  }
}
