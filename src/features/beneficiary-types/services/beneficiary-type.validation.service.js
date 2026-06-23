import { beneficiaryTypeReadRepository } from "../repositories/beneficiary-type.read.repository";

export async function validateBeneficiaryTypeRules(data, excludeId = null) {
  const existing = await beneficiaryTypeReadRepository.findByName(data.name, excludeId);

  if (existing) {
    return {
      success: false,
      error: "Ya existe un registro con este nombre.",
      details: { name: ["Este nombre ya está en uso."] }
    };
  }

  return { success: true };
}
