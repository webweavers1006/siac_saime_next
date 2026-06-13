import { logger } from "@/features/shared";
import { permissionReadRepository } from "../repositories/permission.read.repository";

/**
 * Retrieves all available system permissions from the database.
 * @returns {Promise<Array>} List of system permissions.
 */
export const getAllSystemPermissions = async () => {
  try {
    return await permissionReadRepository.findAll();
  } catch (error) {
    logger.error("Error fetching system permissions:", error);
    throw error;
  }
};
