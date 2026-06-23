import { attentionTypeWriteRepository } from "../repositories/attention-type.write.repository";
import { validateAttentionTypeRules } from "./attention-type.validation.service";

export async function createAttentionType(data) {
  const validation = await validateAttentionTypeRules(data);
  if (!validation.success) return validation;

  try {
    const result = await attentionTypeWriteRepository.create(data);
    return { success: true, data: result, message: "Tipo de atención creado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al crear el tipo de atención." };
  }
}

export async function updateAttentionType(id, data) {
  const validation = await validateAttentionTypeRules(data, id);
  if (!validation.success) return validation;

  try {
    const result = await attentionTypeWriteRepository.update(id, data);
    return { success: true, data: result, message: "Tipo de atención actualizado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al actualizar el tipo de atención." };
  }
}

export async function deleteAttentionType(id) {
  try {
    await attentionTypeWriteRepository.softDelete(id);
    return { success: true, message: "Tipo de atención eliminado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al eliminar el tipo de atención." };
  }
}
