"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import {
  createAttentionChannel,
  updateAttentionChannel,
  deleteAttentionChannel,
} from "../services/attention-channel.write.service";
import { ATTENTION_CHANNEL_CONFIG } from "../config/attention-channel.constants";
import { attentionChannelSchema } from "../schemas/attention-channel.schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

export const saveAttentionChannelAction = createProtectedAction(
  (data) => data.id ? ATTENTION_CHANNEL_CONFIG.PERMISSIONS.UPDATE : ATTENTION_CHANNEL_CONFIG.PERMISSIONS.WRITE,
  attentionChannelSchema,
  async (data) => {
    try {
      const { id, ...rest } = data;

      let result;
      if (id) {
        result = await updateAttentionChannel(id, rest);
      } else {
        result = await createAttentionChannel(rest);
      }

      if (result.success) {
        revalidatePath(ATTENTION_CHANNEL_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to save social network", { error: error.message });
      return { success: false, error: "Error inesperado en el servidor." };
    }
  }
);

export const deleteAttentionChannelAction = createProtectedFunction(
  ATTENTION_CHANNEL_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    try {
      const result = await deleteAttentionChannel(id);
      if (result.success) {
        revalidatePath(ATTENTION_CHANNEL_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to delete social network", { error: error.message, attentionChannelId: id });
      return { success: false, error: "Error inesperado al eliminar." };
    }
  }
);
