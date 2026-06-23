import { caseAreaWriteRepository } from "../repositories/case-area.write.repository";
import { validateCaseAreaRules } from "./case-area.validation.service";

export async function createCaseArea(data) {
  const validation = await validateCaseAreaRules(data);
  if (!validation.success) return validation;

  try {
    const result = await caseAreaWriteRepository.create(data);
    return { success: true, data: result, message: "Área de caso creada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al crear el área de caso." };
  }
}

export async function updateCaseArea(id, data) {
  const validation = await validateCaseAreaRules(data, id);
  if (!validation.success) return validation;

  try {
    const result = await caseAreaWriteRepository.update(id, data);
    return { success: true, data: result, message: "Área de caso actualizada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al actualizar el área de caso." };
  }
}

export async function deleteCaseArea(id) {
  try {
    await caseAreaWriteRepository.softDelete(id);
    return { success: true, message: "Área de caso eliminada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al eliminar el área de caso." };
  }
}
