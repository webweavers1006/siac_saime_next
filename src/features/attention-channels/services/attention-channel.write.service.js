import { attentionChannelWriteRepository } from "../repositories/attention-channel.write.repository";
import { validateAttentionChannelRules } from "./attention-channel.validation.service";

export async function createAttentionChannel(data) {
  const validation = await validateAttentionChannelRules(data);
  if (!validation.success) return validation;

  try {
    const result = await attentionChannelWriteRepository.create(data);
    return { success: true, data: result, message: "Red social creada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al crear la red social." };
  }
}

export async function updateAttentionChannel(id, data) {
  const validation = await validateAttentionChannelRules(data, id);
  if (!validation.success) return validation;

  try {
    const result = await attentionChannelWriteRepository.update(id, data);
    return { success: true, data: result, message: "Red social actualizada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al actualizar la red social." };
  }
}

export async function deleteAttentionChannel(id) {
  try {
    await attentionChannelWriteRepository.softDelete(id);
    return { success: true, message: "Red social eliminada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al eliminar la red social." };
  }
}
