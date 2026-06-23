"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import {
  createAttentionTypeDetail,
  updateAttentionTypeDetail,
  deleteAttentionTypeDetail,
} from "../services/attention-type-detail.write.service";
import { ATTENTION_TYPE_DETAIL_CONFIG } from "../config/attention-type-detail.constants";
import { attentionTypeDetailSchema } from "../schemas/attention-type-detail.schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

export const saveAttentionTypeDetailAction = createProtectedAction(
  (data) => data.id ? ATTENTION_TYPE_DETAIL_CONFIG.PERMISSIONS.UPDATE : ATTENTION_TYPE_DETAIL_CONFIG.PERMISSIONS.WRITE,
  attentionTypeDetailSchema,
  async (data) => {
    try {
      const { id, ...rest } = data;

      let result;
      if (id) {
        result = await updateAttentionTypeDetail(id, rest);
      } else {
        result = await createAttentionTypeDetail(rest);
      }

      if (result.success) {
        revalidatePath(ATTENTION_TYPE_DETAIL_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to save attention type detail", { error: error.message });
      return { success: false, error: "Error inesperado en el servidor." };
    }
  }
);

export const deleteAttentionTypeDetailAction = createProtectedFunction(
  ATTENTION_TYPE_DETAIL_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    try {
      const result = await deleteAttentionTypeDetail(id);
      if (result.success) {
        revalidatePath(ATTENTION_TYPE_DETAIL_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to delete attention type detail", { error: error.message, attentionTypeDetailId: id });
      return { success: false, error: "Error inesperado al eliminar." };
    }
  }
);
