"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import {
  upsertCaseCoordinate,
  updateCaseCoordinate,
  deleteCaseCoordinate,
} from "../services/case-coordinate.write.service";
import { CASE_COORDINATE_CONFIG } from "../config/case-coordinate.constants";
import { caseCoordinateSchema } from "../schemas/case-coordinate.schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

/**
 * Creates or updates a coordinate for a case (upsert pattern).
 * Since case-coordinate is 1:1, creating a new one soft-deletes the old.
 */
export const saveCaseCoordinateAction = createProtectedAction(
  (data) => data.id ? CASE_COORDINATE_CONFIG.PERMISSIONS.UPDATE : CASE_COORDINATE_CONFIG.PERMISSIONS.WRITE,
  caseCoordinateSchema,
  async (data) => {
    try {
      const { id, ...rest } = data;

      let result;
      if (id) {
        result = await updateCaseCoordinate(id, rest);
      } else {
        result = await upsertCaseCoordinate(rest);
      }

      if (result.success) {
        revalidatePath(CASE_COORDINATE_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to save case coordinate", { error: error.message });
      return { success: false, error: "Error inesperado al guardar la coordenada." };
    }
  }
);

/**
 * Deletes a coordinate (soft delete).
 */
export const deleteCaseCoordinateAction = createProtectedFunction(
  CASE_COORDINATE_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    try {
      const result = await deleteCaseCoordinate(id);
      if (result.success) {
        revalidatePath(CASE_COORDINATE_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to delete case coordinate", { error: error.message, id });
      return { success: false, error: "Error inesperado al eliminar la coordenada." };
    }
  }
);
