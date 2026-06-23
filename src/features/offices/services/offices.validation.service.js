import { officeReadRepository } from "../repositories/offices.read.repository";

export async function validateOfficeRules(data, excludeId = null) {
  const existingName = await officeReadRepository.findByName(data.name, excludeId);

  if (existingName) {
    return {
      success: false,
      error: "Ya existe una oficina con este nombre.",
      details: { name: ["Este nombre ya está en uso."] }
    };
  }

  if (data.code) {
    const existingCode = await officeReadRepository.findByCode(data.code, excludeId);
    if (existingCode) {
      return {
        success: false,
        error: "Ya existe una oficina con este código.",
        details: { code: ["Este código ya está en uso."] }
      };
    }
  }

  return { success: true };
}
