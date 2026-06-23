"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import {
  createReason,
  updateReason,
  deleteReason,
} from "../services/reason.write.service";
import { REASON_CONFIG } from "../config/reason.constants";
import { reasonSchema } from "../schemas/reason.schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

export const saveReasonAction = createProtectedAction(
  (data) => data.id ? REASON_CONFIG.PERMISSIONS.UPDATE : REASON_CONFIG.PERMISSIONS.WRITE,
  reasonSchema,
  async (data) => {
    try {
      const { id, ...rest } = data;

      let result;
      if (id) {
        result = await updateReason(id, rest);
      } else {
        result = await createReason(rest);
      }

      if (result.success) {
        revalidatePath(REASON_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to save reason", { error: error.message });
      return { success: false, error: "Error inesperado en el servidor." };
    }
  }
);

export const deleteReasonAction = createProtectedFunction(
  REASON_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    try {
      const result = await deleteReason(id);
      if (result.success) {
        revalidatePath(REASON_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to delete reason", { error: error.message, reasonId: id });
      return { success: false, error: "Error inesperado al eliminar." };
    }
  }
);
