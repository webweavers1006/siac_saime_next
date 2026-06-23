import { attentionChannelReadRepository } from "../repositories/attention-channel.read.repository";

export async function validateAttentionChannelRules(data, excludeId = null) {
  const existing = await attentionChannelReadRepository.findByName(data.name, excludeId);

  if (existing) {
    return {
      success: false,
      error: "Ya existe una red social con este nombre.",
      details: { name: ["Este nombre ya está en uso."] }
    };
  }

  return { success: true };
}
