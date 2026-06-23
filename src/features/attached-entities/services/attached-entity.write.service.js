import { attachedEntityWriteRepository } from "../repositories/attached-entity.write.repository";
import { validateAttachedEntityRules } from "./attached-entity.validation.service";

export async function createAttachedEntity(data) {
  const validation = await validateAttachedEntityRules(data);
  if (!validation.success) return validation;

  try {
    const result = await attachedEntityWriteRepository.create(data);
    return { success: true, data: result, message: "Ente adscrito creado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al crear el ente adscrito." };
  }
}

export async function updateAttachedEntity(id, data) {
  const validation = await validateAttachedEntityRules(data, id);
  if (!validation.success) return validation;

  try {
    const result = await attachedEntityWriteRepository.update(id, data);
    return { success: true, data: result, message: "Ente adscrito actualizado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al actualizar el ente adscrito." };
  }
}

export async function deleteAttachedEntity(id) {
  try {
    await attachedEntityWriteRepository.softDelete(id);
    return { success: true, message: "Ente adscrito eliminado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al eliminar el ente adscrito." };
  }
}
