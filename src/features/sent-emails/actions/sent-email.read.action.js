"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { SENT_EMAIL_CONFIG } from "../config/sent-email.constants";
import { fetchSentEmailsList } from "../services/sent-email.read.service";

/**
 * Retrieves the sent emails list (paginated, with filters).
 * Server Action — protected by permission check.
 */
export const getSentEmailsAction = createProtectedFunction(
  SENT_EMAIL_CONFIG.PERMISSIONS.READ,
  async (params) => {
    const result = await fetchSentEmailsList(params);
    return { success: true, data: result };
  }
);
