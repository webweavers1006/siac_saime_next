"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import {
  createBeneficiaryType,
  updateBeneficiaryType,
  deleteBeneficiaryType,
} from "../services/beneficiary-type.write.service";
import { BENEFICIARY_TYPE_CONFIG } from "../config/beneficiary-type.constants";
import { beneficiaryTypeSchema } from "../schemas/beneficiary-type.schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

export const saveBeneficiaryTypeAction = createProtectedAction(
  (data) => data.id ? BENEFICIARY_TYPE_CONFIG.PERMISSIONS.UPDATE : BENEFICIARY_TYPE_CONFIG.PERMISSIONS.WRITE,
  beneficiaryTypeSchema,
  async (data) => {
    try {
      const { id, ...rest } = data;

      let result;
      if (id) {
        result = await updateBeneficiaryType(id, rest);
      } else {
        result = await createBeneficiaryType(rest);
      }

      if (result.success) {
        revalidatePath(BENEFICIARY_TYPE_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to save beneficiary type", { error: error.message });
      return { success: false, error: "Error inesperado en el servidor." };
    }
  }
);

export const deleteBeneficiaryTypeAction = createProtectedFunction(
  BENEFICIARY_TYPE_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    try {
      const result = await deleteBeneficiaryType(id);
      if (result.success) {
        revalidatePath(BENEFICIARY_TYPE_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to delete beneficiary type", { error: error.message, beneficiaryTypeId: id });
      return { success: false, error: "Error inesperado al eliminar." };
    }
  }
);
