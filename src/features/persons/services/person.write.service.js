import { personWriteRepository } from "../repositories/person.write.repository";
import { validatePersonRules } from "./person.validation.service";

export async function createPerson(data) {
  const validation = await validatePersonRules(data);
  if (!validation.success) return validation;

  try {
    const result = await personWriteRepository.create(data);
    return { success: true, data: result, message: "Persona creada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al crear la persona." };
  }
}

export async function updatePerson(id, data) {
  const validation = await validatePersonRules(data, id);
  if (!validation.success) return validation;

  try {
    const result = await personWriteRepository.update(id, data);
    return { success: true, data: result, message: "Persona actualizada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al actualizar la persona." };
  }
}

export async function deletePerson(id) {
  try {
    await personWriteRepository.softDelete(id);
    return { success: true, message: "Persona eliminada exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al eliminar la persona." };
  }
}
