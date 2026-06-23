import { popularOrganizationReadRepository } from "../repositories/popular-organization.read.repository";

export async function validatePopularOrganizationRules(data, excludeId = null) {
  const existing = await popularOrganizationReadRepository.findByName(data.name, excludeId);

  if (existing) {
    return {
      success: false,
      error: "Ya existe una organización de poder popular con este nombre.",
      details: { name: ["Este nombre ya está en uso."] }
    };
  }

  return { success: true };
}
