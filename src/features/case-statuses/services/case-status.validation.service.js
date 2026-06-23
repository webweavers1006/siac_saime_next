import { caseStatusReadRepository } from "../repositories/case-status.read.repository";

export async function validateCaseStatusRules(data, excludeId = null) {
  const existing = await caseStatusReadRepository.findByName(data.name, excludeId);

  if (existing) {
    return {
      success: false,
      error: "Ya existe un estatus de caso con este nombre.",
      details: { name: ["Este nombre ya está en uso."] }
    };
  }

  return { success: true };
}
