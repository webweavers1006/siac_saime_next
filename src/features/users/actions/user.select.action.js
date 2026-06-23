"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { USER_CONFIG } from "../config/user.constants";
import { searchActiveUsersList } from "../services/user.read.service";

/**
 * Returns a flat list of Users for use in async select dropdowns.
 * Label format: "Nombre Apellido"
 * Protected — exposes system user list. Requires users:read.
 */
export const getUsersForSelectAction = createProtectedFunction(
  USER_CONFIG.PERMISSIONS.READ,
  async ({ searchTerm } = {}) => {
    const users = await searchActiveUsersList(searchTerm || "");
    return users.map((user) => ({
      label: `${user.firstName} ${user.lastName || ""}`.trim(),
      value: user.id,
    }));
  }
);
