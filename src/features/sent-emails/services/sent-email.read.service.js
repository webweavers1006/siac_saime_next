import { sentEmailReadRepository } from "../repositories/sent-email.read.repository";
import { logger } from "@/features/shared/lib/logger";

/**
 * Fetches paginated sent emails list for the admin audit page.
 * @param {Object} params — see sentEmailReadRepository.findMany
 * @returns {Promise<Object>} { items, totalCount, totalPages, page, pageSize }
 */
export async function fetchSentEmailsList(params) {
  try {
    return await sentEmailReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch sent emails", { error: error.message });
    throw error;
  }
}
