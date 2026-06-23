import { attentionTypeDetailWriteRepository } from "../repositories/attention-type-detail.write.repository";
import { validateAttentionTypeDetailRules } from "./attention-type-detail.validation.service";

export async function createAttentionTypeDetail(data) {
  const validation = await validateAttentionTypeDetailRules(data);
  if (!validation.success) return validation;

  try {
    const result = await attentionTypeDetailWriteRepository.create(data);
    return { success: true, data: result, message: "Detalle de tipo de atención creado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al crear el detalle de tipo de atención." };
  }
}

export async function updateAttentionTypeDetail(id, data) {
  const validation = await validateAttentionTypeDetailRules(data, id);
  if (!validation.success) return validation;

  try {
    const result = await attentionTypeDetailWriteRepository.update(id, data);
    return { success: true, data: result, message: "Detalle de tipo de atención actualizado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al actualizar el detalle de tipo de atención." };
  }
}

export async function deleteAttentionTypeDetail(id) {
  try {
    await attentionTypeDetailWriteRepository.softDelete(id);
    return { success: true, message: "Detalle de tipo de atención eliminado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al eliminar el detalle de tipo de atención." };
  }
}
