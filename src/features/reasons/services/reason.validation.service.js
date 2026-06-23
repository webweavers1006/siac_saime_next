import { reasonReadRepository } from "../repositories/reason.read.repository";

export async function validateReasonRules(data, excludeId = null) {
  const existing = await reasonReadRepository.findByName(data.name, excludeId);

  if (existing) {
    return {
      success: false,
      error: "Ya existe un registro con este nombre.",
      details: { name: ["Este nombre ya está en uso."] }
    };
  }

  return { success: true };
}
