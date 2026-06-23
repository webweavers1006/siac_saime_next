import { attachedEntityReadRepository } from "../repositories/attached-entity.read.repository";

export async function validateAttachedEntityRules(data, excludeId = null) {
  const existing = await attachedEntityReadRepository.findByName(data.name, excludeId);

  if (existing) {
    return {
      success: false,
      error: "Ya existe un ente adscrito con este nombre.",
      details: { name: ["Este nombre ya está en uso."] }
    };
  }

  return { success: true };
}
