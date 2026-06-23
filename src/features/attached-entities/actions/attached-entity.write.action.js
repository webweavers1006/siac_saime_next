"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import {
  createAttachedEntity,
  updateAttachedEntity,
  deleteAttachedEntity,
} from "../services/attached-entity.write.service";
import { ATTACHED_ENTITY_CONFIG } from "../config/attached-entity.constants";
import { attachedEntitySchema } from "../schemas/attached-entity.schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

export const saveAttachedEntityAction = createProtectedAction(
  (data) => data.id ? ATTACHED_ENTITY_CONFIG.PERMISSIONS.UPDATE : ATTACHED_ENTITY_CONFIG.PERMISSIONS.WRITE,
  attachedEntitySchema,
  async (data) => {
    try {
      const { id, ...rest } = data;

      let result;
      if (id) {
        result = await updateAttachedEntity(id, rest);
      } else {
        result = await createAttachedEntity(rest);
      }

      if (result.success) {
        revalidatePath(ATTACHED_ENTITY_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to save attached entity", { error: error.message });
      return { success: false, error: "Error inesperado en el servidor." };
    }
  }
);

export const deleteAttachedEntityAction = createProtectedFunction(
  ATTACHED_ENTITY_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    try {
      const result = await deleteAttachedEntity(id);
      if (result.success) {
        revalidatePath(ATTACHED_ENTITY_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to delete attached entity", { error: error.message, attachedEntityId: id });
      return { success: false, error: "Error inesperado al eliminar." };
    }
  }
);
