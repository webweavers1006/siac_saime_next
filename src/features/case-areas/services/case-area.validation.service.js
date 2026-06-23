import { caseAreaReadRepository } from "../repositories/case-area.read.repository";

export async function validateCaseAreaRules(data, excludeId = null) {
  const existing = await caseAreaReadRepository.findByName(data.name, excludeId);

  if (existing) {
    return {
      success: false,
      error: "Ya existe un registro con este nombre.",
      details: { name: ["Este nombre ya está en uso."] }
    };
  }

  return { success: true };
}
