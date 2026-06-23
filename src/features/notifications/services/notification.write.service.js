import { notificationWriteRepository } from "../repositories/notification.write.repository";
import { logger } from "@/features/shared/lib/logger";

/**
 * Creates a notification. Fire-and-forget — never throws to the caller.
 * Logs errors internally so the main operation (e.g., case forward) doesn't fail.
 *
 * @param {Object} data
 * @param {number} [data.caseId]
 * @param {string} data.type - One of NOTIFICATION_CONFIG.TYPES.
 * @param {string} data.message
 * @param {string} data.recipientUserId
 * @param {string} [data.actionUserId]
 * @param {number} [data.actionRoleId]
 * @param {string} [data.caseAuthorUserId]
 * @param {number} [data.originDirectionId]
 * @returns {Promise<void>}
 */
export async function createNotification(data) {
  try {
    await notificationWriteRepository.create(data);
  } catch (error) {
    // Fire-and-forget — never break the parent operation
    logger.error("Failed to create notification (non-blocking)", {
      error: error.message,
      type: data.type,
      recipientUserId: data.recipientUserId,
    });
  }
}

/**
 * Marks a notification as read, with ownership check.
 * @param {number} id
 * @param {string} userId
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function markNotificationAsRead(id, userId) {
  try {
    const result = await notificationWriteRepository.markAsRead(id, userId);
    if (result.count === 0) {
      return { success: false, error: "Notificación no encontrada o ya leída." };
    }
    return { success: true };
  } catch (error) {
    logger.error("Failed to mark notification as read", { error: error.message, id });
    return { success: false, error: "Error al marcar la notificación." };
  }
}

/**
 * Marks all notifications as read for a user.
 * @param {string} userId
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function markAllNotificationsAsRead(userId) {
  try {
    await notificationWriteRepository.markAllAsRead(userId);
    return { success: true };
  } catch (error) {
    logger.error("Failed to mark all as read", { error: error.message, userId });
    return { success: false, error: "Error al marcar todas las notificaciones." };
  }
}
