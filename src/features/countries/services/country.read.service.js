import { countryReadRepository } from "../repositories/country.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchCountriesList(params) {
  try {
    return await countryReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch countries list", { error: error.message });
    throw new Error("No se pudo obtener la lista.");
  }
}

export async function fetchCountryById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await countryReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch country by id", { error: error.message, countryId: id });
    throw new Error("No se pudo obtener el registro.");
  }
}
