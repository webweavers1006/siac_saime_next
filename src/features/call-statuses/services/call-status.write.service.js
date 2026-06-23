import { callStatusWriteRepository } from "../repositories/call-status.write.repository";
import { validateCallStatusRules } from "./call-status.validation.service";

export async function createCallStatus(data) {
  const validation = await validateCallStatusRules(data);
  if (!validation.success) return validation;

  try {
    const result = await callStatusWriteRepository.create(data);
    return { success: true, data: result, message: "Estatus de llamada creado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al crear el estatus de llamada." };
  }
}

export async function updateCallStatus(id, data) {
  const validation = await validateCallStatusRules(data, id);
  if (!validation.success) return validation;

  try {
    const result = await callStatusWriteRepository.update(id, data);
    return { success: true, data: result, message: "Estatus de llamada actualizado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al actualizar el estatus de llamada." };
  }
}

export async function deleteCallStatus(id) {
  try {
    await callStatusWriteRepository.softDelete(id);
    return { success: true, message: "Estatus de llamada eliminado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al eliminar el estatus de llamada." };
  }
}
