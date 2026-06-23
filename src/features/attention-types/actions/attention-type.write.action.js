"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import {
  createAttentionType,
  updateAttentionType,
  deleteAttentionType,
} from "../services/attention-type.write.service";
import { ATTENTION_TYPE_CONFIG } from "../config/attention-type.constants";
import { attentionTypeSchema } from "../schemas/attention-type.schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

export const saveAttentionTypeAction = createProtectedAction(
  (data) => data.id ? ATTENTION_TYPE_CONFIG.PERMISSIONS.UPDATE : ATTENTION_TYPE_CONFIG.PERMISSIONS.WRITE,
  attentionTypeSchema,
  async (data) => {
    try {
      const { id, ...rest } = data;

      let result;
      if (id) {
        result = await updateAttentionType(id, rest);
      } else {
        result = await createAttentionType(rest);
      }

      if (result.success) {
        revalidatePath(ATTENTION_TYPE_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to save attention type", { error: error.message });
      return { success: false, error: "Error inesperado en el servidor." };
    }
  }
);

export const deleteAttentionTypeAction = createProtectedFunction(
  ATTENTION_TYPE_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    try {
      const result = await deleteAttentionType(id);
      if (result.success) {
        revalidatePath(ATTENTION_TYPE_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to delete attention type", { error: error.message, attentionTypeId: id });
      return { success: false, error: "Error inesperado al eliminar." };
    }
  }
);
