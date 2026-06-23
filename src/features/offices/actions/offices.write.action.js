"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import {
  createOffice,
  updateOffice,
  deleteOffice,
} from "../services/offices.write.service";
import { OFFICE_CONFIG } from "../config/offices.constants";
import { officeSchema } from "../schemas/offices.schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

export const saveOfficeAction = createProtectedAction(
  (data) => data.id ? OFFICE_CONFIG.PERMISSIONS.UPDATE : OFFICE_CONFIG.PERMISSIONS.WRITE,
  officeSchema,
  async (data) => {
    try {
      const { id, ...rest } = data;

      let result;
      if (id) {
        result = await updateOffice(id, rest);
      } else {
        result = await createOffice(rest);
      }

      if (result.success) {
        revalidatePath(OFFICE_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to save office", { error: error.message });
      return { success: false, error: "Error inesperado en el servidor." };
    }
  }
);

export const deleteOfficeAction = createProtectedFunction(
  OFFICE_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    try {
      const result = await deleteOffice(id);
      if (result.success) {
        revalidatePath(OFFICE_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to delete office", { error: error.message, officeId: id });
      return { success: false, error: "Error inesperado al eliminar." };
    }
  }
);
