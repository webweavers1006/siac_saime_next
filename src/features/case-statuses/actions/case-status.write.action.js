"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import {
  createCaseStatus,
  updateCaseStatus,
  deleteCaseStatus,
} from "../services/case-status.write.service";
import { CASE_STATUS_CONFIG } from "../config/case-status.constants";
import { caseStatusSchema } from "../schemas/case-status.schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

export const saveCaseStatusAction = createProtectedAction(
  (data) => data.id ? CASE_STATUS_CONFIG.PERMISSIONS.UPDATE : CASE_STATUS_CONFIG.PERMISSIONS.WRITE,
  caseStatusSchema,
  async (data) => {
    try {
      const { id, ...rest } = data;

      let result;
      if (id) {
        result = await updateCaseStatus(id, rest);
      } else {
        result = await createCaseStatus(rest);
      }

      if (result.success) {
        revalidatePath(CASE_STATUS_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to save case status", { error: error.message });
      return { success: false, error: "Error inesperado en el servidor." };
    }
  }
);

export const deleteCaseStatusAction = createProtectedFunction(
  CASE_STATUS_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    try {
      const result = await deleteCaseStatus(id);
      if (result.success) {
        revalidatePath(CASE_STATUS_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to delete case status", { error: error.message, caseStatusId: id });
      return { success: false, error: "Error inesperado al eliminar." };
    }
  }
);
