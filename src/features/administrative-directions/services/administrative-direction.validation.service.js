import { administrativeDirectionReadRepository } from "../repositories/administrative-direction.read.repository";

export async function validateAdministrativeDirectionRules(data, excludeId = null) {
  const existing = await administrativeDirectionReadRepository.findByName(data.name, excludeId);

  if (existing) {
    return {
      success: false,
      error: "Ya existe un registro con este nombre.",
      details: { name: ["Este nombre ya está en uso."] }
    };
  }

  return { success: true };
}
