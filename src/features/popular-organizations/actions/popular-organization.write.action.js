"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import {
  createPopularOrganization,
  updatePopularOrganization,
  deletePopularOrganization,
} from "../services/popular-organization.write.service";
import { POPULAR_ORGANIZATION_CONFIG } from "../config/popular-organization.constants";
import { popularOrganizationSchema } from "../schemas/popular-organization.schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

export const savePopularOrganizationAction = createProtectedAction(
  (data) => data.id ? POPULAR_ORGANIZATION_CONFIG.PERMISSIONS.UPDATE : POPULAR_ORGANIZATION_CONFIG.PERMISSIONS.WRITE,
  popularOrganizationSchema,
  async (data) => {
    try {
      const { id, ...rest } = data;

      let result;
      if (id) {
        result = await updatePopularOrganization(id, rest);
      } else {
        result = await createPopularOrganization(rest);
      }

      if (result.success) {
        revalidatePath(POPULAR_ORGANIZATION_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to save popular organization", { error: error.message });
      return { success: false, error: "Error inesperado en el servidor." };
    }
  }
);

export const deletePopularOrganizationAction = createProtectedFunction(
  POPULAR_ORGANIZATION_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    try {
      const result = await deletePopularOrganization(id);
      if (result.success) {
        revalidatePath(POPULAR_ORGANIZATION_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to delete popular organization", { error: error.message, popularOrganizationId: id });
      return { success: false, error: "Error inesperado al eliminar." };
    }
  }
);
