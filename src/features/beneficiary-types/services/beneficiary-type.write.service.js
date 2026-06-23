import { beneficiaryTypeWriteRepository } from "../repositories/beneficiary-type.write.repository";
import { validateBeneficiaryTypeRules } from "./beneficiary-type.validation.service";

export async function createBeneficiaryType(data) {
  const validation = await validateBeneficiaryTypeRules(data);
  if (!validation.success) return validation;

  try {
    const result = await beneficiaryTypeWriteRepository.create(data);
    return { success: true, data: result, message: "Tipo de beneficiario creado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al crear el tipo de beneficiario." };
  }
}

export async function updateBeneficiaryType(id, data) {
  const validation = await validateBeneficiaryTypeRules(data, id);
  if (!validation.success) return validation;

  try {
    const result = await beneficiaryTypeWriteRepository.update(id, data);
    return { success: true, data: result, message: "Tipo de beneficiario actualizado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al actualizar el tipo de beneficiario." };
  }
}

export async function deleteBeneficiaryType(id) {
  try {
    await beneficiaryTypeWriteRepository.softDelete(id);
    return { success: true, message: "Tipo de beneficiario eliminado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al eliminar el tipo de beneficiario." };
  }
}
