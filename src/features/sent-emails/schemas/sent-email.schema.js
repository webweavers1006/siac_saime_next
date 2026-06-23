import { z } from "zod";
import { SENT_EMAIL_CONFIG } from "../config/sent-email.constants";

const REASONS = Object.values(SENT_EMAIL_CONFIG.REASONS);
const STATUSES = Object.values(SENT_EMAIL_CONFIG.STATUS);

/**
 * Schema for sending an email (called by other features).
 */
export const sendEmailSchema = z.object({
  type: z.enum(REASONS),
  caseId: z.number().int().positive(),
  userId: z.string().uuid(),
  recipients: z.array(z.string().email()).min(1).max(10),
  data: z.object({
    citizenName: z.string().min(1).max(255),
    caseNumber: z.string().min(1).max(48),
    caseDate: z.string().optional(),
    reason: z.string().optional(),
    status: z.string().optional(),
    directionName: z.string().optional(),
    attentionType: z.string().optional(),
  }),
});

/**
 * Schema for list query params.
 */
export const sentEmailListParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(
    SENT_EMAIL_CONFIG.PAGINATION.MAX_PAGE_SIZE
  ).default(SENT_EMAIL_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE),
  searchTerm: z.string().optional(),
  reason: z.enum(REASONS).optional(),
  status: z.enum(STATUSES).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  caseId: z.number().int().positive().optional(),
  sortKey: z.string().optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
});
