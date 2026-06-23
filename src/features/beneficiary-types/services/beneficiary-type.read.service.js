import { beneficiaryTypeReadRepository } from "../repositories/beneficiary-type.read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetchBeneficiaryTypesList(params) {
  try {
    return await beneficiaryTypeReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch beneficiary types list", { error: error.message });
    throw new Error("No se pudo obtener la lista.");
  }
}

export async function fetchBeneficiaryTypeById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await beneficiaryTypeReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch beneficiary type by id", { error: error.message, beneficiaryTypeId: id });
    throw new Error("No se pudo obtener el registro.");
  }
}
