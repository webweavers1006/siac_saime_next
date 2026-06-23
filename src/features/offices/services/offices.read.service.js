import { officeReadRepository } from "../repositories/offices.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchOfficesList(params) {
  try {
    return await officeReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch offices list", { error: error.message });
    throw new Error("No se pudo obtener la lista.");
  }
}

export async function fetchOfficeById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await officeReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch office by id", { error: error.message, officeId: id });
    throw new Error("No se pudo obtener el registro.");
  }
}
