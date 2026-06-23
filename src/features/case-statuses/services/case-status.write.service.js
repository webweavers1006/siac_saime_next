import { caseStatusWriteRepository } from "../repositories/case-status.write.repository";
import { validateCaseStatusRules } from "./case-status.validation.service";

export async function createCaseStatus(data) {
  const validation = await validateCaseStatusRules(data);
  if (!validation.success) return validation;

  try {
    const result = await caseStatusWriteRepository.create(data);
    return { success: true, data: result, message: "Estatus de caso creado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al crear el estatus de caso." };
  }
}

export async function updateCaseStatus(id, data) {
  const validation = await validateCaseStatusRules(data, id);
  if (!validation.success) return validation;

  try {
    const result = await caseStatusWriteRepository.update(id, data);
    return { success: true, data: result, message: "Estatus de caso actualizado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al actualizar el estatus de caso." };
  }
}

export async function deleteCaseStatus(id) {
  try {
    await caseStatusWriteRepository.softDelete(id);
    return { success: true, message: "Estatus de caso eliminado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al eliminar el estatus de caso." };
  }
}
