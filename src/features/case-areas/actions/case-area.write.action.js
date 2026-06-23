"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import {
  createCaseArea,
  updateCaseArea,
  deleteCaseArea,
} from "../services/case-area.write.service";
import { CASE_AREA_CONFIG } from "../config/case-area.constants";
import { caseAreaSchema } from "../schemas/case-area.schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

export const saveCaseAreaAction = createProtectedAction(
  (data) => data.id ? CASE_AREA_CONFIG.PERMISSIONS.UPDATE : CASE_AREA_CONFIG.PERMISSIONS.WRITE,
  caseAreaSchema,
  async (data) => {
    try {
      const { id, ...rest } = data;

      let result;
      if (id) {
        result = await updateCaseArea(id, rest);
      } else {
        result = await createCaseArea(rest);
      }

      if (result.success) {
        revalidatePath(CASE_AREA_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to save case area", { error: error.message });
      return { success: false, error: "Error inesperado en el servidor." };
    }
  }
);

export const deleteCaseAreaAction = createProtectedFunction(
  CASE_AREA_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    try {
      const result = await deleteCaseArea(id);
      if (result.success) {
        revalidatePath(CASE_AREA_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to delete case area", { error: error.message, caseAreaId: id });
      return { success: false, error: "Error inesperado al eliminar." };
    }
  }
);
