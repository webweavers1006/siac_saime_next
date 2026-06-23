import { reasonWriteRepository } from "../repositories/reason.write.repository";
import { validateReasonRules } from "./reason.validation.service";

export async function createReason(data) {
  const validation = await validateReasonRules(data);
  if (!validation.success) return validation;

  try {
    const result = await reasonWriteRepository.create(data);
    return { success: true, data: result, message: "Motivo creado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al crear el motivo." };
  }
}

export async function updateReason(id, data) {
  const validation = await validateReasonRules(data, id);
  if (!validation.success) return validation;

  try {
    const result = await reasonWriteRepository.update(id, data);
    return { success: true, data: result, message: "Motivo actualizado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al actualizar el motivo." };
  }
}

export async function deleteReason(id) {
  try {
    await reasonWriteRepository.softDelete(id);
    return { success: true, message: "Motivo eliminado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al eliminar el motivo." };
  }
}
