"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { administrativeDirectionWriteRepository } from "../repositories/administrative-direction.write.repository";
import { ADMINISTRATIVE_DIRECTION_CONFIG } from "../config/administrative-direction.constants";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

/**
 * Updates only the allowed areas for a direction.
 * Receives direction ID and an array of area IDs.
 */
export const saveDirectionAreasAction = createProtectedFunction(
  ADMINISTRATIVE_DIRECTION_CONFIG.PERMISSIONS.UPDATE,
  async (directionId, areaIds) => {
    try {
      await administrativeDirectionWriteRepository.updateAreas(directionId, areaIds || []);
      revalidatePath(ADMINISTRATIVE_DIRECTION_CONFIG.PATH);
      return { success: true, message: "Áreas actualizadas exitosamente." };
    } catch (error) {
      logger.error("Failed to save direction areas", { error: error.message, directionId });
      return { success: false, error: "Error al actualizar las áreas." };
    }
  }
);
