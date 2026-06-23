import { administrativeDirectionReadRepository } from "../repositories/administrative-direction.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchAdministrativeDirectionsList(params) {
  try {
    return await administrativeDirectionReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch administrative directions list", { error: error.message });
    throw new Error("No se pudo obtener la lista.");
  }
}

export async function fetchAdministrativeDirectionById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await administrativeDirectionReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch administrative direction by id", { error: error.message, administrativeDirectionId: id });
    throw new Error("No se pudo obtener el registro.");
  }
}
