"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { getAllSystemPermissions } from "../services/permission.read.service";
import { PERMISSION_CONFIG } from "../config/permission.constants";

/**
 * Protected Server Action — fetches the full system permission catalog.
 * Used by server components and client permission selectors.
 */
export const getAllSystemPermissionsAction = createProtectedFunction(
  PERMISSION_CONFIG.PERMISSIONS.READ,
  async () => {
    return await getAllSystemPermissions();
  }
);
