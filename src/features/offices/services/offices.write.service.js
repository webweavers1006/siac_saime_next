import { officeWriteRepository } from "../repositories/offices.write.repository";
import { validateOfficeRules } from "./offices.validation.service";

export async function createOffice(data) {
  const validation = await validateOfficeRules(data);
  if (!validation.success) return validation;

  try {
    const result = await officeWriteRepository.create(data);
    return { success: true, data: result, message: "Oficina creada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al crear la oficina." };
  }
}

export async function updateOffice(id, data) {
  const validation = await validateOfficeRules(data, id);
  if (!validation.success) return validation;

  try {
    const result = await officeWriteRepository.update(id, data);
    return { success: true, data: result, message: "Oficina actualizada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al actualizar la oficina." };
  }
}

export async function deleteOffice(id) {
  try {
    await officeWriteRepository.softDelete(id);
    return { success: true, message: "Oficina eliminada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al eliminar la oficina." };
  }
}
