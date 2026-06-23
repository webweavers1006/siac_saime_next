import { attentionTypeReadRepository } from "../repositories/attention-type.read.repository";

export async function validateAttentionTypeRules(data, excludeId = null) {
  const existing = await attentionTypeReadRepository.findByName(data.name, excludeId);

  if (existing) {
    return {
      success: false,
      error: "Ya existe un registro con este nombre.",
      details: { name: ["Este nombre ya está en uso."] }
    };
  }

  return { success: true };
}
