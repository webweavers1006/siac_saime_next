import { personReadRepository } from "../repositories/person.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchPersonsList(params) {
  try {
    return await personReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch persons list", { error: error.message });
    throw new Error("No se pudo obtener la lista.");
  }
}

export async function fetchPersonById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await personReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch person by id", { error: error.message, personId: id });
    throw new Error("No se pudo obtener el registro.");
  }
}
