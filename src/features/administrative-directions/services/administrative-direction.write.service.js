import { administrativeDirectionWriteRepository } from "../repositories/administrative-direction.write.repository";
import { validateAdministrativeDirectionRules } from "./administrative-direction.validation.service";

export async function createAdministrativeDirection(data) {
  const { allowedAreaIds, ...rest } = data;
  const validation = await validateAdministrativeDirectionRules(rest);
  if (!validation.success) return validation;

  try {
    const result = await administrativeDirectionWriteRepository.create(rest, allowedAreaIds || []);
    return { success: true, data: result, message: "Dirección administrativa creada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al crear la dirección administrativa." };
  }
}

export async function updateAdministrativeDirection(id, data) {
  const { allowedAreaIds, ...rest } = data;
  const validation = await validateAdministrativeDirectionRules(rest, id);
  if (!validation.success) return validation;

  try {
    const result = await administrativeDirectionWriteRepository.update(id, rest, allowedAreaIds);
    return { success: true, data: result, message: "Dirección administrativa actualizada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al actualizar la dirección administrativa." };
  }
}

export async function deleteAdministrativeDirection(id) {
  try {
    await administrativeDirectionWriteRepository.softDelete(id);
    return { success: true, message: "Dirección administrativa eliminada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al eliminar la dirección administrativa." };
  }
}
