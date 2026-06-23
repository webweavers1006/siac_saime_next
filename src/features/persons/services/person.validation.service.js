import { personReadRepository } from "../repositories/person.read.repository";

/**
 * Validates business rules before creating/updating a person.
 * Currently checks for duplicate idCard.
 */
export async function validatePersonRules(data, excludeId = null) {
  // Only validate idCard uniqueness if provided
  if (data.idCard?.trim()) {
    const existing = await personReadRepository.findByIdCard(data.idCard, excludeId);

    if (existing) {
      return {
        success: false,
        error: "Ya existe una persona con esta cédula.",
        details: { idCard: ["Esta cédula ya está registrada."] }
      };
    }
  }

  return { success: true };
}
