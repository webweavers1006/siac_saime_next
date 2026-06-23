"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import {
  createAdministrativeDirection,
  updateAdministrativeDirection,
  deleteAdministrativeDirection,
} from "../services/administrative-direction.write.service";
import { ADMINISTRATIVE_DIRECTION_CONFIG } from "../config/administrative-direction.constants";
import { administrativeDirectionSchema } from "../schemas/administrative-direction.schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

export const saveAdministrativeDirectionAction = createProtectedAction(
  (data) => data.id ? ADMINISTRATIVE_DIRECTION_CONFIG.PERMISSIONS.UPDATE : ADMINISTRATIVE_DIRECTION_CONFIG.PERMISSIONS.WRITE,
  administrativeDirectionSchema,
  async (data) => {
    try {
      const { id, ...rest } = data;

      let result;
      if (id) {
        result = await updateAdministrativeDirection(id, rest);
      } else {
        result = await createAdministrativeDirection(rest);
      }

      if (result.success) {
        revalidatePath(ADMINISTRATIVE_DIRECTION_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to save administrative direction", { error: error.message });
      return { success: false, error: "Error inesperado en el servidor." };
    }
  }
);

export const deleteAdministrativeDirectionAction = createProtectedFunction(
  ADMINISTRATIVE_DIRECTION_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    try {
      const result = await deleteAdministrativeDirection(id);
      if (result.success) {
        revalidatePath(ADMINISTRATIVE_DIRECTION_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to delete administrative direction", { error: error.message, administrativeDirectionId: id });
      return { success: false, error: "Error inesperado al eliminar." };
    }
  }
);
