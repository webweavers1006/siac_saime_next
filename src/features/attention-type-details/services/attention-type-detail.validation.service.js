import { attentionTypeDetailReadRepository } from "../repositories/attention-type-detail.read.repository";

export async function validateAttentionTypeDetailRules(data, excludeId = null) {
  const existing = await attentionTypeDetailReadRepository.findByName(data.name, excludeId);

  if (existing) {
    return {
      success: false,
      error: "Ya existe un registro con este nombre.",
      details: { name: ["Este nombre ya está en uso."] }
    };
  }

  return { success: true };
}
