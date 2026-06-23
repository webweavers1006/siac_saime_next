import { popularOrganizationWriteRepository } from "../repositories/popular-organization.write.repository";
import { validatePopularOrganizationRules } from "./popular-organization.validation.service";

export async function createPopularOrganization(data) {
  const validation = await validatePopularOrganizationRules(data);
  if (!validation.success) return validation;

  try {
    const result = await popularOrganizationWriteRepository.create(data);
    return { success: true, data: result, message: "Organización de poder popular creada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al crear la organización de poder popular." };
  }
}

export async function updatePopularOrganization(id, data) {
  const validation = await validatePopularOrganizationRules(data, id);
  if (!validation.success) return validation;

  try {
    const result = await popularOrganizationWriteRepository.update(id, data);
    return { success: true, data: result, message: "Organización de poder popular actualizada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al actualizar la organización de poder popular." };
  }
}

export async function deletePopularOrganization(id) {
  try {
    await popularOrganizationWriteRepository.softDelete(id);
    return { success: true, message: "Organización de poder popular eliminada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al eliminar la organización de poder popular." };
  }
}
