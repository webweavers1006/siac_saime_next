"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { NOTIFICATION_CONFIG } from "../config/notification.constants";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notification.write.service";
import { getSession } from "@/features/auth/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Marks a single notification as read.
 * Ownership check: only the recipient can mark it.
 */
export const markAsReadAction = createProtectedFunction(
  NOTIFICATION_CONFIG.PERMISSIONS.MARK_READ,
  async (id) => {
    const session = await getSession();
    if (!session?.id) {
      return { success: false, error: "Sesión inválida." };
    }

    const result = await markNotificationAsRead(id, session.id);
    if (result.success) {
      revalidatePath(NOTIFICATION_CONFIG.PATH);
    }
    return result;
  }
);

/**
 * Marks all notifications as read for the current user.
 */
export const markAllAsReadAction = createProtectedFunction(
  NOTIFICATION_CONFIG.PERMISSIONS.MARK_ALL_READ,
  async () => {
    const session = await getSession();
    if (!session?.id) {
      return { success: false, error: "Sesión inválida." };
    }

    const result = await markAllNotificationsAsRead(session.id);
    if (result.success) {
      revalidatePath(NOTIFICATION_CONFIG.PATH);
    }
    return result;
  }
);
