import { popularOrganizationReadRepository } from "../repositories/popular-organization.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchPopularOrganizationsList(params) {
  try {
    return await popularOrganizationReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch popular organizations list", { error: error.message });
    throw new Error("No se pudo obtener la lista.");
  }
}

export async function fetchPopularOrganizationById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await popularOrganizationReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch popular organization by id", { error: error.message, popularOrganizationId: id });
    throw new Error("No se pudo obtener el registro.");
  }
}
