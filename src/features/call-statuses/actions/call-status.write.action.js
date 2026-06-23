"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import {
  createCallStatus,
  updateCallStatus,
  deleteCallStatus,
} from "../services/call-status.write.service";
import { CALL_STATUS_CONFIG } from "../config/call-status.constants";
import { callStatusSchema } from "../schemas/call-status.schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

export const saveCallStatusAction = createProtectedAction(
  (data) => data.id ? CALL_STATUS_CONFIG.PERMISSIONS.UPDATE : CALL_STATUS_CONFIG.PERMISSIONS.WRITE,
  callStatusSchema,
  async (data) => {
    try {
      const { id, ...rest } = data;

      let result;
      if (id) {
        result = await updateCallStatus(id, rest);
      } else {
        result = await createCallStatus(rest);
      }

      if (result.success) {
        revalidatePath(CALL_STATUS_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to save call status", { error: error.message });
      return { success: false, error: "Error inesperado en el servidor." };
    }
  }
);

export const deleteCallStatusAction = createProtectedFunction(
  CALL_STATUS_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    try {
      const result = await deleteCallStatus(id);
      if (result.success) {
        revalidatePath(CALL_STATUS_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to delete call status", { error: error.message, callStatusId: id });
      return { success: false, error: "Error inesperado al eliminar." };
    }
  }
);
