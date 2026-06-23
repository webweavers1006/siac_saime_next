import { callStatusReadRepository } from "../repositories/call-status.read.repository";

export async function validateCallStatusRules(data, excludeId = null) {
  const existing = await callStatusReadRepository.findByName(data.name, excludeId);

  if (existing) {
    return {
      success: false,
      error: "Ya existe un estatus de llamada con este nombre.",
      details: { name: ["Este nombre ya está en uso."] }
    };
  }

  return { success: true };
}
